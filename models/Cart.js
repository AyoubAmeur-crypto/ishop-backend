const mongoose = require("mongoose")


const cart = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 }
    }
  ],
  totalPrice: { type: Number, default: 0 } 
}, { timestamps: true });

module.exports = mongoose.model('Cart',cart)

