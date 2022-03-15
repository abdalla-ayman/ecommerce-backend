const mongoose = require("mongoose");
const { Schema } = mongoose;

const cartSchema = new Schema({
  itemQuantity: { type: Number, default: 0 },
  items: {
    type: [
      {
        item: { type: Schema.Types.ObjectId, ref: "Product" },
        quantity: Number,
      },
    ],
    default: [],
  },
});

module.exports = cartSchema;
