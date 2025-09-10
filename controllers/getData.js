exports.getUserData = async (req,res)=>{

    try {

        const user = req.user

        if(!user){

            return res.status(401).json({

                success:false,
                error:'Not Authorized Access'
            })
        }

        res.status(200).json({

            success:true,
            message:"Authorized",
            user:user
        })
        
    } catch (error) {
        console.log("can't get user data due to this",error);
        res.status(500).json({

            success:false,
            error:"can't get user data please try again"
        })
        
    }
}


exports.logout = async (req,res)=>{

    try {

        const user = req.user

        if(!user){

            return res.status(401).json({

                success:false,
                error:'Not authenticated'
            })
        }

         res.clearCookie('token', { path: '/',
        sameSite: 'Lax',
        secure: false,
        });

        res.status(200).json({
                        success:true,
                        message:"Logout successfully"
        })

      
        
    } catch (error) {

        console.log("can't logout due to this",error);

        res.status(500).json({

            success:false,
            error:"can't logout please try again"
        })
        
        
    }
}