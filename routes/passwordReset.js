const User = require("../models/User");
const Token = require("../models/Token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const express = require("express");
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({message:"user with given email doesn't exist"});
        }

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }
        const link = `localhost:${process.env.PORT}/pass/${user._id}/${token.token}`;
        await sendEmail(user.email, "Password reset", link);
        res.status(200).send({message:`Email is send to ${user.email}`,link:link})
    }
    catch (err) {
        res.status(400).send({message:"An error occured"});
        console.log(error);
    }
})

router.post("/:userId/:token", async (req, res) => {
    try {
        
        const user = await User.findById(req.params.userId);
        if (!user)
         return res.status(400).send("invalid link or expired");

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        user.password = req.body.password;
        await user.save();
        await token.delete();

        res.send("password reset sucessfully.");
    } catch (error) {
        res.send("An error occured");
        console.log(error);
    }
});


module.exports=router;