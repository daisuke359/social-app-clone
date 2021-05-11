const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {

    try {

        //generate a hashed password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create a new user
        const newUser = new User({
            username : req.body.username,
            email : req.body.email,
            password : hashedPassword
        })

        //save the user and respond
        const user = await newUser.save();
        res.status(200).json(user);
    } catch(err) {
        console.log(error);
    }
})

module.exports = router;