import nodemailer from "nodemailer";

const sendEmail = async ({ email, subject, message }) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAILTRAP_FROM_EMAIL,
      to: email,
      subject,
      text: message,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Error sending email:", error);
    throw error;
  }
};

export default sendEmail;
