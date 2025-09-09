const  mongoose  = require("mongoose")
const Review = require("../models/Review")



exports.getReviews = async (req,res)=>{


    try {

        const user = req.user
        const {productId}=req.params

        if(!mongoose.isValidObjectId(productId)){

            return res.status(400).json({

                success:false,
                error:"Not a valid product Id"
            })
        }





        const GetProductReviews = await Review.find({product:productId})
        .populate({path:'user',select:'_id firstName lastName email'})


        if(!GetProductReviews){


            return res.status(404).json({

                success:false,
                error:"This product has no reviews"
            })
        }


        res.status(200).json({

            success:true,
            message:`Reviews of product #${productId}`,
            reviews:GetProductReviews
        })
        
    } catch (error) {


        console.log("can't get product reviews due to this",error);
        res.status(500).json({

            success:false,
            message:"Can't get product reviews please try again!"
        })

        
        
    }
}

exports.createReview = async (req,res)=>{


    try {
        const user = req.user
        const {productId}=req.params
        const {comment,raiting}=req.body

        if(!mongoose.isValidObjectId(productId)){

            return res.status(400).json({

                success:false,
                error:"Not a valid product Id"
            })
        }

        if(!comment || !raiting){

            return res.status(400).json({

                success:false,
                error:"Required a comment & raiting to valid the review"
            })
        }

        const createCommentCheck = await Review.create({

            user:user.id,
            comment:comment,
            product:productId,
            raiting:raiting
        })


        if(createCommentCheck){


            return res.status(201).json({

                success:true,
                message:"Review has been creted successfuly for this product "
            })
        }

        
        
    } catch (error) {

        console.log("can't create the reveiw due to this",error);

        res.status(500).json({

            success:false,
            message:"Can't create the review for the moment please try again"
        })
        
        
    }
}