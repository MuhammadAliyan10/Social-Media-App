// Following model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followingSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    following: { type: Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const Following = mongoose.model('Following', followingSchema);
module.exports = Following;