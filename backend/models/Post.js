const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, default: 'shared' },
  target: { type: String, default: '' },
  content: { type: String, required: true },
  likes: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: { type: Number, default: 0 },
  citations: { type: Number, default: 0 },
  isAi: { type: Boolean, default: false },
  attachment: {
    title: String,
    type: { type: String },
    icon: String,
    desc: String
  }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
