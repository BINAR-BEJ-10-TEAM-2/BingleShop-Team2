const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const { EMAIL_ADDRESS, EMAIL_PASSWORD, HOST_PROD } = process.env;
const sendingMail = async ({
  from, to, subject, html, next,
}) => {
  try {
    const mailOptions = ({
      from,
      to,
      subject,
      html,
    });

    //create a transporter
    const Transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: EMAIL_ADDRESS,
        pass: EMAIL_PASSWORD,
      },
    });

    //return the Transporter variable which has the sendMail method to send the mail
    return await Transporter.sendMail(mailOptions);
  } catch (error) {
    next(error);
  }
};

const sendVerificationEmail = async (user, token, next) => {
  const { email, fullName } = user;
  const templateEmailPath = path.join(__dirname, 'email-template', 'email.html');
  try {
    const emailTemplate = fs.readFileSync(templateEmailPath, 'utf8');
    const verificationLink = `${HOST_PROD}/api/users/verify-email/activation?token=${token}`;
    const htmlContent = emailTemplate
      .replace(/{{fullName}}/g, fullName)
      .replace(/{{verificationLink}}/g, verificationLink);

    await sendingMail({
      from: 'no-reply@bingleshop.com',
      to: email,
      subject: 'Verify Your Email',
      html: htmlContent,
      next,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendVerificationEmail };
