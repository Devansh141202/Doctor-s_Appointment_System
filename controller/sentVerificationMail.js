const Auth = require("../models/authModel");
const mailService = require("../controller/mailSender");
const crypto = require("crypto");


async function sendVerificationMail(user) {
    let auth = await getAuth(user, 'email-verification');
    let link = `${process.env.BASE_URL}/verify-email/${auth.token}`;
    const mailOptions = {
        to: user.email,  // user.email
        subject: 'Email Verification For Appelion Account',
        html: `
                <!doctype html>
                <html lang="en-US">

                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Email Verification</title>
                    <meta name="description" content="Email Verification">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>

                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                        <tr>
                            <td>
                                <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                    align="center" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                        <a href="https://rakeshmandal.com" title="logo" target="_blank">
                                            LOGO OF OUR APP
                                            <img width="60" src="https://i.ibb.co/hL4XZp2/android-chrome-192x192.png" title="logo" alt="logo">
                                        </a>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                                style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                                <tr>
                                                    <td style="padding:0 35px;">
                                                        <h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Thank You for Register yourself on Appelion!</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                            We just need to verify your email address before you start using your Appelion account.
                                                        </p>
                                                        <!-- URL TO BE SENT TO THE Password -->
                                                        <a href="${link}"
                                                            style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Verify Email</a>

                                                            <p>Thank you,</p>
                                                            <p>Regards,</p>
                                                            <p>Appelion Team</p>
                                                    </td >
                                                </tr >
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table >
                                        </td >
                                    <tr>
                                        <td style="height:20px;">&nbsp;</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center;">
                                            <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>OUR WEBSITE URL</strong></p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="height:80px;">&nbsp;</td>
                                    </tr>
                                </table >
                            </td >
                        </tr >
                    </table >
                    < !--/100% body table-->
                </body >

                </html >
        `
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
    sendVerificationMail,
    getAuth
};