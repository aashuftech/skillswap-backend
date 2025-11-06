const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


const jwtSecret = "SKillSwapProjectByAshuFTech@77";

router.post("/signup",

    body("email").isEmail().withMessage("Invalid email"),
    body("name").isLength({ min: 5}).withMessage("Name too short"),
    body("password").isLength({ min: 5}).withMessage("Password too short/weak"),

    async( req, res )=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const salt = await bcrypt.genSalt(10);
        const secPassword = await bcrypt.hash(req.body.password, salt);
        try {
           const user =  await User.create({
                name: req.body.name,
                password: secPassword,
                email: req.body.email,
                location: req.body.location
            })
            const data = {
                user: {
                    id: user.id
                }
            };
            const authToken = jwt.sign(data, jwtSecret);

            res.json({ success:true, authToken });

        } catch (error) {
            console.log(error);
            res.json({ success: false });
        }
})

module.exports = router;