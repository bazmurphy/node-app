// bring in mongoose
const mongoose = require("mongoose");

// create a Schema
const StorySchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true // this trims whitespace like .trim()
  },
  body: { 
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public", // we set a default here
    enum: ["public", "private"] // an ENUM is a list of possible values
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // connect each story to a user, to know whose story it is
    ref: "User", // connect it to the User Model with "ref" (a reference to the User Model)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Story", StorySchema);