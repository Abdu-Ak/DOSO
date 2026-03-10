import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.SMTP_FROM || "DOSO <noreply@doso.com>";

export async function sendApprovalEmail(email, name, tempPassword) {
  await transporter.sendMail({
    from,
    to: email,
    subject: "Your DOSO Registration Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a2e;">Welcome to DOSO, ${name}!</h2>
        <p>Your registration has been approved. You can now log in using the following temporary password:</p>
        <div style="background: #f4f4f8; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
          <strong style="font-size: 18px; letter-spacing: 2px;">${tempPassword}</strong>
        </div>
        <p style="color: #e74c3c; font-weight: bold;">Please change your password after your first login.</p>
        <p>If you have any questions, please contact the administration.</p>
      </div>
    `,
  });
}

export async function sendRejectionEmail(email, name, reason) {
  await transporter.sendMail({
    from,
    to: email,
    subject: "DOSO Registration Update",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1a1a2e;">Hello ${name},</h2>
        <p>We regret to inform you that your registration request has not been approved.</p>
        ${reason ? `<div style="background: #fff3f3; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #e74c3c;"><strong>Reason:</strong> ${reason}</div>` : ""}
        <p>If you believe this is an error or have questions, please contact the administration.</p>
      </div>
    `,
  });
}
