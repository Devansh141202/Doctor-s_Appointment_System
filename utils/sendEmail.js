const nodeMailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    // host: ,
    // port: ,
    service: "gmail",
    auth: {
      user: "tempmailfornode@gmail.com",
      pass: "ntusehvuxgsnzazs",
    },
  });

  const mailOptions = {
    from: "tempmailfornode@gmail.com",
    to: ["dvnshnirmal001@gmail.com"],
    subject: "Appointment Confirm",
    text: "Congratulation your appointment has been confirmed!!🎉🎉",
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
