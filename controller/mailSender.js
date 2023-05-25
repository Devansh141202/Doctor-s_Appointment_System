const nodemailer = require('nodemailer');

async function sendMail(mailOptions) {
    // 1) Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    mailOptions['from'] = process.env.EMAIL_USERNAME;

    // 3) Actually send the email
    const res = await transporter.sendMail(mailOptions);
    if (res.rejected.length > 0) {
        return false;
    }
    return true;
}

module.exports = {
    sendMail
}