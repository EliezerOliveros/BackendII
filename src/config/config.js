import dotenv from 'dotenv';

dotenv.config();

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`🚨 Faltante variable de entorno: ${name}`);
  }
  return value;
}

export const CONFIG = {
  ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/coder-eats',
  JWT_SECRET: requireEnv('JWT_SECRET'),

  MAIL: {
    USER: requireEnv('NODEMAILER_USER'),
    PASSWORD: requireEnv('NODEMAILER_PASSWORD'),
    HOST: requireEnv('NODEMAILER_HOST'),
    PORT: process.env.NODEMAILER_PORT || 587,
    FROM: process.env.NODEMAILER_FROM || 'Lovecoffe <no-reply@lovecoffe.com>',
  },

  SMS: {
    ACCOUNT_SID: requireEnv('TWILIO_SID'),
    AUTH_TOKEN: requireEnv('TWILIO_AUTH_TOKEN'),
    PHONE_NUMBER: requireEnv('TWILIO_PHONE_NUMBER'),
  },
};
