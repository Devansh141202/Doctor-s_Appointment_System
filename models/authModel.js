const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        token: {
            type: String,
            required: true,
            unique: true,
        },
        context: {
            type: String,
            required: true,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
        isUsed: {
            type: Boolean,
            default: false,
        }
    },
);

const authModel = mongoose.model("auth", authSchema);

module.exports = authModel;
