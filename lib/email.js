import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const from = `DOSO <${process.env.EMAIL_USER}>` || "DOSO <noreply@doso.com>";
const logoUrl = `${process.env.NEXTAUTH_URL}/doso_logo.jpeg`;

export async function sendApprovalEmail(email, name, tempPassword) {
  await transporter.sendMail({
    from,
    to: email,
    subject: "Your DOSO Registration Has Been Approved!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="DOSO Logo" style="width: 100px; height: auto;">
        </div>
        <h2 style="color: #1a1a2e; text-align: center;">Welcome to DOSO, ${name}!</h2>
        <p>Your registration has been approved. You can now log in using the following temporary password:</p>
        <div style="background: #f4f4f8; padding: 16px; border-radius: 8px; margin: 16px 0; text-align: center;">
          <strong style="font-size: 18px; letter-spacing: 2px;">${tempPassword}</strong>
        </div>
        <p style="color: #e74c3c; font-weight: bold; text-align: center;">Please change your password after your first login.</p>
        <p style="text-align: center;">If you have any questions, please contact the administration.</p>
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="DOSO Logo" style="width: 100px; height: auto;">
        </div>
        <h2 style="color: #1a1a2e; text-align: center;">Hello ${name},</h2>
        <p>We regret to inform you that your registration request has not been approved.</p>
        ${reason ? `<div style="background: #fff3f3; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #e74c3c;"><strong>Reason:</strong> ${reason}</div>` : ""}
        <p>If you believe this is an error or have questions, please contact the administration.</p>
      </div>
    `,
  });
}
export async function sendResetPasswordEmail(email, name, resetLink) {
  await transporter.sendMail({
    from,
    to: email,
    subject: "Reset Your DOSO Password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="DOSO Logo" style="width: 100px; height: auto;">
        </div>
        <h2 style="color: #1a1a2e; text-align: center;">Password Reset Request</h2>
        <p>Hello ${name},</p>
        <p>We received a request to reset your password for your DOSO account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${resetLink}" style="background-color: #1a1a2e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p>This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  });
}
export async function sendSundookApprovalEmail(
  email,
  name,
  year,
  amount,
  receiptNumber,
) {
  await transporter.sendMail({
    from,
    to: email,
    subject: `Sundook Approval for ${year}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="DOSO Logo" style="width: 100px; height: auto;">
        </div>
        <h2 style="color: #1a1a2e; text-align: center;">Sundook Approved!</h2>
        <p>Hello ${name},</p>
        <p>Your Sundook submission for the year <strong>${year}</strong> has been approved.</p>
        <div style="background: #f4f4f8; padding: 16px; border-radius: 8px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Amount:</strong> ₹${amount}</p>
          <p style="margin: 4px 0;"><strong>Receipt Number:</strong> ${receiptNumber}</p>
        </div>
        <p style="text-align: center;">Thank you for your contribution!</p>
      </div>
    `,
  });
}

export async function sendSundookRejectionEmail(email, name, year, reason) {
  await transporter.sendMail({
    from,
    to: email,
    subject: `Sundook Submission Update - ${year}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="${logoUrl}" alt="DOSO Logo" style="width: 100px; height: auto;">
        </div>
        <h2 style="color: #1a1a2e; text-align: center;">Sundook Submission Update</h2>
        <p>Hello ${name},</p>
        <p>We regret to inform you that your Sundook submission for the year <strong>${year}</strong> has not been accepted.</p>
        <div style="background: #fff3f3; padding: 16px; border-radius: 8px; margin: 16px 0; border-left: 4px solid #e74c3c;">
          <strong>Reason:</strong> ${reason}
        </div>
        <p>Please contact the administration or resubmit with the correct details if necessary.</p>
      </div>
    `,
  });
}
