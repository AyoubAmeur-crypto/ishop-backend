const mongoose = require("mongoose")
const Order = require("../models/Order")
const Product = require("../models/Product")
const Cart = require("../models/Cart")
const nodemailer = require("nodemailer")


exports.createOrder = async (req,res)=>{


    try {

        const {productId}=req.params

        const {formData,quantity}=req.body
        const user = req.user


        if(!mongoose.isValidObjectId(productId)){

            return res.status(400).json({

                success:false,
                error:"must have a valid ProductiD"
            })
        }


        if(!formData){

            return res.status(400).json({

                success:false,
                error:"Must provide a formData to process the payment"
            })
        }

        const checkProductExist = await Product.findByIdAndUpdate(productId,{$inc:{stock:-quantity}})

        if(!checkProductExist){


            return res.status(404).json({

                success:false,
                error:"Can't find product"     
            })
        }

        if(checkProductExist.stock < 1){

            return res.status(400).json({

                success:false,
                error:"Product Out Of Stock"
            })
        }
        const orderPrice = checkProductExist.price*quantity

        const newProduct = {product:checkProductExist._id,quantity:quantity}



        const newOrder = await Order.create({

            user:user.id,
            adress:formData.address,
            customer:formData.firstName+' '+formData.lastName,
            location:formData.city,
            email:formData.email,
            items:[newProduct],
            phone:formData.phone,
            totalPrice:orderPrice,
            postalCode:formData.postalCode,
        })




        const transporter = nodemailer.createTransport({
                  service: 'Gmail', 
                auth: {
                       user: process.env.EMAIL_SENDER,
                       pass: process.env.EMAIL_PASS,
                 },
        
                 
          })

        await transporter.sendMail({
    from: '"iShop Store" <noreply@ishop.com>',
    to: formData.email,
    subject: `Order Confirmed - Thank you ${formData.firstName}!`,
    html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Order Confirmed - iShop</title>
  <style>
    body {
      background-color: #000000;
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
    }
    
    .container {
      background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
      margin: 0 auto;
      padding: 0;
      border-radius: 20px;
      max-width: 600px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      border: 1px solid #fbbf24;
    }
    
    .header {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      padding: 40px;
      text-align: center;
      position: relative;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    }
    
    .logo-section {
      position: relative;
      z-index: 2;
    }
    
    .store-name {
      color: #000000;
      font-size: 36px;
      font-weight: 800;
      margin: 0 0 8px 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    
    .tagline {
      color: rgba(0,0,0,0.7);
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
    
    h1 {
      color: #000000;
      font-size: 28px;
      margin: 24px 0 0 0;
      font-weight: 700;
      position: relative;
      z-index: 2;
    }
    
    .content {
      padding: 40px;
      background-color: #1a1a1a;
    }
    
    .greeting {
      color: #fbbf24;
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 24px;
    }
    
    p {
      color: #e5e7eb;
      font-size: 16px;
      margin: 0 0 20px 0;
      font-weight: 400;
    }
    
    .order-summary {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      border: 1px solid #fbbf24;
      padding: 30px;
      border-radius: 16px;
      margin: 32px 0;
    }
    
    .order-header {
      color: #fbbf24;
      font-weight: 700;
      font-size: 22px;
      margin-bottom: 24px;
      text-align: center;
    }
    
    .product-item {
      display: flex;
      align-items: center;
      background-color: rgba(0,0,0,0.3);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid rgba(251, 191, 36, 0.2);
    }
    
    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 12px;
      margin-right: 20px;
      border: 2px solid #fbbf24;
    }
    
    .product-details {
      flex: 1;
    }
    
    .product-title {
      color: #ffffff;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 8px;
    }
    
    .product-brand {
      color: #9ca3af;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .product-category {
      color: #fbbf24;
      font-size: 14px;
      font-weight: 500;
    }
    
    .product-price {
      text-align: right;
    }
    
    .quantity {
      color: #9ca3af;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .price {
      color: #fbbf24;
      font-weight: 700;
      font-size: 20px;
    }
    
    .price-breakdown {
      background-color: rgba(0,0,0,0.4);
      padding: 20px;
      border-radius: 12px;
      margin-top: 20px;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 8px 0;
    }
    
    .price-row.total {
      border-top: 2px solid #fbbf24;
      padding-top: 16px;
      margin-top: 16px;
      font-weight: 700;
      font-size: 18px;
      color: #fbbf24;
    }
    
    .free-shipping {
      color: #10b981;
      font-weight: 600;
    }
    
    .shipping-info {
      background: linear-gradient(135deg, #065f46 0%, #047857 100%);
      border: 1px solid #10b981;
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
      text-align: center;
    }
    
    .shipping-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .delivery-details {
      background-color: rgba(0,0,0,0.3);
      border: 1px solid rgba(251, 191, 36, 0.3);
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
    }
    
    .delivery-header {
      color: #fbbf24;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 16px;
    }
    
    .delivery-row {
      display: flex;
      margin-bottom: 12px;
    }
    
    .delivery-label {
      color: #9ca3af;
      font-weight: 500;
      width: 120px;
      flex-shrink: 0;
    }
    
    .delivery-value {
      color: #ffffff;
      flex: 1;
    }
    
    .support-section {
      text-align: center;
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid #374151;
    }
    
    .button {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #000000;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      display: inline-block;
      transition: all 0.3s ease;
      box-shadow: 0 8px 16px rgba(251, 191, 36, 0.3);
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(251, 191, 36, 0.4);
    }
    
    .footer {
      background-color: #111827;
      text-align: center;
      font-size: 14px;
      color: #9ca3af;
      padding: 32px 40px;
      border-top: 1px solid #374151;
    }
    
    .footer p {
      margin: 0 0 12px 0;
      font-size: 14px;
    }
    
    .brand-name {
      color: #fbbf24;
      font-weight: 700;
    }
    
    .highlight {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
    
    @media (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 16px;
      }
      
      .header {
        padding: 32px 24px;
      }
      
      .content {
        padding: 32px 24px;
      }
      
      .footer {
        padding: 24px;
      }
      
      .product-item {
        flex-direction: column;
        text-align: center;
      }
      
      .product-image {
        margin-right: 0;
        margin-bottom: 16px;
      }
      
      .price-row {
        flex-direction: column;
        gap: 4px;
      }
      
      .delivery-row {
        flex-direction: column;
        gap: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <div class="store-name">🛍️ iShop</div>
        <div class="tagline">Premium Shopping Experience</div>
        <h1>Order Confirmed!</h1>
      </div>
    </div>
    
    <div class="content">
      <p class="greeting">Hello ${formData.firstName} ${formData.lastName}! 👋</p>
      
      <p>Thank you for your order! We're excited to get your premium product ready for delivery. Here's a summary of your purchase:</p>
      
      <div class="order-summary">
        <div class="order-header">📦 Your Order Summary</div>
        
        <div class="product-item">
          <img src="${checkProductExist.image}" alt="${checkProductExist.title}" class="product-image" />
          <div class="product-details">
            <div class="product-title">${checkProductExist.title}</div>
            <div class="product-brand">${checkProductExist.brand}</div>
            <div class="product-category">${checkProductExist.category}</div>
          </div>
          <div class="product-price">
            <div class="quantity">Quantity: ${quantity}</div>
            <div class="price">$${checkProductExist.price}</div>
          </div>
        </div>
        
        <div class="price-breakdown">
          <div class="price-row">
            <span>Subtotal (${quantity} ${quantity > 1 ? 'items' : 'item'}):</span>
            <span>$${(checkProductExist.price * quantity).toFixed(2)}</span>
          </div>
          <div class="price-row">
            <span>Shipping:</span>
            <span class="free-shipping">FREE 🎉</span>
          </div>
          <div class="price-row total">
            <span>Total:</span>
            <span>$${(checkProductExist.price * quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div class="shipping-info">
        <div class="shipping-icon">🚚</div>
        <p style="color: #ffffff; font-weight: 600; margin: 0 0 8px 0;">FREE SHIPPING INCLUDED!</p>
        <p style="color: #d1fae5; font-size: 14px; margin: 0;">Your order will be delivered within 2-3 business days</p>
      </div>
      
      <div class="delivery-details">
        <div class="delivery-header">📍 Delivery Information</div>
        <div class="delivery-row">
          <span class="delivery-label">Name:</span>
          <span class="delivery-value">${formData.firstName} ${formData.lastName}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">Phone:</span>
          <span class="delivery-value">${formData.phone}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">Email:</span>
          <span class="delivery-value">${formData.email}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">Address:</span>
          <span class="delivery-value">${formData.address}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">City:</span>
          <span class="delivery-value">${formData.city}</span>
        </div>
        ${formData.postalCode ? `<div class="delivery-row">
          <span class="delivery-label">Postal Code:</span>
          <span class="delivery-value">${formData.postalCode}</span>
        </div>` : ''}
        ${formData.region ? `<div class="delivery-row">
          <span class="delivery-label">Region:</span>
          <span class="delivery-value">${formData.region}</span>
        </div>` : ''}
        ${formData.additionalInfo ? `<div class="delivery-row">
          <span class="delivery-label">Additional Info:</span>
          <span class="delivery-value">${formData.additionalInfo}</span>
        </div>` : ''}
      </div>
      
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
        <p style="color: #ffffff; font-weight: 600; margin: 0 0 8px 0;">💰 Payment Method: Cash on Delivery</p>
        <p style="color: #dbeafe; font-size: 14px; margin: 0;">Pay when you receive your order - No advance payment required!</p>
      </div>
      
      <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 20px; border-radius: 12px; margin: 24px 0;">
        <p style="color: #10b981; font-weight: 600; margin: 0 0 8px 0;">🎯 What's Next?</p>
        <p style="color: #ffffff; font-size: 14px; margin: 0;">We'll prepare your order and send you tracking information once it's shipped. You'll receive SMS updates throughout the delivery process.</p>
      </div>
      
      <div class="support-section">
        <p style="color: #e5e7eb;">Need help with your order? We're here to assist!</p>
        <a href="#" class="button">Contact Support</a>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2025 <span class="brand-name">iShop</span>. All rights reserved.</p>
      <p>Your trusted partner for premium shopping experience</p>
      <p style="margin-top: 16px; font-size: 12px; color: #6b7280;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
    `
})



        res.status(201).json({

            success:true,
            message:"Order Created Successfuly"
        })


        
    } catch (error) {

        console.log("Can't Complete the order checkout due to this",error);

        res.status(500).json({

            success:false,
            error:"Can't complete the order pleae try again"
        })
        
        
    }
}


exports.createOrderFromCart = async(req,res)=>{

    try {

      const user = req.user
      const {formData}=req.body

      const getUserCart = await (await Cart.findOne({user:user.id}))
      .populate({path:'items.product',select:'_id title price description category image stock brand ratings'})

      if(!getUserCart){

        return res.status(404).json({

          success:false,
          error:"This user has no cart"
        })
      }


      for(let item of getUserCart.items){

        if(item.quantity > item.product.stock){

          return res.status(400).json({

            success:false,
            error:"Product Out Of Stock"
          })
        }
      }


      let totalAmount = 0

      for(let item of getUserCart.items){

        totalAmount +=item.product.price*item.quantity
        await Product.findByIdAndUpdate(item.product._id,{

          $inc:{stock:-item.quantity}
        },{new:true})
      }

      let itemObejct = []

      getUserCart.items.map(item => {

        itemObejct.push({product:item.product._id,quantity:item.quantity})
      })

      await Order.create({

        user: user.id,
            adress: formData.address,
            customer: formData.firstName + ' ' + formData.lastName,
            location: formData.city,
            email: formData.email,
            phone: formData.phone,
            items:itemObejct,
            totalPrice:totalAmount,
            postalCode: formData.postalCode,
            totalAmount: totalAmount
      })


        const transporter = nodemailer.createTransport({
            service: 'Gmail', 
            auth: {
                user: process.env.EMAIL_SENDER,
                pass: process.env.EMAIL_PASS,
            },
        })

        const cartItemsHTML = getUserCart.items.map(item => `
            <div class="product-item">
                <img src="${item.product.image}" alt="${item.product.title}" class="product-image" />
                <div class="product-details">
                    <div class="product-title">${item.product.title}</div>
                    <div class="product-brand">${item.product.brand}</div>
                    <div class="product-category">${item.product.category}</div>
                </div>
                <div class="product-price">
                    <div class="quantity">Quantity: ${item.quantity}</div>
                    <div class="price">$${(item.product.price * item.quantity).toFixed(2)}</div>
                </div>
            </div>
        `).join('')

        await transporter.sendMail({
    from: '"iShop Store" <noreply@ishop.com>',
    to: formData.email,
    subject: `Cart Order Confirmed - Thank you ${formData.firstName}!`,
    html: `
    <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <title>Cart Order Confirmed - iShop</title>
  <style>
    body {
      background-color: #000000;
      margin: 0;
      padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
    }
    
    .container {
      background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
      margin: 0 auto;
      padding: 0;
      border-radius: 20px;
      max-width: 600px;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      border: 1px solid #fbbf24;
    }
    
    .header {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      padding: 40px;
      text-align: center;
      position: relative;
    }
    
    .header::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(0,0,0,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    }
    
    .logo-section {
      position: relative;
      z-index: 2;
    }
    
    .store-name {
      color: #000000;
      font-size: 36px;
      font-weight: 800;
      margin: 0 0 8px 0;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
    }
    
    .tagline {
      color: rgba(0,0,0,0.7);
      font-size: 16px;
      font-weight: 600;
      margin: 0;
    }
    
    h1 {
      color: #000000;
      font-size: 28px;
      margin: 24px 0 0 0;
      font-weight: 700;
      position: relative;
      z-index: 2;
    }
    
    .content {
      padding: 40px;
      background-color: #1a1a1a;
    }
    
    .greeting {
      color: #fbbf24;
      font-weight: 600;
      font-size: 20px;
      margin-bottom: 24px;
    }
    
    p {
      color: #e5e7eb;
      font-size: 16px;
      margin: 0 0 20px 0;
      font-weight: 400;
    }
    
    .order-summary {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      border: 1px solid #fbbf24;
      padding: 30px;
      border-radius: 16px;
      margin: 32px 0;
    }
    
    .order-header {
      color: #fbbf24;
      font-weight: 700;
      font-size: 22px;
      margin-bottom: 24px;
      text-align: center;
    }
    
    .product-item {
      display: flex;
      align-items: center;
      background-color: rgba(0,0,0,0.3);
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 20px;
      border: 1px solid rgba(251, 191, 36, 0.2);
    }
    
    .product-image {
      width: 80px;
      height: 80px;
      object-fit: cover;
      border-radius: 12px;
      margin-right: 20px;
      border: 2px solid #fbbf24;
    }
    
    .product-details {
      flex: 1;
    }
    
    .product-title {
      color: #ffffff;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 8px;
    }
    
    .product-brand {
      color: #9ca3af;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .product-category {
      color: #fbbf24;
      font-size: 14px;
      font-weight: 500;
    }
    
    .product-price {
      text-align: right;
    }
    
    .quantity {
      color: #9ca3af;
      font-size: 14px;
      margin-bottom: 4px;
    }
    
    .price {
      color: #fbbf24;
      font-weight: 700;
      font-size: 20px;
    }
    
    .price-breakdown {
      background-color: rgba(0,0,0,0.4);
      padding: 20px;
      border-radius: 12px;
      margin-top: 20px;
    }
    
    .price-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      padding: 8px 0;
    }
    
    .price-row.total {
      border-top: 2px solid #fbbf24;
      padding-top: 16px;
      margin-top: 16px;
      font-weight: 700;
      font-size: 18px;
      color: #fbbf24;
    }
    
    .free-shipping {
      color: #10b981;
      font-weight: 600;
    }
    
    .shipping-info {
      background: linear-gradient(135deg, #065f46 0%, #047857 100%);
      border: 1px solid #10b981;
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
      text-align: center;
    }
    
    .shipping-icon {
      font-size: 32px;
      margin-bottom: 12px;
    }
    
    .delivery-details {
      background-color: rgba(0,0,0,0.3);
      border: 1px solid rgba(251, 191, 36, 0.3);
      padding: 24px;
      border-radius: 12px;
      margin: 24px 0;
    }
    
    .delivery-header {
      color: #fbbf24;
      font-weight: 600;
      font-size: 18px;
      margin-bottom: 16px;
    }
    
    .delivery-row {
      display: flex;
      margin-bottom: 12px;
    }
    
    .delivery-label {
      color: #9ca3af;
      font-weight: 500;
      width: 120px;
      flex-shrink: 0;
    }
    
    .delivery-value {
      color: #ffffff;
      flex: 1;
    }
    
    .support-section {
      text-align: center;
      margin-top: 32px;
      padding-top: 32px;
      border-top: 1px solid #374151;
    }
    
    .button {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      color: #000000;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 12px;
      font-weight: 700;
      font-size: 16px;
      display: inline-block;
      transition: all 0.3s ease;
      box-shadow: 0 8px 16px rgba(251, 191, 36, 0.3);
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 12px 24px rgba(251, 191, 36, 0.4);
    }
    
    .footer {
      background-color: #111827;
      text-align: center;
      font-size: 14px;
      color: #9ca3af;
      padding: 32px 40px;
      border-top: 1px solid #374151;
    }
    
    .footer p {
      margin: 0 0 12px 0;
      font-size: 14px;
    }
    
    .brand-name {
      color: #fbbf24;
      font-weight: 700;
    }
    
    .highlight {
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
    }
    
    @media (max-width: 600px) {
      .container {
        margin: 0;
        border-radius: 16px;
      }
      
      .header {
        padding: 32px 24px;
      }
      
      .content {
        padding: 32px 24px;
      }
      
      .footer {
        padding: 24px;
      }
      
      .product-item {
        flex-direction: column;
        text-align: center;
      }
      
      .product-image {
        margin-right: 0;
        margin-bottom: 16px;
      }
      
      .price-row {
        flex-direction: column;
        gap: 4px;
      }
      
      .delivery-row {
        flex-direction: column;
        gap: 4px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo-section">
        <div class="store-name">🛍️ iShop</div>
        <div class="tagline">Premium Shopping Experience</div>
        <h1>Cart Order Confirmed!</h1>
      </div>
    </div>
    
    <div class="content">
      <p class="greeting">Hello ${formData.firstName} ${formData.lastName}! 👋</p>
      
      <p>Thank you for your cart order! We're excited to get your ${getUserCart.items.length} premium product${getUserCart.items.length > 1 ? 's' : ''} ready for delivery. Here's a summary of your purchase:</p>
      
      <div class="order-summary">
        <div class="order-header">📦 Your Cart Order Summary</div>
        
        ${cartItemsHTML}
        
        <div class="price-breakdown">
          <div class="price-row">
            <span>Subtotal (${getUserCart.items.reduce((total, item) => total + item.quantity, 0)} items):</span>
            <span>$${totalAmount.toFixed(2)}</span>
          </div>
          <div class="price-row">
            <span>Shipping:</span>
            <span class="free-shipping">FREE 🎉</span>
          </div>
          <div class="price-row total">
            <span>Total:</span>
            <span>$${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      <div class="shipping-info">
        <div class="shipping-icon">🚚</div>
        <p style="color: #ffffff; font-weight: 600; margin: 0 0 8px 0;">FREE SHIPPING INCLUDED!</p>
        <p style="color: #d1fae5; font-size: 14px; margin: 0;">Your order will be delivered within 2-3 business days</p>
      </div>
      
      <div class="delivery-details">
        <div class="delivery-header">📍 Delivery Information</div>
        <div class="delivery-row">
          <span class="delivery-label">Name:</span>
          <span class="delivery-value">${formData.firstName} ${formData.lastName}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">Phone:</span>
          <span class="delivery-value">${formData.phone}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">Email:</span>
          <span class="delivery-value">${formData.email}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">Address:</span>
          <span class="delivery-value">${formData.address}</span>
        </div>
        <div class="delivery-row">
          <span class="delivery-label">City:</span>
          <span class="delivery-value">${formData.city}</span>
        </div>
        ${formData.postalCode ? `<div class="delivery-row">
          <span class="delivery-label">Postal Code:</span>
          <span class="delivery-value">${formData.postalCode}</span>
        </div>` : ''}
        ${formData.region ? `<div class="delivery-row">
          <span class="delivery-label">Region:</span>
          <span class="delivery-value">${formData.region}</span>
        </div>` : ''}
        ${formData.additionalInfo ? `<div class="delivery-row">
          <span class="delivery-label">Additional Info:</span>
          <span class="delivery-value">${formData.additionalInfo}</span>
        </div>` : ''}
      </div>
      
      <div style="background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%); padding: 24px; border-radius: 12px; text-align: center; margin: 24px 0;">
        <p style="color: #ffffff; font-weight: 600; margin: 0 0 8px 0;">💰 Payment Method: Cash on Delivery</p>
        <p style="color: #dbeafe; font-size: 14px; margin: 0;">Pay when you receive your order - No advance payment required!</p>
      </div>
      
      <div style="background-color: rgba(16, 185, 129, 0.1); border: 1px solid #10b981; padding: 20px; border-radius: 12px; margin: 24px 0;">
        <p style="color: #10b981; font-weight: 600; margin: 0 0 8px 0;">🎯 What's Next?</p>
        <p style="color: #ffffff; font-size: 14px; margin: 0;">We'll prepare your ${getUserCart.items.length} item${getUserCart.items.length > 1 ? 's' : ''} and send you tracking information once shipped. You'll receive SMS updates throughout the delivery process.</p>
      </div>
      
      <div class="support-section">
        <p style="color: #e5e7eb;">Need help with your order? We're here to assist!</p>
        <a href="#" class="button">Contact Support</a>
      </div>
    </div>
    
    <div class="footer">
      <p>© 2025 <span class="brand-name">iShop</span>. All rights reserved.</p>
      <p>Your trusted partner for premium shopping experience</p>
      <p style="margin-top: 16px; font-size: 12px; color: #6b7280;">
        This is an automated email. Please do not reply to this message.
      </p>
    </div>
  </div>
</body>
</html>
    `
})





      await Cart.findByIdAndUpdate(getUserCart._id,{
        $set:{items:[]}
      },{new:true})

      res.status(201).json({

        success:true,
        message:"Cart has been cleared and Order has been created successfuly"
      })
        
    } catch (error) {

      console.log("can't create order due t this",error);
      
        
    }
}


exports.getUserOrders = async (req,res)=>{


  try {

    const user = req.user

    const getOrderlist = await Order.find({user:user.id})
.populate({
        path:'items.product',
        select:'_id title price image ratings description category stock brand'
      })
          console.log("order details for this user",getOrderlist);
    
    if(!Array.isArray(getOrderlist) || getOrderlist.length<1){

      return res.status(404).json({
        success:false,
        message:"This user has no orders"
      })
    }

    res.status(200).json({

      success:true,
      orders:getOrderlist,
      message:`Order for #${user.id}`
    })
  } catch (error) {

    console.log("can't get orders for this user due to this",error);

    res.status(500).json({
      success:false,
      message:"can't get orders for this user please try again"
    })
    
    
  }
}