const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // New fields
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["user", "doctor", "admin"],
            default: "user",
        },
        // isDoctor: {
        //     type: Boolean,
        //     default: false,
        // },
        // isAdmin: {
        //     type: Boolean,
        //     default: false,
        // },
        seenNotifications: {
            type: Array,
            default: [],
        },
        unseenNotifications: {
            type: Array,
            default: [],
        },
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
