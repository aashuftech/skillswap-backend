const mongoose = require('mongoose');
require("dotenv").config();

// import mongoose from "mongoose";
// import dotenv from "dotenv";

// mongoose.connect(mongoURI)
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.error("MongoDB connection error:", err));

const mongoDB = async()=> {
    try {
        const MONGO_URI = process.env.MONGO_URI;

        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");
        const db = mongoose.connection.db;
        const fetched_data = db.collection("skillswap");

        const data = await fetched_data.find({}).toArray();
        console.log("data fetched", data);
        
    } catch (error) {
        console.error("MongoDB not Connected", error);
    }
}

// export default mongoDB;
module.exports = mongoDB;