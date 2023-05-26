const Appointment = require("../models/appointmentModel");
const mailService = require("../controller/mailSender");

const sendConfirmationEmail = async (appointmentId) => {
    try {
        const appointment = await Appointment.findOne({ _id: appointmentId });

        const mailOptions = {
            to: "tiwariketan11@gmail.com", // user.email
            subject: "Appointmet Confirmation Email",
            html: `<h1>Hi ${appointment.userInfo.name}</h1>,
            <p>Your appointment has been confirmed with ${appointment.doctorInfo.firstName} ${appointment.doctorInfo.lastName} on ${appointment.time}</p>`
        };

        let isSent = await mailService.sendMail(mailOptions);
        return isSent;
    }
    catch (error) {
        console.log(error);
    }
};

module.exports = sendConfirmationEmail;
