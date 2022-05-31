const mongoose = require("mongoose");
const { Schema } = mongoose;

const productSchema = new Schema({
  name: { type: String, require: true },
  price: { type: Number, require: true },
  imgURL: { type: String, required: true },
  category: {
    type: String,
    enum: ["shoe", "shirt", "short", "hat"],
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
