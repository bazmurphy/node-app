// bring in mongoose
const mongoose = require("mongoose");

// create a Schema
const UserSchema = mongoose.Schema({
  googleId: {
    type: String,
    required: true,
  },
  displayName: { // this is the first and last name together
    type: String,
    required: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model("User", UserSchema);