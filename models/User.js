const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: true,
  },
  lname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true
  },
  token: {
    type: String
  },
  confirmed: {
    type: Boolean,
    default: false
  },
  confirmationToken: {
    type: String
  },
  bios: {
    type: String
  },
  image: {
    type: String,
  },
  role : { type: String, enum: {
    values: ['user', 'admin', 'super-admin'],
    message: '{VALUE} is not supported'
  }},
  isVerified: {
    type: Boolean,
    default: false,
  },
  isSuspended: {
    type: Boolean,
    default: false,
  },
  abouts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'about',
    },
  ],
  BlogPosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'BlogPost',
    },
  ],
  headings: [
    {
      type: Schema.Types.ObjectId,
      ref: 'heading',
    },
  ],
  services: [
    {
      type: Schema.Types.ObjectId,
      ref: 'service',
    },
  ],
  projects: [
    {
      type: Schema.Types.ObjectId,
      ref: 'project',
    },
  ],
  skills: [
    {
      type: Schema.Types.ObjectId,
      ref: 'skill',
    },
  ],
  testimonials: [
    {
      type: Schema.Types.ObjectId,
      ref: 'testimonial',
    },
  ],
  faqs: [
    {
      type: Schema.Types.ObjectId,
      ref: 'faq',
    },
  ],
  professions: [
    {
      type: Schema.Types.ObjectId,
      ref: 'profession',
    },
  ],
},
{
  timestamps: true,
});

let User;
try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", UserSchema);
}
module.exports = User;
