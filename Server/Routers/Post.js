const express = require('express');
const router = express.Router()
const Post = require('../Models/Post.js')
const auth = require('../Middleware/auth.js')

router.post("/", auth, async (req, res) => {
    try {
        const { content, image } = req.body
        const newPost = new Post({
            user: req.user.id,
            content: content,
            image: image
        })
        const post = await newPost.save()
        res.json(post)
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Server Error." })

    }
})

//! Get all post
router.get("/posts", auth, async (req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 })
        res.json(posts)

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Server Error." })
    }
})

//! Get single Post

router.get("/post/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.json(post);
    } catch (err) {
        console.log(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        return res.status(500).json({ message: "Server Error." })
    }
})

//! Delete a post

router.delete("/post/:id", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        await post.deleteOne()
        res.json({ msg: 'Post removed' });

    } catch (error) {
        console.error(error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Post not found' });
        }
        res.status(500).send('Server Error');

    }
})
module.exports = router;