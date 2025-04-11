const mongoose = require("mongoose");

const CartSchema = new mongoose.Schema({
  user: { type: String, required: true, unique: true }, // Email as unique identifier
  products: [
    {
      id: Number,
      title: String,
      price: Number,
      image: String,
      quantity: { type: Number, default: 1 },
    },
  ],
});

const Cart = mongoose.model("Cart", CartSchema);

module.exports = Cart;
