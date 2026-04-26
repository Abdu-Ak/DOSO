import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import DebtRequest from "@/models/DebtRequest";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { witnessResponseSchema } from "@/lib/validations/debt.validation";
import { sendDebtWitnessRespondNotification } from "@/lib/email";

export async function PATCH(request, { params }) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "alumni") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { status, reason } = witnessResponseSchema.parse(body);

    const debtRequest = await DebtRequest.findById(id).populate(
      "requester",
      "name email",
    );
    if (!debtRequest) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    // Check if the user is one of the witnesses
    const isWitness1 = debtRequest.witness1.toString() === session.user.id;
    const isWitness2 = debtRequest.witness2.toString() === session.user.id;

    if (!isWitness1 && !isWitness2) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    if (isWitness1) {
      debtRequest.witness1_status = status;
      debtRequest.witness1_reason = reason;
    } else {
      debtRequest.witness2_status = status;
      debtRequest.witness2_reason = reason;
    }

    // Update overall status
    if (status === "rejected") {
      debtRequest.status = "witness_rejected";
    } else {
      // If this witness approved, check if both approved
      const otherStatus = isWitness1
        ? debtRequest.witness2_status
        : debtRequest.witness1_status;
      if (otherStatus === "approved") {
        debtRequest.status = "pending_admin";
      }
    }

    await debtRequest.save();

    // Notify requester
    if (debtRequest.requester?.email) {
      await sendDebtWitnessRespondNotification(
        debtRequest.requester.email,
        debtRequest.requester.name,
        session.user.name,
        status,
        reason,
      );
    }

    return NextResponse.json(debtRequest);
  } catch (error) {
    console.error("PATCH Witness Error:", error);
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
