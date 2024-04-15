const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

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

schema.plugin(mongoosePaginate);

module.exports = mongoose.model(collection, schema);
