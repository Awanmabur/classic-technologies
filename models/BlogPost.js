const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogPostSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  image: {
    type: String,
    unique: true,
    required: true
  },
  comments: [{
          text: String,
          user: String
        }],
  likes: {
    type: Number,
    default: 0
  },
  loves: {
    type: Number,
    default: 0
  },
  shares: {
    type: Number,
    default: 0
  },
  count: {
        type: Number,
        default: 0
    },
},
{
  timestamps: true,
});

module.exports = mongoose.model('BlogPost', BlogPostSchema);
