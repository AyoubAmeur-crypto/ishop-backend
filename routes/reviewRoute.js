const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const router = express.Router()

const {getReviews,createReview} = require("../controllers/reviewController")
router.get("/getReviews/:productId",verifyToken,getReviews)
router.post("/addReview/:productId",verifyToken,createReview)


module.exports = router