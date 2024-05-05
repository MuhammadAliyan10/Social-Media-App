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
    res.status(200).json({ message: "Login successfully." });
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

//! Searched user info
router.get("/searchedUserInfo/:id", auth, async (req, res) => {
  try {
    const userAuth = req.user._id;
    const checkAuthUser = await User.findById(userAuth);
    if (!checkAuthUser) {
      res.status(404).json({ message: "User not found" });
    }
    const id = req.params.id;
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

//! Follow User

router.post("/follow/:userId", auth, async (req, res) => {
  try {
    const followerUser = await User.findById(req.user._id);
    if (!followerUser) {
      return res.status(404).json({ message: "Follower user not found" });
    }
    const userId = req.params.userId;
    const followingUser = await User.findById(userId);
    if (!followingUser) {
      return res.status(404).json({ message: "Following user not found" });
    }
    if (followingUser.followers.includes(req.user._id)) {
      return res.status(400).json({ message: "User already followed" });
    }
    if (followerUser.following.includes(userId)) {
      return res.status(400).json({ message: "Already following." });
    }
    followingUser.followers.push(req.user._id);
    followerUser.following.push(userId);
    await followerUser.save();
    await followingUser.save();
    return res.status(200).json({ message: "Followed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.post("/unfollow/:userId", auth, async (req, res) => {
  try {
    const followerUser = await User.findById(req.user._id);
    if (!followerUser) {
      return res.status(404).json({ message: "Follower user not found" });
    }
    const userId = req.params.userId;
    const followingUser = await User.findById(userId);

    if (!followingUser) {
      return res.status(404).json({ message: "Following user not found" });
    }
    if (!followingUser.followers.includes(req.user._id)) {
      return res.status(400).json({ message: "Not followed" });
    }

    followingUser.followers = followingUser.followers.filter(
      (followerId) => followerId === req.user._id
    );
    followerUser.following = followerUser.following.filter(
      (followedUserId) => followedUserId === userId
    );
    await followerUser.save();
    await followingUser.save();
    return res.status(200).json({ message: "Unfollowed successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//! Fetch all user

router.get("/findUser/:userName", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const users = await User.find({ username: req.params.userName });
    if (!users) {
      return res.status(404).json({ message: "No user found." });
    }
    res.json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});

//! Update Userinfo

router.put("/userUpdate", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.username) {
      user.username = req.body.username;
    }
    if (req.body.fullName) {
      user.profile.fullName = req.body.fullName;
    }
    if (req.body.email) {
      user.email = req.body.email;
    }

    if (req.body.bio !== undefined) {
      user.profile.bio = req.body.bio;
    }
    if (
      req.body.coverImage !== undefined &&
      Object.keys(req.body.coverImage).length !== 0
    ) {
      user.profile.coverImage = req.body.coverImage;
    }
    if (
      req.body.avatar !== undefined &&
      Object.keys(req.body.avatar).length !== 0
    ) {
      user.profile.avatar = req.body.avatar;
    }

    await user.save();
    return res.status(200).json({ message: "User updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
});
