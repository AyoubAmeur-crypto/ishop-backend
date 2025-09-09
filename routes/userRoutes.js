const express = require("express")
const verifyToken = require("../middleware/verifyToken")
const router = express.Router()
const {getUserData,logout}= require("../controllers/getData")



router.get("/userData",verifyToken,getUserData)
router.post("/logout",verifyToken,logout)

module.exports = router