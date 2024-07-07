const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
   ownerToken: {
     type: String,
     required: true
   },
  image: {
    type: String,
    unique: true,
    required: true
  },
},
{
  timestamps: true,
});

let Review;
try {
  Review = mongoose.model("Review");
} catch {
  Review = mongoose.model("Review", ReviewSchema);
}

module.exports = Review;
