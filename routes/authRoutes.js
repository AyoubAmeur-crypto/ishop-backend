const express = require("express")
const {login,SignUp} = require("../controllers/authContorller")


const router = express.Router()

router.post("/login",login)
router.post("/signup",SignUp)


module.exports = router