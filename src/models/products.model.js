const mongoose = require("mongoose");

const collection = "products";

const schema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  thumbnail: String,
  code: {
    type: String,
    unique: true,
  },
  stock: Number,
});

module.exports = mongoose.model(collection, schema);
