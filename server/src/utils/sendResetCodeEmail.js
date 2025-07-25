import nodemailer from 'nodemailer';
import mjml2html from 'mjml';
import { generateResetPasswordMJML } from '../emails/resetPasswordTemplate.js';

export const sendResetCodeEmail = async (to, code) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD, // le mot de passe d'application fourni par Google
    },
  });

  const templateMJML = generateResetPasswordMJML(code);
  const { html } = mjml2html(templateMJML); // MJML → HTML

  await transporter.sendMail({
    from: `"Job Tracker" <${process.env.GMAIL_USER}>`,
    to,
    subject: 'Votre code de réinitialisation',
    html,
  });
};
