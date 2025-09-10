const mongoose = require("mongoose")
const User = require('../models/User')
const Cart = require("../models/Cart")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

exports.SignUp = async (req,res)=>{

    try {

        const {firstName,lastName,email,password}=req.body

        const checkMail = await User.findOne({email:email})
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


        if(checkMail){

            return res.status(400).json({

                success:false,
                error:"Email Already Exist , Go to Login"
            })
        }

        if(!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()){

            return res.json({
                success:false,
                error:"All the fileds are required"
            })
        }

        if(!regex.test(email)){

            return res.status(400).json({

                success:false,
                error:"Enter a valid email format"
            })
        }
        if(!strongPasswordRegex.test(password)){

            return res.status(400).json({
                success:false,
                error:"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
            })
        }

        const hashPassword = await bcrypt.hash(password,10)

        



        const newUser = await User.create({

            firstName:firstName,
            lastName:lastName,
            email:email,
            password:hashPassword,
            
        })
        const userCart = await Cart.create({user:newUser._id,items:[]})
        newUser.cart=userCart._id

        await newUser.save()

         const token = jwt.sign({id:newUser._id,
            email:newUser.email,
            firstName:newUser.firstName,
            lastName:newUser.lastName,
            role:newUser.role,
            isVerifed:newUser.isVerified,
            cart:newUser.cart,
            orders:newUser.orders
            


        },process.env.TOKEN_KEY,{expiresIn:'1d'})

     res.cookie('token', token, {
  httpOnly: true,
  secure: true, // Always true for production
  sameSite: 'None', // Required for cross-origin
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
});


res.status(201).json({

    success:true,
    message:"User Has Been Created Successfully",
    redirectTo:'/en'
})
        
    } catch (error) {

        console.log("can't create an account due to this",error);
        res.status(500).json({
            success:false,
            error:"can't create an account please try again later"

        })
        
        
    }
}

exports.login = async  (req,res)=> {


    try {

        const {email,password} = req.body

        if(!email || !password){

            return res.status(401).json({message:"All fileds are required!"})

        }

        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

        if(!regex.test(email)){

            return res.status(401).json({message:"Enter a valid email format"})
        }

        const checkUser = await User.findOne({email:email}).select('+password')

        if(!checkUser){

            return res.status(404).json({message:"User is not found"})
        }

        

        const checkPassword = await bcrypt.compare(password,checkUser.password)

        if(!checkPassword){

            return res.status(401).json({message:"Pasword Doesn't match"})
        }

          const token = jwt.sign({id:checkUser._id,
            email:checkUser.email,
            firstName:checkUser.firstName,
            lastName:checkUser.lastName,
            role:checkUser.role,
            isVerifed:checkUser.isVerified,
            cart:checkUser.cart,
            orders:checkUser.orders
            


        },process.env.TOKEN_KEY,{expiresIn:'1d'})

        
      res.cookie('token', token, {
  httpOnly: true,
  secure: true, // Always true for production
  sameSite: 'None', // Required for cross-origin
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
});



res.status(200).json({

    success:true,
    message:'User has been Logged Successfuly',
    redirectTo:'/en'
})

        







        
    } catch (error) {

        console.log("error happened due to this",error);
        res.status(500).send("Internal server error")
        
        
    }
}