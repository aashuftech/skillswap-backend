const dotenv = require("dotenv");
dotenv.config();

const Razorpay = require("razorpay");
const crypto = require("crypto");

// Create a new order (user clicks Pay)
const createOrder = async (req, res) => {
    console.log("Loaded Key ID:", process.env.RAZORPAY_KEY_ID);
console.log("Loaded Key Secret:", process.env.RAZORPAY_KEY_SECRET);
  try {
    // Razorpay instance with secret keys
    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const { amount, currency } = req.body;

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
    };

    // Create order on Razorpay servers
    const order = await instance.orders.create(options);
    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("Payment error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// Verify payment signature (after success)
const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSign === razorpay_signature;

    if (isAuthentic) {
      res.status(200).json({ success: true, message: "Payment Verified" });
    } else {
      res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Verification error", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { createOrder, verifyPayment };
