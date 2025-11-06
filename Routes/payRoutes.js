const express = require("express");
const router = express.Router();

const { createOrder, verifyPayment } = require("../Controllers/payController.js");


// razorpay order

router.post("/create-order", createOrder);

// verify payment

router.post('/verify-payment', verifyPayment);

module.exports = router;