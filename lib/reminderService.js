import dbConnect from "./mongodb";
import DebtRequest from "../models/DebtRequest";
import { transporter } from "./email"; // Assuming transporter is exported, let check email.js
import User from "../models/User";
import { logActivity } from "./activityLogger";

// Helper to send email (reusing transporter logic from email.js)
async function sendReminderEmail(email, name, amount, dueDate, daysLeft) {
  const from = `DOSO <${process.env.EMAIL_USER}>`;
  const logoUrl = `${process.env.NEXTAUTH_URL}/doso_logo.jpeg`;

  await transporter.sendMail({
    from,
    to: email,
    subject: `Repayment Reminder: Your Debt is Due in ${daysLeft} Days`,
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <img src="${logoUrl}" alt="DOSO Logo" style="width: 100px; height: auto;">
                </div>
                <h2 style="color: #1a1a2e; text-align: center;">Repayment Reminder</h2>
                <p>Hello ${name},</p>
                <p>This is a reminder that your debt repayment of <strong>₹${amount}</strong> is due on <strong>${new Date(dueDate).toLocaleDateString()}</strong>.</p>
                <div style="background: #f4f4f8; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
                    <strong style="font-size: 18px; color: #e74c3c;">${daysLeft} Days Left</strong>
                </div>
                <p>Please ensure that you repay the amount before the due date to maintain your standing in the portal.</p>
                <p style="text-align: center;">If you have already repaid, please contact the administration to update your record.</p>
            </div>
        `,
  });
}

export async function checkAndSendReminders() {
  await dbConnect();
  const today = new Date();
  const tenDaysFromNow = new Date();
  tenDaysFromNow.setDate(today.getDate() + 10);

  // Set range for "exactly 10 days" to avoid missing or double sending if run multiple times a day
  // though usually a status field or lastReminderSent is better.
  const startOfTenDays = new Date(tenDaysFromNow);
  startOfTenDays.setHours(0, 0, 0, 0);
  const endOfTenDays = new Date(tenDaysFromNow);
  endOfTenDays.setHours(23, 59, 59, 999);

  const dueSoonDebts = await DebtRequest.find({
    status: "approved",
    $or: [
      // Single payment due in 10 days
      {
        payment_type: "single",
        dueDate: { $gte: startOfTenDays, $lte: endOfTenDays },
      },
      // EMI installment due in 10 days
      {
        payment_type: "emi",
        "installments.dueDate": { $gte: startOfTenDays, $lte: endOfTenDays },
        "installments.status": "pending",
      },
    ],
  }).populate("requester", "name email phone");

  console.log(`Found ${dueSoonDebts.length} debts due in 10 days.`);

  for (const debt of dueSoonDebts) {
    if (debt.requester?.email) {
      let amountDue = debt.amount;
      let dueDate = debt.dueDate;

      if (debt.payment_type === "emi") {
        const upcomingInstallment = debt.installments.find(
          (i) =>
            i.status === "pending" &&
            i.dueDate >= startOfTenDays &&
            i.dueDate <= endOfTenDays,
        );
        if (upcomingInstallment) {
          amountDue = upcomingInstallment.amount;
          dueDate = upcomingInstallment.dueDate;
        }
      }

      try {
        await sendReminderEmail(
          debt.requester.email,
          debt.requester.name,
          amountDue,
          dueDate,
          10,
        );
        debt.lastReminderSent = new Date();
        await debt.save();

        await logActivity({
          actionType: "UPDATE",
          module: "Debt Module",
          title: "Reminder Sent",
          description: `Automated 10-day reminder sent to "${debt.requester.name}"`,
          icon: "Bell",
        });
      } catch (err) {
        console.error(
          `Failed to send reminder to ${debt.requester.email}:`,
          err,
        );
      }
    }
  }
}
