const mongoose = require("mongoose");

const tokenSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        token: String
    },
    { timestamps: true }
);

module.exports = mongoose.model("Token", tokenSchema);