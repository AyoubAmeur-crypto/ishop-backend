const mongoose = require('mongoose')

const user = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true , select:false },
  isVerified: { type: Boolean, default: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
  orders: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }], 
},{timestamps:true});


module.exports = mongoose.model('User',user)