import { createTransport } from 'nodemailer';

const sendEmail = async options => {
  // Create a transporter
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define the email options
  const mailOptions = {
    from: 'John Doe <jd@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };

  // Send the email
  await transporter.sendMail(mailOptions);
};

export default sendEmail;
