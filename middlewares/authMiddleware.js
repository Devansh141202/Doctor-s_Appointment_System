const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    try {
        const token = req.headers["authorization"].split(" ")[1];
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(401).send({
                    message: "Auth failed",
                    success: false,
                });
            } else {
                // let user = await User.findOne({ _id: decoded.id });
                req.body.userId = decoded.id;
                // user = user.toJSON();
                next();
                // if (req.baseUrl === '/api/user') {
                //     req.body.userId = decoded.id;
                //     next();
                // }
                // else if (req.baseUrl === '/api/doctor' && ((user.role === 'doctor'))) {
                //     req.body.userId = decoded.id;
                //     next();
                // }
                // else if (req.baseUrl === '/api/admin' && (user.role === 'admin')) {
                //     req.body.userId = decoded.id;
                //     next();
                // }
                // else {
                //     return res.status(401).send({
                //         message: "Auth failed",
                //         success: false,
                //     });
                // }
            }
        });
    } catch (error) {
        return res.status(401).send({
            message: "Auth failed",
            success: false,
        });
    }
};
