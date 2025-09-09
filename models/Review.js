const mongoose = require("mongoose")


const Review = new mongoose.Schema({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    product:{

        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    raiting:{
        type:Number
    },
    comment:{

        type:String
    }
},{timestamps:true})

module.exports = mongoose.model("Review",Review)