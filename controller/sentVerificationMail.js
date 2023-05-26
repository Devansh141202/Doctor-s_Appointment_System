const Auth = require("../models/authModel");
const mailService = require("../controller/mailSender");
const crypto = require("crypto");


async function sentVerificationMail(user) {
    let auth = await getAuth(user, 'email-verification');
    let link = `${process.env.BASE_URL}/verify-email/${auth.token}`;
    const mailOptions = {
        to: 'tiwariketan11@gmail.com',  // user.email
        subject: 'Email Verification For Appelion Account',
        html: `
        <p>Hi ${user.name},</p>
        <p>We just need to verify your email address before you start using your Appelion account.</p>

        <b>Verify your email address: <a href="${link}">Click here to verify</a></b>

        <p>Thank you,</p>
        <p>Regards,</p>
        <p>Appelion Team</p>`
    };

    const isSent = await mailService.sendMail(mailOptions);
    return isSent;
}

async function getAuth(user, context) {
    try {
        let auth = await Auth.find({
            username: user.username,
            email: user.email,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            isUsed: false,
            context: context
        })

        if (auth.length == 0) {
            auth = await new Auth({
                username: user.username,
                email: user.email,
                token: crypto.randomBytes(32).toString("hex"),
                context: context,
            }).save();
        }
        else {
            auth = auth[0];
        }
        return auth;
    } catch (err) {
        console.log(err);
        return false;
    }
}


module.exports = {
    sentVerificationMail,
    getAuth
};