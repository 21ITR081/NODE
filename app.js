// Import required packages
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Configuration
const port = process.env.PORT || 4000;
const mongoUrl = "mongodb+srv://praneshkangeyanse21it:sepk2003@cluster0.uyh6rjw.mongodb.net/?retryWrites=true&w=majority";
const JWT_SECRET = "sdfghjkl;kjhgfdghjkljhgfhjkljhgfh9876546789876578()././.";

// Connect to MongoDB
mongoose.connect(mongoUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

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
      return res.send({ error: "User Exists" });
    }
    await User.create({
      fname,
      lname,
      email,
      pass: encryptedPassword,
    });
    res.send({ status: "ok" });
  } catch (error) {
    res.send({ status: "error" });
  }
});

// Login endpoint
app.post("/login", async (req, res) => {
  const { email, pass } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ status: "error", error: "User Not Found" }); // Send an error status
  }
  if (await bcrypt.compare(pass, user.pass)) {
    const token = jwt.sign({ email: user.email, fname: user.fname }, JWT_SECRET); // Include fname in the token

    if (res.status(201)) {
      return res.json({ status: "ok", data: token });
    } else {
      return res.json({ status: "error", error: "Server Error" }); // Send an error status
    }
  }
  res.json({ status: "error", error: "Invalid Password" });
});

// Retrieve user data endpoint
app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET);
    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        if (data) {
          res.json({ status: "ok", data: data }); // Send the user data as JSON
        } else {
          res.json({ status: "error", data: "User not found" });
        }
      })
      .catch((error) => {
        res.json({ status: "error", data: error });
      });
  } catch (error) {
    res.json({ status: "error", data: error });
  }
});

// Start the server
app.listen(port, () => {
  console.log("Server started on port " + port);
});
