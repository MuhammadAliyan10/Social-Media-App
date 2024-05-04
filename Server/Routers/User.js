const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/User");
const auth = require("../Middleware/auth");
require("dotenv").config();

//! For user register

router.post("/register", async (req, res) => {
  try {
    const checkExistingUser = await User.findOne({
      $or: [{ username: req.body.username }, { email: req.body.email }],
    });
    if (checkExistingUser) {
      return res
        .status(401)
        .json({ message: "User with this username/email already exists." });
    }
    const hashPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashPassword,
      profile: { fullName: req.body.fullName },
    });
    await newUser.save();
    res.status(200).json({ message: "New user added successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//! For user login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      res.status(401).json({ message: "Invalid Password." });
    }
    //! Generate JWT token
    const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

//Get User

router.get("/userInfo", auth, async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});
