const express = require("express");
const router = express.Router();
const User = require('../models/User');


router.post('/addskill', async ( req,res )=>{
    try {
        const { email, name, offer } = req.body;
        
        // check if user exists
        const user = await User.findOne({ email });
        if(!user){
            return res.status(404).json({ message: "User not found "});
        }
        // create skill object
        const newSkill = {
            name,
            offer,
        };

        // add to user's skills array
        if(!user.skills){
            user.skills = [];
        }

        user.skills.push(newSkill);
        await user.save();

        res.status(200).json({ message: "Skill added successfully", skills: user.skills });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error });
    }
});

module.exports = router;