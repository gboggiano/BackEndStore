const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: false,
    enum: ["M", "H"],
  },

  email: {
    type: String,
    unique: true,
    required: false,
  },

  role: {
    type: String,
    required: false,
    default: "user",
  },

  password: {
    type: String,
  },
});

module.exports = mongoose.model("User", schema, "users");
