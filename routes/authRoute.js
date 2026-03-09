const express = require('express');
const router = express.Router();
const db = require('../db'); // Unga db.js connection pool
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'supersecretkey';

// 📝 User Registration
router.post('/register', async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, Email, and Password are required' });
    }
    try {
        const [existingUsers] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email already registered' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword]
        );
        res.status(201).json({ 
            success: true, 
            message: 'User Registered Successfully',
            userId: result.insertId 
        });
    } catch (error) { next(error); }
});

// 🔑 User Login
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Email & Password required' });
    }
    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid Email or Password' });
        }
        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            SECRET, 
            { expiresIn: '2h' }
        );
        res.json({ 
            success: true,
            message: 'Login Successful', 
            token, 
            user: { id: user.id, name: user.name, email: user.email } 
        });
    } catch (error) { next(error); }
});

// ⭐ CHANGE PASSWORD API ⭐
router.post('/change-password', async (req, res, next) => {
    const { userId, oldPass, newPass } = req.body;

    if (!userId || !oldPass || !newPass) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // 1. Database-la user data fetch panradhu
        const [users] = await db.query('SELECT password FROM users WHERE id = ?', [userId]);
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = users[0];

        // 2. Old Password-ah verify panradhu
        const isMatch = await bcrypt.compare(oldPass, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // 3. New Password-ah hash panradhu
        const salt = await bcrypt.genSalt(10);
        const hashedNewPassword = await bcrypt.hash(newPass, salt);

        // 4. Database-la update panradhu
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, userId]);

        res.json({ success: true, message: 'Password updated successfully! ✅' });

    } catch (error) {
        next(error);
    }
});

module.exports = router;