const mongoose = require('mongoose')

const product = new mongoose.Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  category: { type: String, required: true },
  image: { type: String },
  stock: { type: Number, default: 0 }, 
  brand: { type: String }, 
  ratings: { type: Number, default: 0 },
},{timestamps:true});


module.exports = mongoose.model('Product',product)