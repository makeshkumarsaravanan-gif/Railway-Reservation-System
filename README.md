🚂 SmartRail: Next-Gen Railway Reservation System

    "Efficiency in Motion, Security in Every Ticket" > 💡 Developed with ❤️ by Makesh

🌟 Core Project Highlights

SmartRail oru complete Full-Stack Web Application. Idhu user registration-la irundhu, OTP verification, Interactive seat selection, matrum automated QR-Embedded PDF Ticket generation varai handle pannum.
🛠️ 1. Professional Tech Stack

Indha project-la industry standards-ah maintain panna keezha ulla technologies use panni irukkaen:
Category	Technology	Purpose
🌐 Frontend	HTML5, CSS3, Bootstrap 5	Responsive UI & Interactive Coach Layout
⚙️ Backend	Node.js & Express.js	High-performance Asynchronous API Server
🗄️ Database	MySQL	Structured Data Storage & ACID Compliance
🛡️ Security	jsonwebtoken & bcrypt	Secure Authentication & Password Hashing
📧 Automation	nodemailer	Automated OTP & E-Ticket Email Delivery
🎫 Documents	pdfkit & qrcode	Dynamic QR-Embedded PDF Ticket Generation
🏗️ 2. Core Engineering Logic (The "Pro" Flow)

 Professional Flow

    🔒 Identity Verification: User booking start pannona, nodemailer moolamaa oru 6-digit Secure OTP avanga mail-ku pogum.

    ⚡ Concurrency Control: Database-la db.beginTransaction() use pannirukaen. Idhunala ore seat-ah rendu per ore nerathula book panna mudiyaadhu (Double Booking Prevention).

    🎫 Encrypted QR Generation: Passenger details (Name, PNR, Seat) qrcode package vachu encode panni, adhai pdfkit render panra ticket-la real-time-ah insert pandraen.

    🚀 Memory Optimization: Ticket generate aana udanae server disk-la save pannaama, Buffer Memory moolamaa direct-ah mail-ku attachment-ah push pandraen.

🗄️ 3. Database Schema (Structural Blueprint)

Vera system-la project-ah set panna, indha SQL queries-ah MySQL-la run pannunga:
SQL

/* 🏠 Create and Select Database */
CREATE DATABASE railway_reservation;
USE railway_reservation;

/* 👤 1. Users Table (Identity Management) */
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255)
);

/* 🚆 2. Trains Table (Resource Inventory) */
CREATE TABLE trains (
    id INT AUTO_INCREMENT PRIMARY KEY,
    train_name VARCHAR(150),
    source VARCHAR(100),
    destination VARCHAR(100),
    departure_time TIME,
    price INT,
    total_seats INT
);

/* 🎟️ 3. Bookings Table (Transaction Master) */
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    train_id INT,
    pnr VARCHAR(20) UNIQUE,
    status VARCHAR(20) DEFAULT 'CONFIRMED',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (train_id) REFERENCES trains(id)
);

/* 👨‍👩‍👧 4. Passengers Table (Manifest Details for QR) */
CREATE TABLE passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id INT,
    name VARCHAR(100),
    seat_number VARCHAR(10),
    email VARCHAR(100),
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

🚀 4. Quick Deployment Guide

Vera system-la project-ah run panna indha steps-ah follow pannunga:

    📂 Transfer: Project folder-ah system-ku mathunga.

    📦 Dependencies: Terminal-la run pannunga:
    npm install nodemailer qrcode pdfkit express mysql2 jsonwebtoken bcrypt dotenv

    ⚙️ Configuration: .env file-la unga MySQL credentials & Gmail App Password-ah configure pannunga.


    🔥 Launch: node app.js kudutha server Port 5000-la flight-ah kelambidum!
