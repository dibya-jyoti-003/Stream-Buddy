import jwt from 'jsonwebtoken'
import User from '../models/userModel.js'


const verifyJWT = async (req,res,next)=>{

    try {
        const token = req.cookies?.accessToken
        //console.log('token-> ', token)
        if (!token) return res.status(401).json({message:'Unauthorize request'})

        const decodedToken = jwt.verify(token, process.env.SECRET_JWT_KEY)
        if(!decodedToken)return res.status(401).json({message:'Problem in decoding token'})

        const loggedInUser = await User.findById(decodedToken.id).select('-password')
        if (!loggedInUser)return res.status(500).json({decodedToken, message:'Error in getting logged in user'})

        req.user = loggedInUser
        next()
    } catch (error) {
        return res.status(500).json({message:'Something went wrong in verifyJWT'})
    }
}

export default verifyJWT