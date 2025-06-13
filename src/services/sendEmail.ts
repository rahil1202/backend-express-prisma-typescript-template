import nodemailer from 'nodemailer';

import { envConfig } from '../configs/env.ts';

const sendEmail = async (email: string, subject: string, htmlContent: string): Promise<void> => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USERNAME, EMAIL_PASSWORD } = envConfig;

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: true,
      auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
      debug: true,
      connectionTimeout: 30000,
      socketTimeout: 30000,
    });

    const mailOptions = {
      from: `"Rahil Vahora" <rahilisvahora@gmail.com>`,
      to: email,
      subject: subject,
      html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw new Error(
      'Email could not be sent: ' + (error instanceof Error ? error.message : 'Unknown error')
    );
  }
};

export default sendEmail;
