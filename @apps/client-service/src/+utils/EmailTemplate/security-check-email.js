const nodemailer = require("nodemailer");

// Sending Emails
const sendEmail = async (option) => {
  // 1) Create a transporter
  // let poolConfig = `smtps://${process.env.SECURITY_CHECK_EMAIL_USERNAME}:${process.env.SECURITY_CHECK_EMAIL_PASSWORD}@${process.env.EMAIL_HOST}/?pool=true`;
  // const transporter = nodemailer.createTransport(poolConfig);

  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.SECURITY_CHECK_EMAIL_USERNAME,
      pass: process.env.SECURITY_CHECK_EMAIL_PASSWORD,
    },
  });

  // 2) Define email options

  const mailOption = {
    from: `Krikia Security Check <${process.env.SECURITY_CHECK_EMAIL_USERNAME}>`,
    to: option.email,
    subject: option.subject,
    html: option.message,
    // html
  };

  // verify connection configuration
  await transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  // 3) Actually send the email

  return await transporter.sendMail(mailOption);
};

module.exports = sendEmail;
