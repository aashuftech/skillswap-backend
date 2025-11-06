const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const jwtSecret = "SKillSwapProjectByAshuFTech@77";


router.post('/loginuser',
    body("email").isEmail().withMessage("Invalid Email"),
    body("password").isLength({ min:5 }).withMessage("Password too short/weak"),

    async ( req,res)=>{

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            console.log("validation failed:",errors.array())                 /*--------------*/
            return res.status(400).json({ errors: errors.array() });
        }

        let email = req.body.email;
        console.log("Login attempt for login", email);           /*--------------*/
        try {
            let userData = await User.findOne({ email });
            if(!userData){
                console.log("No user found with gmail:", email);   /*--------------*/
                return res.status(400).json({ errors: "Please logging with correct credentials." });
            }
            console.log("User Found", userData.email);      /*--------------*/

            const pwdCompare = await bcrypt.compare(req.body.password, userData.password);
            console.log("Password match result:", pwdCompare);   /*--------------*/

            if(!pwdCompare){
                console.log("Incorrect password for", email);      /*--------------*/
                return res.status(400).json({ errors: errors.array() });
            }
            const data = {
                user: {
                    id: userData.id
                }
            }

            const authToken = jwt.sign(data,jwtSecret);
            console.log("login successful, token generated");      /*--------------*/
            return res.json({ success: true, authToken:authToken, email: req.body.email });
            
        } catch (error) {
            console.log("Server error",error);
            res.json({ success: false });
        }
    }
)

module.exports = router;