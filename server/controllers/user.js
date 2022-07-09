const { User, Token } = require("../models");
const { randomBytes } = require("crypto");
const bcrypt = require("bcrypt");

const createToken = (user) => {
    return Token({
        userId: user._id,
        token: randomBytes(40).toString("hex")
    })
}

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400).send("Input field values cannot be empty!");
    } else {
        const alreadyExistingUser = await User.findOne({ email: email });

        if (alreadyExistingUser) {
            res.status(400).send("User with same email id already exists.");
        } else {
            const passwordHash = await bcrypt.hash(password, 10);
            
            const user = new User({
                name: name,
                email: email,
                password: passwordHash
            });
            await user.save();

            const token = createToken(user);
            await token.save();

            res.status(200).json({ token: token.token });
        }
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400).send("Input field values cannot be empty!");
    } else {
        const user = await User.findOne({ email: email });

        if (user) {
            const validPass = await bcrypt.compare(password, user.password);
            
            if (validPass) {
                const token = await Token.findOne({ userId: user._id });
                res.status(200).json({ token: token.token });
            } else {
                res.status(401).send("Invalid password!");
            }
        } else {
            res.status(404).send("User not found!");
        }
    }
}

const getProfile = async (req, res) => {
    const token = req.headers.authorization.slice(6);
    const userTokenObject = await Token.findOne({ token: token });
    const user = await User.findOne({ _id: userTokenObject.userId });
    
    if (user) {
        res.status(200).json({
            userId: user._id,
            name: user.name,
            email: user.email,
            paletteCollection: user.paletteCollection
        });
    } else {
        res.status(404).send("User not found!");
    }
}

module.exports = {
    getProfile,
    register,
    login
}