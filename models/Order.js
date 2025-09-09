const mongoose = require('mongoose')

// when we will add admin pannel the manger will update the delvery or the dilevery guy
const Order = new mongoose.Schema({


    user:{type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    customer:{
        type:String
    },
   items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, default: 1 }
        }
    ], 
    totalPrice:{type:Number},
    location:{

        type:String
    },
    adress:{
        type:String
    },
    postalCode:{
        type:Number
    },
    phone:{

        type:String
    },
    email:{

        type:String
    }
},{timestamps:true})


module.exports = mongoose.model("Order",Order)