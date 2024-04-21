const express = require('express');
const router = express.Router()
const Post = require('../Models/Post.js')
const auth = require('../Middleware/auth.js')


//! Like a post

router.post("/:postID/like", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID)
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        //! Check if the use like the post
        if (post.likes.includes(req.user._id)) {
            return res.status(400).send({ error: 'You have already liked this post' });
        }
        await post.updateOne({ $push: { likes: req.user._id } });
        await post.save()
        res.status(200).send({ message: 'Post liked successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send({ error: 'Server error' });

    }
})


//! Dislike 

router.post("/:postID/dislike", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (!post.likes.includes(req.user._id)) {
            return res.status(400).send({ error: 'You have not liked this post yet.' });

        }
        const index = post.likes.indexOf(req.user._id);
        post.likes.splice(index, 1);
        await post.save()
        res.status(200).send({ message: 'Post disliked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
})



//! Comment a post

router.post("/:postID/comment", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);
        if (!post) {
            return res.status(404).json({ msg: 'Post not found' });
        }
        if (!req.body.content) {
            return res.status(404).json({ message: 'Comment must not be empty.' });

        }
        const comment = {
            user: req.user._id,
            content: req.body.content
        }
        post.comments.push(comment);
        await post.save();
        res.status(200).send({ message: 'Comment added successfully', comment });

    } catch (error) {
        console.error(err);
        res.status(500).send({ error: 'Server error' });
    }
})

//! Remove a comment

router.post("/:postId/comment/:commentID", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        const comment = post.comments.find(comment => comment._id.toString() === req.params.commentID)
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }
        //! If the comment is from other user
        if (comment.user.toString() !== req.user._id.toString()) {
            return res.status(403).send({ error: 'You are not authorized to delete this comment' });

        }
        post.comments = post.comments.filter(comment => comment._id.toString() !== req.params.commentID)
        await post.save();
        res.status(200).send({ message: 'Comment removed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });

    }

})

//! Update a comment

router.patch("/:postID/comment/:commentID", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);
        if (!post) {
            return res.status(404).send({ error: 'Post not found' });
        }

        const comment = post.comments.find(comment => comment._id.toString() === req.params.commentID)
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        if (req.user._id.toString() !== comment.user.toString()) {
            return res.status(403).send({ error: 'You are not authorized to update this comment' });
        }

        comment.content = req.body.content
        await post.save()
        res.status(200).send({ message: 'Comment updated successfully' });


    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
})


//! To like the comment

router.patch("/:postID/comment/:commentID/like", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);
        if (!post) {
            return res.status(404).json({ "message": "No post found" });
        }
        const comment = post.comments.find(comment => comment._id.toString() === req.params.commentID);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }
        const userId = req.user._id.toString();
        const isLiked = comment.likes.includes(userId);
        if (isLiked) {
            return res.status(400).json({ message: 'Comment already liked' });

        }
        comment.likes.push(userId);
        await post.save();
        res.status(200).json({ message: 'Comment liked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
});


//! To dislike the comment

router.patch("/:postID/comment/:commentID/dislike", auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postID);
        if (!post) {
            return res.status(404).json({ "message": "No post found" });
        }
        const comment = post.comments.find(comment => comment._id.toString() === req.params.commentID);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }
        const userId = req.user._id.toString();

        const isLiked = comment.likes.includes(userId);
        if (!isLiked) {
            return res.status(400).json({ message: 'Comment already disLiked' });

        }
        comment.likes = comment.likes.filter(id => id.toString() !== userId);
        await post.save();
        res.status(200).json({ message: 'Comment disLiked successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Server error' });
    }
});




module.exports = router