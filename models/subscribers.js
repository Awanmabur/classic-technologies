const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscriberSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

let Subscriber;
try {
  Subscriber = mongoose.model("Subscriber");
} catch {
  Subscriber = mongoose.model("Subscriber", SubscriberSchema);
}

module.exports = Subscriber;
