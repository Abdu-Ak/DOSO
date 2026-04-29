import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { logActivity } from "@/lib/activityLogger";
import {
  createDebtRequestSchema,
  adminCreateDebtSchema,
} from "@/lib/validations/debt.validation";
import { sendDebtWitnessNotification } from "@/lib/email";

export async function GET(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    let query = {};

    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) query.createdAt.$gte = new Date(fromDate);
      if (toDate) {
        const end = new Date(toDate);
        end.setHours(23, 59, 59, 999);
        query.createdAt.$lte = end;
      }
    }

    if (session.user.role === "admin" || session.user.role === "super_admin") {
      // Admins see everything
      const status = searchParams.get("status");
      const search = searchParams.get("search");

      if (status) query.status = status;
      if (search) {
        const matchingUsers = await User.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
          ],
        }).select("_id");
        query.requester = { $in: matchingUsers.map((u) => u._id) };
      }
    } else {
      // Alumni see their own requests OR where they are witnesses
      const search = searchParams.get("search");

      let alumniQuery = {
        $or: [
          { requester: session.user.id },
          { witness1: session.user.id },
          { witness2: session.user.id },
        ],
      };

      if (search) {
        // Search by witness name/ID if they are looking for something specific
        const matchingUsers = await User.find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { userId: { $regex: search, $options: "i" } },
          ],
        }).select("_id");

        // They can search for requests where the OTHER party (requester or witness) matches
        alumniQuery.$and = [
          { $or: alumniQuery.$or },
          {
            $or: [
              { requester: { $in: matchingUsers.map((u) => u._id) } },
              { witness1: { $in: matchingUsers.map((u) => u._id) } },
              { witness2: { $in: matchingUsers.map((u) => u._id) } },
              { status: { $regex: search, $options: "i" } }, // Also allow searching by status
            ],
          },
        ];
        delete alumniQuery.$or;
      }

      Object.assign(query, alumniQuery);
    }

    const total = await DebtRequest.countDocuments(query);
    const records = await DebtRequest.find(query)
      .populate("requester", "name email userId image")
      .populate("witness1", "name email userId")
      .populate("witness2", "name email userId")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return NextResponse.json({
      records,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error("GET DebtRequests Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch debt requests" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Admin Creation Flow
    if (session.user.role === "admin" || session.user.role === "super_admin") {
      const validatedData = adminCreateDebtSchema.parse(body);

      const newRequest = await DebtRequest.create({
        requester: validatedData.alumni,
        amount: validatedData.amount,
        payment_type: validatedData.payment_type,
        duration_months: validatedData.duration_months,
        witness1: validatedData.witness1,
        witness2: validatedData.witness2,
        status: "approved",
        witness1_status: "approved",
        witness2_status: "approved",
        admin_status: "approved",
      });

      const alumniUser = await User.findById(validatedData.alumni);

      await logActivity({
        actionType: "CREATE",
        module: "Debt Module",
        title: "Debt Created (Admin)",
        description: `Created debt record for "${alumniUser?.name || "unknown alumni"}" (Amount: ₹${validatedData.amount})`,
        icon: "CreditCard",
      });

      return NextResponse.json(newRequest, { status: 201 });
    }

    // Alumni Creation Flow
    if (session.user.role === "alumni") {
      const validatedData = createDebtRequestSchema.parse(body);

      // Security checks
      if (
        validatedData.witness1 === session.user.id ||
        validatedData.witness2 === session.user.id
      ) {
        return NextResponse.json(
          { error: "You cannot be your own witness" },
          { status: 400 },
        );
      }

      const newRequest = await DebtRequest.create({
        ...validatedData,
        requester: session.user.id,
        status: "pending_witness",
      });

      // Send notifications to witnesses
      const [w1, w2] = await Promise.all([
        User.findById(validatedData.witness1),
        User.findById(validatedData.witness2),
      ]);

      const portalLink = `${process.env.NEXTAUTH_URL}/alumni/debt`;

      if (w1?.email) {
        await sendDebtWitnessNotification(
          w1.email,
          w1.name,
          session.user.name,
          portalLink,
        );
      }
      if (w2?.email) {
        await sendDebtWitnessNotification(
          w2.email,
          w2.name,
          session.user.name,
          portalLink,
        );
      }

      return NextResponse.json(newRequest, { status: 201 });
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  } catch (error) {
    console.error("POST DebtRequest Error:", error);
    if (error.name === "ZodError" || error.issues) {
      return NextResponse.json(
        {
          error:
            error.errors?.[0]?.message ||
            error.issues?.[0]?.message ||
            "Validation Error",
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
