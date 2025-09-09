const { default: mongoose } = require("mongoose")
const Product = require("../models/Product")
const User = require("../models/User")


exports.generalProducts = async (req,res)=>{


    try {

        const allProducts = await Product.find()


        if(!allProducts){

            return res.status(404).json({

                success:false,
                error:'No Product Found'
            })
        }
        console.log("all products without auth",allProducts);
        
        res.status(200).json({

            success:true,
            products:allProducts

        })
        
    } catch (error) {

        console.log("can't get all products due to this",error);
        res.status(500).json({

            success:false,
            error:"can't get products please try again"
        })
        
        
    }
}
exports.oneGeneralProduct = async (req,res)=>{


    try {
        const {id}=req.params

        if(!mongoose.isValidObjectId(id)){

            return res.status(400).json({

                success:false,
                error:'Not a valid Id'
            })
        }

        const checkProduct = await Product.findById(id)

        if(!checkProduct){

            return res.status(404).json({


                success:false,
                error:'Product Not Found'
            })
        }


        res.status(200).json({

            success:true,
            message:`Product #${checkProduct._id} : ${checkProduct.title}`,
            product:checkProduct

        })
        
    } catch (error) {

        console.log("can't find this product due to this",error);

        res.status(500).json({

            success:false,
            error:"can't find product please try again"
        })
        
        
    }
}
exports.allProducts = async (req, res) => {
  try {
    const user = req.user;
    const allProducts = await Product.find();

    const userWithCart = await User.findById(user.id).populate({
      path: 'cart',
      populate: { path: 'items.product', select: '_id' }
    });

    const cartProductIds = userWithCart.cart.items.map(item => item.product?._id?.toString())
    

    const ProductWithFilter = allProducts.map(p => ({
      ...p.toObject(),
      inCart: cartProductIds.includes(p._id.toString())
    }));

    return res.status(200).json({
      success: true,
      products: ProductWithFilter
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

exports.oneProduct = async (req,res)=>{


    try {
        const {id}=req.params
        const user = req.user
        if(!mongoose.isValidObjectId(id)){

            return res.status(400).json({

                success:false,
                error:'Not a valid Id'
            })
        }

        const userWithCart = await User.findById(user.id)
        .populate({path:'cart',populate:{path:'items.product',select:'_id'}})

        const wantedProduct = await Product.findById(id)

        const checkIfInCart = userWithCart.cart.items.some(p=>p.product._id.toString()===wantedProduct._id.toString())

        const productWithFlag = {

            ...wantedProduct.toObject(),
            inCart:checkIfInCart
        }

        


        if(!productWithFlag){

            return res.status(404).json({


                success:false,
                error:'Product Not Found'
            })
        }


        res.status(200).json({

            success:true,
            message:`Product #${productWithFlag._id} : ${productWithFlag.title}`,
            product:productWithFlag

        })
        
    } catch (error) {

        console.log("can't find this product due to this",error);

        res.status(500).json({

            success:false,
            error:"can't find product please try again"
        })
        
        
    }
}