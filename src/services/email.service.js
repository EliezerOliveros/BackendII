import nodemailer from 'nodemailer';
import { CONFIG } from '../config/config.js';

const transporter = nodemailer.createTransport({
  host: CONFIG.MAIL.HOST,
  port: CONFIG.MAIL.PORT,
  secure: false, // cambia a true si usás puerto 465
  auth: {
    user: CONFIG.MAIL.USER,
    pass: CONFIG.MAIL.PASSWORD,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const result = await transporter.sendMail({
      from: CONFIG.MAIL.FROM,
      to,
      subject,
      html,
    });

    console.log('📬 Email enviado:', result.messageId);
    return result;
  } catch (error) {
    console.error('❌ Error al enviar email:', error);
    throw error;
  }
};
