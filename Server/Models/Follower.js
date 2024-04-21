// Follower model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followerSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    follower: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Follower = mongoose.model('Follower', followerSchema);
module.exports = Follower;