const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const {allProducts,oneProduct,generalProducts,oneGeneralProduct}= require("../controllers/productController")

const router = express.Router()

router.get("/allProducts",verifyToken,allProducts)
router.get("/allGeneralProducts",generalProducts)
router.get("/oneGeneralProduct/:id",oneGeneralProduct)
router.get("/oneProduct/:id",verifyToken,oneProduct)


module.exports = router