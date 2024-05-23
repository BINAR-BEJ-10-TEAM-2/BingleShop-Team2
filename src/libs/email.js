const nodemailer = require('nodemailer');

const { EMAIL_ADDRESS, EMAIL_PASSWORD } = process.env;
const sendingMail = async ({
  from, to, subject, text, next,
}) => {
  try {
    const mailOptions = ({
      from,
      to,
      subject,
      text,
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

  try {
    await sendingMail({
      from: 'no-reply@bingleshop.com',
      to: email,
      subject: 'Verify Your Email',
      text: `Hello, ${fullName},
      Please verify your bingleshop email by clicking this link:
      http://localhost:3000/api/users/verify-email/activation?token=${token}`,
      next,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendVerificationEmail };
