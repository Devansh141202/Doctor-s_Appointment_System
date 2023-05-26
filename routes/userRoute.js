const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const Doctor = require("../models/doctorModel");
const Auth = require("../models/authModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const Appointment = require("../models/appointmentModel");
const moment = require("moment");
const axios = require("axios");
const mailService = require("../controller/mailSender");
const crypto = require("crypto");
const { sendVerificationMail, getAuth } = require("../controller/sentVerificationMail");


router.post("/register", async (req, res) => {
    try {
        const token = req.body.token;
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );

        // Check response status and send back to the client-side
        if (response.data.success) {
            console.log("Human");
            let userExists = await User.findOne({ email: req.body.email });
            if (userExists) {
                return res
                    .status(200)
                    .send({ message: "User already exists", success: false });
            }
            userExists = await User.findOne({ username: req.body.username });
            if (userExists) {
                return res
                    .status(200)
                    .send({ message: "Username already exists", success: false });
            }

            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;
            const newuser = new User(req.body);
            await newuser.save();
            const isSent = await sentVerificationMail(newuser);
            if (!isSent) {
                console.log("Error sending verification mail");
            }
            return res
                .status(200)
                .send({ message: "User created successfully", success: true });
        } else {
            console.log("Robot");
            return res
                .status(200)
                .send({ message: "Captcha authentication failed, please try again.", success: false });
        }
    } catch (error) {
        console.log(error);
        return res
            .status(200)
            .send({ message: "Error creating user", success: false, error });
    }
});

router.post("/login", async (req, res) => {
    try {
        const token = req.body.token;
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );

        // Check response status and send back to the client-side
        if (response.data.success) {
            console.log("Human");
            let user;
            if (!req.body.email == "") {
                user = await User.findOne({ email: req.body.email });
            }
            else if (!req.body.username == "") {
                user = await User.findOne({ username: req.body.username });
            }

            if (!user) {
                return res
                    .status(200)
                    .send({ message: "User does not exist", success: false });
            }

            const isMatch = await bcrypt.compare(req.body.password, user.password);
            if (!isMatch) {
                return res
                    .status(200)
                    .send({ message: "Password is incorrect", success: false });
            } else {
                const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
                    expiresIn: "1 hour",
                });
                return res
                    .status(200)
                    .send({ message: "Login successful", success: true, data: token });
            }
        } else {
            console.log("Robot");
            return res
                .status(200)
                .send({ message: "Captcha authentication failed, please try again.", success: false });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).send({ message: "Error logging in", success: false, error });
    }
});

router.post("/get-user-info-by-id", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.password = undefined;
        if (!user) {
            return res
                .status(200)
                .send({ message: "User does not exist", success: false });
        } else {
            console.log(user);
            return res.status(200).send({
                success: true,
                data: user,
            });
        }
    } catch (error) {
        return res
            .status(200)
            .send({ message: "Error getting user info", success: false, error });
    }
});

router.post("/apply-doctor-account", authMiddleware, async (req, res) => {
    try {
        const newdoctor = new Doctor({ ...req.body, status: "pending" });
        await newdoctor.save();
        let adminUser = await User.findOne({ role: 'admin' });
        const unseenNotifications = adminUser.unseenNotifications;

        unseenNotifications.push({
            type: "new-doctor-request",
            message: `${newdoctor.firstName} ${newdoctor.lastName} has applied for a doctor account`,
            data: {
                doctorId: newdoctor._id,
                name: newdoctor.firstName + " " + newdoctor.lastName,
            },
            onClickPath: "/admin/doctorslist",
        });

        await User.findByIdAndUpdate(adminUser._id, { unseenNotifications });

        return res.status(200).send({
            success: true,
            message: "Doctor account applied successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

router.post("/mark-all-notifications-as-seen", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        const unseenNotifications = user.unseenNotifications;
        const seenNotifications = user.seenNotifications;
        seenNotifications.push(...unseenNotifications);
        user.unseenNotifications = [];
        user.seenNotifications = seenNotifications;
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        return res.status(200).send({
            success: true,
            message: "All notifications marked as seen",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

router.post("/delete-all-notifications", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.userId });
        user.seenNotifications = [];
        user.unseenNotifications = [];
        const updatedUser = await user.save();
        updatedUser.password = undefined;
        return res.status(200).send({
            success: true,
            message: "All notifications cleared",
            data: updatedUser,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

router.get("/get-all-approved-doctors", authMiddleware, async (req, res) => {
    try {
        const doctors = await Doctor.find({ status: "approved" });
        return res.status(200).send({
            message: "Doctors fetched successfully",
            success: true,
            data: doctors,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error applying doctor account",
            success: false,
            error,
        });
    }
});

router.post("/book-appointment", authMiddleware, async (req, res) => {
    try {
        req.body.status = "pending";
        req.body.date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        req.body.time = moment(req.body.time, "HH:mm").toISOString();
        const newAppointment = new Appointment(req.body);
        await newAppointment.save();
        //pushing notification to doctor based on his userid
        const user = await User.findOne({ _id: req.body.doctorInfo.userId });
        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `A new appointment request has been made by ${req.body.userInfo.name}`,
            onClickPath: "/doctor/appointments",
        });
        await user.save();
        return res.status(200).send({
            message: "Appointment booked successfully",
            success: true,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error booking appointment",
            success: false,
            error,
        });
    }
});

router.post("/check-booking-avilability", authMiddleware, async (req, res) => {
    try {
        const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
        const fromTime = moment(req.body.time, "HH:mm")
            .subtract(1, "hours")
            .toISOString();
        const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
        const doctorId = req.body.doctorId;
        const appointments = await Appointment.find({
            doctorId,
            date,
            time: { $gte: fromTime, $lte: toTime },
        });
        if (appointments.length > 0) {
            return res.status(200).send({
                message: "Appointments not available",
                success: false,
            });
        } else {
            return res.status(200).send({
                message: "Appointments available",
                success: true,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error booking appointment",
            success: false,
            error,
        });
    }
});

router.get("/get-appointments-by-user-id", authMiddleware, async (req, res) => {
    try {
        const appointments = await Appointment.find({ userId: req.body.userId });
        return res.status(200).send({
            message: "Appointments fetched successfully",
            success: true,
            data: appointments,
        });
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error fetching appointments",
            success: false,
            error,
        });
    }
});

router.post("/email", authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        const mailOptions = {
            to: ["tiwariketan11@gmail.com"], // user.email
            subject: "Appointmet Confirmation Mail",
            html: `<h1>Hi ${user.name}</h1>,
            <p>Your appointment has been confirmed with ${req.body.doctorName} on ${req.body.date} at ${req.body.time}</p>`
        };

        const isSent = await mailService.sendMail(mailOptions);
        if (isSent) {
            return res.status(200).send({
                message: "Email sent successfully",
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "Error sending email",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error sending email",
            success: false,
        });
    }
});

router.post("/send-forgot-password-email", async (req, res) => {
    try {
        let { username, email } = req.body;
        let user;
        if (username && !email) {
            user = await User.findOne({ username: username });
        }
        else {
            user = await User.findOne({ email: email });
        }

        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        }
        console.log(user);

        let auth = getAuth(user, 'forgot-password');

        console.log(auth);
        let link = `${process.env.BASE_URL}/reset-password/${auth.token}`;
        const mailOptions = {
            to: 'tiwariketan11@gmail.com',  //user.email
            subject: 'Password Reset for Doctor Appointment System...',
            html: `
                <!doctype html>
                <html lang="en-US">

                <head>
                    <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                    <title>Reset Password</title>
                    <meta name="description" content="Reset Password">
                    <style type="text/css">
                        a:hover {text-decoration: underline !important;}
                    </style>
                </head>

                <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                    <!--100% body table-->
                    <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                        style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,200,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
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
                                                        <h1 style="color:#1e1e2d; font-weight:200; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
                                                            requested to reset your password</h1>
                                                        <span
                                                            style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                        <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
                                                            We cannot simply send you your old password. A unique link to reset your
                                                            password has been generated for you. To reset your password, click the
                                                            following link and follow the instructions.
                                                        </p>
                                                        <!-- URL TO BE SENT TO THE Password -->
                                                        <a href="${link}"
                                                            style="background:#20e277;text-decoration:none !important; font-weight:200; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
                                                            Password</a>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="height:40px;">&nbsp;</td>
                                                </tr>
                                            </table>
                                        </td>
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
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!--/100% body table-->
                </body>

                </html>
`
        };

        const isSent = await mailService.sendMail(mailOptions);
        if (isSent) {
            return res.status(200).send({
                message: "Email sent successfully",
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "Error sending email",
                success: false,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error sending email",
            success: false,
        });
    }
});

router.post("/reset-password/:token", async (req, res) => {
    try {
        let auth = await Auth.findOne({
            token: req.params.token,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            isUsed: false,
            context: "forgot-password",
        });
        console.log(auth);
        if (auth) {
            const password = req.body.password;
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            const user = await User.findOneAndUpdate({
                username: auth.username,
            }, {
                password: hashedPassword,
            });
            await Auth.findByIdAndUpdate(auth._id, { isUsed: true });
            console.log(user);
            return res.status(200).send({
                message: "Password reset successfully",
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "Token expired",
                success: false,
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error resetting password",
            success: false,
        });
    }
});

router.post("/change-password", authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword });
        console.log(updatedUser);
        if (updatedUser) {
            return res.status(200).send({
                message: "Password changed successfully",
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "Error changing password",
                success: false,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error changing password",
            success: false,
        });
    }
});

router.get("/verify-email/:token", async (req, res) => {
    try {
        let auth = await Auth.findOne({
            token: req.params.token,
            createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
            isUsed: false,
            context: "email-verification",
        });
        console.log(auth);
        if (auth) {
            const user = await User.findOneAndUpdate({
                username: auth.username,
            }, {
                isEmailVerified: true,
            });
            await Auth.findByIdAndUpdate(auth._id, { isUsed: true });
            console.log(user);
            return res.status(200).send({
                message: "Email verified successfully",
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "Token expired",
                success: false,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error verifying email",
            success: false,
        });
    }
});

router.get("/resend-verification-email", authMiddleware, async (req, res) => {
    try {
        const userId = req.body.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(200).send({
                message: "User not found",
                success: false,
            });
        }
        if (user.isEmailVerified) {
            return res.status(200).send({
                message: "Email already verified",
                success: true,
            });
        }

        const isSent = await sendVerificationMail(user);
        if (isSent) {
            return res.status(200).send({
                message: "Email sent successfully",
                success: true,
            });
        }
        else {
            return res.status(200).send({
                message: "Error sending email",
                success: false,
            });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(200).send({
            message: "Error sending email",
            success: false,
        });
    }
});

module.exports = router;