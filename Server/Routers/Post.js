const express = require("express");
const router = express.Router();
const Post = require("../Models/Post.js");
const User = require("../Models/User.js");
const auth = require("../Middleware/auth.js");

router.post("/", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const { content, image } = req.body;
    const newPost = new Post({
      user: req.user.id,
      content: content,
      image: image,
    });
    const post = await newPost.save();
    res.json(post);
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Server Error." });
  }
});

//! Get all post
router.get("/posts", auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    const userIds = posts.map((post) => post.user);
    const uniqueUserIds = [...new Set(userIds)];
    const users = await User.find({ _id: { $in: uniqueUserIds } });

    const userByPost = posts.map((post) => {
      const user = users.find(
        (user) => user._id.toString() === post.user.toString()
      );
      return { ...post.toObject(), user };
    });

    res.json({ post: userByPost });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ message: "Server Error." });
  }
});

//! Get single Post

router.get("/post/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    console.log(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    return res.status(500).json({ message: "Server Error." });
  }
});

//! Delete a post

router.delete("/deletePost/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({ message: "User not authorized" });
    }
    await post.deleteOne();
    res.json({ msg: "Post removed" });
  } catch (error) {
    console.error(error.message);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(500).send("Server Error");
  }
});
module.exports = router;

//! Update a post

router.patch("/updatePost/:postId", auth, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).send({ message: "Post not found" });
    }

    if (!req.body.content) {
      return res
        .status(400)
        .send({ message: "Please provide the new content." });
    }

    post.content = req.body.content;
    await post.save();

    res.status(200).send(post);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

//! Fetch singlePerson posts

router.get("/userPosts/:id", auth, async (req, res) => {
  try {
    const logInUser = await User.findById(req.user._id);
    if (!logInUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    const userPosts = req.params.id;
    console.log(userPosts);
    const posts = await Post.find({ user: userPosts });
    if (!posts) {
      return res.status(404).send({ message: "Post not found" });
    }
    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});
