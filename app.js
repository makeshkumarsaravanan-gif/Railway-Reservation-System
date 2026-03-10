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

// ✅ FIX: Mobile connectivity and CORS
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// ✅ FIX: Serving the 'client' folder
app.use(express.static(path.join(__dirname, 'client')));

// ✅ Routes Mapping
app.use("/api/auth", authRoute);
app.use("/api/users", userRoutes);
app.use("/api/trains", trainRoutes);
app.use("/api/bookings", bookingRoutes);

// ✅ FIX: Default route to load index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// ✅ FIX: IP Binding for Ngrok (0.0.0.0 is MUST)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 Server running on Port ${PORT}`);
    console.log(`💻 Local: http://localhost:${PORT}`);
    console.log(`📱 Mobile: Use the Ngrok URL\n`);
});