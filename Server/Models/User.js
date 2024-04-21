const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profile: {
        fullName: {
            type: String,
            required: true
        },
        bio: { type: String },
        avatar: { type: String },
        coverImage: { type: String }
    },
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }], // Use singular "Post"
    followers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Use singular "User"
    following: [{ type: Schema.Types.ObjectId, ref: "User" }] // Use singular "User"
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
module.exports = User;
