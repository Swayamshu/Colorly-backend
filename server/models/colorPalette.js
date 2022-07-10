const mongoose = require("mongoose");

const colorPaletteSchema = new mongoose.Schema(
    {
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        likedBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            }
        ],
        title: String,
        colors: [String],
        categories: String,
        likes: Number,
    },
    { timestamps: true }
);

module.exports = mongoose.model("ColorPalette", colorPaletteSchema);