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
        mobileNumber: {
            type: String,
            required: true,
            unique: true,
        },
        whatsappNumber: {
            type: String,
            required: true,
            unique: true,
            default: "",
        },
        seenNotifications: {
            type: Array,
            default: [],
        },
        unseenNotifications: {
            type: Array,
            default: [],
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

const userModel = mongoose.model("users", userSchema);

module.exports = userModel;
