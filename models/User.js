const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    googleId: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { collection: "users" } // specify the collection name
);

const User = mongoose.model("User", userSchema);

module.exports = User;
