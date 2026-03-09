const express = require("express");
const cors = require("cors");
const path = require("path"); 
require("dotenv").config();

// Routes Import
const userRoutes = require("./routes/userRoutes");
const trainRoutes = require("./routes/trainRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoute = require("./routes/authRoute");  

const app = express(); 

// ✅ Middleware
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ✅ IMPORTANT: 'public'-ku pathila 'client' nu mathirukaen
app.use(express.static(path.join(__dirname, 'client')));

// ✅ Routes Mapping
app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ Default Route
app.get("/", (req, res) => {
    // Inga 'client' folder-kulla irukura index.html-ah anupum
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// Test-kaga status route
app.get("/status", (req, res) => {
    res.status(200).send("🚂 Railway Reservation API is Live!");
});

// ✅ Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});