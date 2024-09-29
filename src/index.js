const express = require("express");
require('dotenv').config()
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const { UserModel } = require("./models/clientdata");

const app = express();

// Middleware
app.use(
  cors({
    origin: "https://portfolio-website-topaz-xi-54.vercel.app",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect("mongodb+srv://harshmath2004:gVczlbjUR7yauQL0@mern-vercel.jcssb.mongodb.net/?retryWrites=true&w=majority&appName=mern-vercel")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("Error in Connecting MongoDB:", err));

app.post("/connect", async (req, res) => {
  try {
    const { name, email, textarea } = req.body;

    // Create the user in the database
    const newUser = await UserModel.create({ name, email, textarea });
    res.status(201).json(newUser);
    // Set up Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Define email options
    const mailOptions = {
      from: '"Harsh Mathur" <mathurharsh020@gmail.com>',
      to: email,
      subject: "Thank You For Connecting With Me",
      text: `Hey ${name},\n\nThank you for connecting with me! I will review your message and get back to you accordingly.\n\nBest regards,\nHarsh Mathur\n Web Developer`,
    };

    // Send the email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error sending email:", err);
        return res
          .status(500)
          .json({ message: "Error sending email: " + err.message });
      } else {
        console.log("Email sent:", info.response);
        return res.status(200).json({
          message: `Thank you for connecting with me! An email has been sent to ${email}.`,
          user: newUser,
        });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(4001, () => {
  console.log("Server running on port 4001");
});
