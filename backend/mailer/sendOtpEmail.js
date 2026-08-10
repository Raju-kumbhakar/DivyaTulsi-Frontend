import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD },
});


const sendOtpEmail = async (email, otp) => {
  try {
    const mailOptions = {
      from: `"Your App Name" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify Your Email",
      html: ` <div> <h2>Email Verification</h2> <p>Thank you for registering.</p> <p>Your OTP for email verification is:</p> <h1 style="letter-spacing: 5px;"> ${otp} </h1> <p>This OTP will expire in <strong>10 minutes</strong>.</p> <p>If you did not create this account, please ignore this email.</p> </div> `,
    };
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
export default sendOtpEmail;
