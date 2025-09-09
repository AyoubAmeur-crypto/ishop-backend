const express = require("express")
const {createOrder,getUserOrders,createOrderFromCart}= require("../controllers/orderController")
const verifyToken = require("../middleware/verifyToken")


const router = express.Router()

router.post("/createOrder/:productId",verifyToken,createOrder)
router.get("/getUserOrders",verifyToken,getUserOrders)
router.post("/createOrderFromCart",verifyToken,createOrderFromCart)

module.exports = router