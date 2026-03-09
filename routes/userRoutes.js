const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");
const verifyToken = require("../middleware/auth"); // Unga global middleware-ah use panrom

// 📧 Nodemailer Setup (Environment variables check pannikonga)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'makeshkumarsaravanan@gmail.com',
        pass: process.env.EMAIL_PASS || 'jthr cqpo lviw pntr' 
    }
});

/* ==========================================
   1. GET USER PROFILE
============================================= */
router.get("/profile", verifyToken, async (req, res, next) => {
    try {
        // req.user_id verifyToken-la irundhu varum
        const [user] = await db.query("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.user_id]);
        if (user.length === 0) return res.status(404).json({ message: "User not found" });
        res.json({ success: true, data: user[0] });
    } catch (error) {
        next(error);
    }
});



/* ==========================================
   2. UPDATE USER PROFILE
============================================= */
router.put("/update-profile", verifyToken, async (req, res, next) => {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    try {
        await db.query("UPDATE users SET name = ? WHERE id = ?", [name, req.user_id]);
        res.json({ success: true, message: "Profile updated successfully!", newName: name });
    } catch (error) {
        next(error);
    }
});

/* ==========================================
   3. SEND REAL OTP (Email Integration)
============================================= */
router.post("/send-otp", verifyToken, async (req, res) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const userEmail = req.email; // Middleware-la irundhu edukirom

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Railway Portal - Verification OTP',
        text: `Your OTP for profile verification is: ${otp}. Do not share this with anyone.`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${userEmail}: ${otp}`);
        res.json({ 
            success: true, 
            message: "OTP sent to your registered email!", 
            otp: otp // Testing-kaga response-la anupuroam, prod-la idhai avoid pannanum
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to send email" });
    }
});

/* ==========================================
   4. GET USER BOOKINGS (Detailed History)
============================================= */
router.get("/my-bookings", verifyToken, async (req, res, next) => {
    try {
        const query = `
            SELECT b.id, b.pnr, b.seats, b.total_price, b.status, b.booking_date, 
                   t.train_name, t.source, t.destination, t.departure_time
            FROM bookings b
            JOIN trains t ON b.train_id = t.id
            WHERE b.user_id = ?
            ORDER BY b.booking_date DESC`;

        const [bookings] = await db.query(query, [req.user_id]);
        res.json({ success: true, count: bookings.length, data: bookings });
    } catch (error) {
        next(error);
    }
});

module.exports = router;