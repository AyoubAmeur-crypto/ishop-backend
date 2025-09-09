const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const {addToCart,getCartUserDetails,removeProductFromCart,updateQuantity} = require("../controllers/cartController")


const router = express.Router()
router.post("/addToCart/:productId",verifyToken,addToCart)
router.get("/getCart",verifyToken,getCartUserDetails)
router.delete("/removeItemFromCart/:itemId",verifyToken,removeProductFromCart)
router.post("/updateCartQuantity/:itemId",verifyToken,updateQuantity)


module.exports = router