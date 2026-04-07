import nodemailer from 'nodemailer';
import { config } from '../config.js';

let transporterPromise;

async function getTransporter() {
  if (transporterPromise) {
    return transporterPromise;
  }

  transporterPromise = Promise.resolve().then(async () => {
    if (!config.smtp.host || !config.smtp.user || !config.smtp.pass) {
      return null;
    }

    return nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      secure: config.smtp.secure,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.pass,
      },
    });
  });

  return transporterPromise;
}

export async function sendEmail({ to, subject, html, text }) {
  const transporter = await getTransporter();

  if (!transporter) {
    console.warn(`[mail] SMTP is not configured. Intended email to ${to}: ${subject}`);
    return;
  }

  await transporter.sendMail({
    from: config.emailFrom,
    to,
    subject,
    text,
    html,
  });
}

export async function sendVerificationEmail({ email, username, verificationLink }) {
  await sendEmail({
    to: email,
    subject: 'Verify your EduVault account',
    text: `Hi ${username}, verify your account by opening: ${verificationLink}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
        <h2>Verify your EduVault account</h2>
        <p>Hi ${username},</p>
        <p>Click the button below to verify your email address and activate your account.</p>
        <p style="margin:24px 0">
          <a href="${verificationLink}" style="background:#4f46e5;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Verify email</a>
        </p>
        <p>If you did not create this account, you can safely ignore this email.</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail({ email, username, resetLink }) {
  await sendEmail({
    to: email,
    subject: 'Reset your EduVault password',
    text: `Hi ${username}, reset your password using this link: ${resetLink}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#0f172a">
        <h2>Reset your EduVault password</h2>
        <p>Hi ${username},</p>
        <p>We received a request to reset your password. Use the button below to choose a new one.</p>
        <p style="margin:24px 0">
          <a href="${resetLink}" style="background:#0f172a;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none">Reset password</a>
        </p>
        <p>If you did not request this change, you can ignore this email.</p>
      </div>
    `,
  });
}
