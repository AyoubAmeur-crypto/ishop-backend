const Cart = require("../models/Cart")
const Product = require("../models/Product")
const User = require('../models/User')
exports.addToCart = async (req,res)=>{


    const {productId}= req.params



    try {

        const user = req.user
        const product = await Product.findById(productId)

        if(!product){

            return res.status(404).json({

                success:false,
                error:'Product not found'
            })

        }


        const wantedCart = await Cart.findByIdAndUpdate(user.cart,{
            $push:{items:{product:productId,quantity:1}},
            $inc:{totalPrice:product.price}
        },{new:true})

        res.status(200).json({

            success:true,
            cart:wantedCart, 
            message:'cart has been updated succefully'
        })
        
    } catch (error) {

        console.log("can't update the cart due to this",error);
        res.status(500).json({

            success:false,
            error:"can't update the cart please try again"

        })
        
        
    }
}

exports.getCartUserDetails = async (req,res)=>{


    try {

        const user = req.user

        const getCartDetails = await Cart.findById(user.cart)
        .populate({path:'items.product',select:'_id title price description category image stock brand ratings'})


        if(!getCartDetails){

            return res.status(404).json({

                success:false,
                error:"Can't fnd the cart you are looking for"
            })
        }


        res.status(200).json({

            success:true,
            message:`Cart of user ${user.id}`,
            cart:getCartDetails
        })


        
    } catch (error) {

        console.log("can't find th cart due to this",error);


        res.status(500).json({


            success:false,
            error:"can't find the cart please try again"
        })
        
        
    }
}


exports.removeProductFromCart = async(req,res)=>{

    try {

        const {itemId}= req.params
        const user = req.user
        
        const getUserCart = await Cart.findById(user.cart)
        .populate({path:'items.product',select:'_id title price description category image stock brand ratings'})

        
        
        if(!getUserCart){

            return res.status(404).json({

                success:false,
                error:"Can't find this user cart"
            })
        }

        const getItem = getUserCart.items.find(i=> i._id.toString() === itemId.toString())

        const priceToSubstract = getItem.product.price * getItem.quantity











        const removeFromCart = await Cart.findByIdAndUpdate(getUserCart._id,{
            $pull:{items:{_id:itemId}},
            $inc:{totalPrice:-priceToSubstract}
        },{new:true})


        if(!removeFromCart){

            return res.status(400).json({
                success:false,
                error:"can't remove the item please try again check here"
            })
        }


        res.status(200).json({

            success:true,
            error:"item removed successsfully from the cart"
        })
        
    } catch (error) {
        console.log("can't remove the item from the cart due to this",error);

        res.status(500).json({
            success:false,
            error:"Can't remove the item please try again internal error"
        })
        
        
    }
}

exports.updateQuantity = async (req,res)=>{

    try {

        const user = req.user
        const {quantity}=req.body
        const {itemId}=req.params

        const wantedCart  = await Cart.findById(user.cart).populate({path:'items.product',select:'_id title price description category image stock brand ratings'})

        const updateItem = wantedCart.items.find(i => i._id.toString() === itemId.toString())

        const oldQuantity = updateItem.quantity
         const pricePerItem = updateItem.product.price
        const priceDifference = (parseInt(quantity) - oldQuantity) * pricePerItem

        await Cart.findOneAndUpdate({_id:user.cart,
            "items._id":itemId
        },{

            $set:{"items.$.quantity":parseInt(quantity)},
            $inc:{totalPrice:priceDifference}
        },{new:true})

        res.status(200).json({
            success:true,
            message:"Cart quantity updated successfully"
        })
        
    } catch (error) {
        console.log("can't update the quantity due to this",error);
        res.status(500).json({

            success:false,
            error:"can't update quantity please try again"
        })


        
        
    }
}