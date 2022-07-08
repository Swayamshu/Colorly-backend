const mongoose = require("mongoose");
const { ColorPalette, User, Token } = require("../models");

const getUserId = async (token) => {
    const user = await Token.findOne({ token: token }).populate("userId");
    return user.userId._id;
}

const getColorPalette = async (req, res) => {
    try {
        const token = req.headers.authorization.slice(6);    
        const userId = await getUserId(token);
        const userData = await User.findOne({ _id: userId }).populate("paletteCollection");
        res.status(200).json(userData.paletteCollection);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const createColorPalette = async (req, res) => {
    const userId = req.user._id;
    const { colors, categories, likes } = req.body;

    if (colors.length === 0) {
        res.status(400).send("Color palette cannot be empty.");
    } else {
        const palette = new ColorPalette({
            createdBy: userId,
            categories: "",
            colors: colors,
            likes: likes
        });
        await palette.save();
        res.status(200).json(palette);
    } 
}

const saveColorPalette = async (req, res) => {
    var { colors, paletteId, likedByUser, likes } = req.body;

    try {
        const palette = await ColorPalette.findOne({ colors: colors });
        if (!palette || paletteId === "") {  // palette doesn't exists in db
            paletteId = mongoose.Types.ObjectId();
            const newPalette = new ColorPalette({
                _id: paletteId,
                colors: colors,
                likes: likes + 1,
                likedBy: [likedByUser]
            });
            await newPalette.save();
        }
        // add palette to user's collection
        const user = await User.findOne({ id: likedByUser }).populate("paletteCollection");
        let alreadySaved = false;
        for (id in user.paletteCollection) {
            if (id.colors === colors) alreadySaved = true;
        }
        const updatedPalette = await ColorPalette.findOne({ colors: colors });
        if (!alreadySaved) {
            user.paletteCollection.push(paletteId);
            user.save();
            updatedPalette.likes = updatedPalette.likes + 1;
            updatedPalette.likedBy.push(likedByUser);
            updatedPalette.save();
        }
        res.status(200).json(palette);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

const unsaveColorPalette = async (req, res) => {
    const { paletteId, likedByUser } = req.body;

    try {
        const palette = await ColorPalette.findOne({ _id: paletteId });
        if (palette) {  // palette exists in db
            palette.likedBy.pull(likedByUser);
            palette.likes = palette.likes - 1;
            if (palette.likes < 0) palette.likes = 0;
            palette.save();
            // remove palette from user's collection
            const user = await User.findOne({ id: likedByUser });
            user.paletteCollection.pull(paletteId);
            user.save();
        }
        res.status(200).json(palette);
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ message: err.message });
    }
}

module.exports = {
    getColorPalette,
    createColorPalette,
    saveColorPalette,
    unsaveColorPalette,
}