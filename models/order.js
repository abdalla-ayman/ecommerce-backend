const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["deliverd", "shipping", "pending"],
    default: "pending",
  },
  items: [
    {
      item: { type: Schema.Types.ObjectId, ref: "Product" },
      quantity: Number,
    },
  ],
});

module.exports = mongoose.model("order", orderSchema);
