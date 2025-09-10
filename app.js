const express = require('express')
require('dotenv').config()
const cors = require("cors")
const session = require("express-session")
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')

// Routes
const authRoutes = require("./routes/authRoutes")
const userRoutes = require("./routes/userRoutes")
const cartRoutes = require("./routes/cartRoute")
const productRoutes = require("./routes/productRoute")
const orderRoutes = require("./routes/orderRoutes")
const reviewRoute = require("./routes/reviewRoute")

const app = express()

// Middleware
app.use(express.json())
app.use(cookieParser())

// ✅ Fixed CORS
app.use(cors({
  origin: process.env.FRONT_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}))

// ✅ Fixed Session
app.use(session({
  secret: process.env.SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600
  }),
  cookie: {
    httpOnly: true,
    secure: true, // Always true for production cross-origin
    sameSite: "None", // Required for cross-origin
    maxAge: 1000 * 60 * 60 * 24 * 7,
    domain: undefined // Don't set domain for cross-origin
  }
}))

// Root route handler
app.get('/', (req, res) => {
  res.json({ 
    message: 'iShop Backend API is running successfully!',
    status: 'active',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: '/api/auth',
      products: '/api/product', 
      users: '/api/user',
      cart: '/api/cart',
      orders: '/api/order',
      reviews: '/api/review'
    }
  })
})

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  })
})


// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/product', productRoutes)
app.use("/api/user", userRoutes)
app.use("/api/cart", cartRoutes)
app.use("/api/order", orderRoutes)
app.use("/api/review", reviewRoute)

module.exports = app
