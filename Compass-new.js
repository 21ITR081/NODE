// Import required packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Configuration
const port = process.env.PORT || 5000;

const JWT_SECRET = "sdfghjkl;kjhgfdghjkljhgfhjkljhgfh9876546789876578()././.";

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family:4
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.error("Failed to connect to the database: " + err);
  });

// Create User model
require("./user");
const User = mongoose.model("UserInfo");

// Middleware
app.use(express.json());
app.use(cors());

// Register endpoint
app.post("/register", async (req, res) => {
  const { fname, lname, email, pass } = req.body;
  const encryptedPassword = await bcrypt.hash(pass, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.status(409).json({ error: "User Already Exists" });
    }

    const newUser = await User.create({
      fname,
      lname,
      email,
      pass
    });

    res.status(201).json({ status: "ok", data: newUser });
  } catch (error) {
    console.error("Registration failed: " + error);
    res.status(500).json({ status: "error", error: "Server Error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ status: "error", error: "User Not Found" });
  }

  const passwordMatch = await bcrypt.compare(pass, user.pass);

  if (passwordMatch) {
    const token = jwt.sign({ email: user.email, fname: user.fname }, JWT_SECRET);
    res.status(200).json({ status: "ok", data: { token } });
  } else {
    res.status(401).json({ status: "error", error: "Invalid Password" });
  }
});

// Retrieve user data endpoint
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    const userData = await User.findOne({ email: useremail });
    if (userData) {
      res.status(200).json({ status: "ok", data: userData });
    } else {
      res.status(404).json({ status: "error", error: "User not found" });
    }
  } catch (error) {
    console.error("Error while verifying JWT token: " + error);
    res.status(401).json({ status: "error", error: "Unauthorized" });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
