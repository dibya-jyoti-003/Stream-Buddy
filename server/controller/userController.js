import bcrypt from 'bcryptjs'
import User from '../models/userModel.js'
import Video from '../models/videoModel.js'
import jwt from 'jsonwebtoken';

function validatePassword (password){
    let isValid = false;
    let cntNumber = 0
    let cntChar = 0
    let cntSpl = 0

    for (let i = 0; i<password.length ; i++){
        const ch = password[i]
        if (ch >= '0' && ch <= '9')cntNumber += 1
        else if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z'))cntChar += 1
        else cntSpl += 1
    }

    if (cntNumber>0 && cntSpl>0 && cntChar>=8)isValid = true
    return isValid
}

function encrypt(password){
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    return hash
}

export const signupUser = async (req,res) => {
    try {

        const {email,userName,password} = req.body

        //email, userName , password cannot be empty
        if([email,userName,password].some((field) => field?.trim() === '')){
            return res.status(400).json({message:'Please fill in all fields'})
        }

        const userExists = await User.findOne({
            $or: [{userName},{email}]
        })

        if (userExists){
            return res.status(400).json({message: 'User already exists!! Please Login!!'})
        }

        const isPasswordValid = validatePassword(password)
        if (!isPasswordValid) {
            return res.status(400).json({message: 'Password must contain atleast 8 characters and 1 spl char and 1 number'})
        }

        const hash = encrypt(req.body.password)

        const newUser = new User({...req.body, password:hash })

        const savedUser = await newUser.save()
        if (!savedUser)return res.status(500).json({message: 'Something went wrong while Signing Up'})        

        return res.status(200).json({savedUser, message: 'User has been succesfully created' })

    } catch (error) {
        return res.status(500).json({ message: error.message })
    }

}

export const loginUser = async (req,res) => {
    const {email,userName,password} = req.body
    if ([email,password].some(field => field?.trim() === '') && [userName,password].some(field => field?.trim() === '')){
        return res.status(400).json({message: 'Please Enter the required details'})
    }

    const reqUser = await User.findOne({
        $or: [{email},{userName}]
    })

    if (!reqUser) {
        return res.status(400).json({message: 'User Not Found !! Please SignUp'})
    }

    const validPassword = await bcrypt.compare(password,reqUser.password)
    if (!validPassword)return res.status(400).json({message: 'Invalid Password'})
    
    const access_token = jwt.sign({
        id: reqUser._id
    },process.env.SECRET_JWT_KEY)

    const options = {
        httpOnly: true,
    }
    const loggedInUser = await User.findById(reqUser._id).select('-password')

    return res.status(200)
    .cookie('accessToken', access_token,options)
    .json({loggedInUser, message : 'User Logged In Succesfully'})
        
}

export const logoutUser = async (req,res) => {
    try {
        
        const options = {
            httpOnly:true,
            secure : true
        }

        return res.status(200)
        .clearCookie('accessToken',options)
        .json({
            message: `User - ${req.user.userName} - Logged Out Succesfully`
        })
    } catch (error) {
        return res.status(500).json({message: `Something went wrong while logging out, error-> ${error}`})
    }
}

export const deleteUser = async (req,res) => {
    try {
        
        if (req.params.id !== req.user.id){
            return res.status(400).json({message: `You can only delete your own account`})
        }
        const delUser = await User.findByIdAndDelete(req.user._id)
        if (!delUser) return res.status(500).json({message: `Some problem in deleting user`})
        
        return res.status(200).json({message: `User has been Successfully Delelted`})

    } catch (error) {
        return res.status(500).json({message: `Something went wrong while deleting user, error-> ${error}`})
    }
}

export const getUser = async (req,res) => {
    try {
        return res.status(200)
        .json({
            user: req.user,
            message: 'User fetched Succesfully'
        })
    } catch (error) {
        return res.status(500)
        .json({message: 'Problem in fetching user'})
    }
}

export const changePassword = async (req,res) => {
    try {
        
        const {oldPassword, newPassword} = req.body
        if (oldPassword === newPassword)return res.status(400).json({message: 'New Password cannot be Old Password'})
        const user = await User.findById(req.user._id)

        const validPass = await bcrypt.compare(oldPassword, user.password) 

        if (!validPass)return res.status(400).json({message: 'Invalid Old Password'})

        if (!validatePassword(newPassword))return res.status(400).json({message: 'Enter a valid Password'})

        const hash = encrypt(newPassword)
        user.password = hash
        const isSaved = await user.save()
        if (!isSaved)return res.status(500).json({message: 'Problem saving password'})

        return res.status(200).json({message: 'Password Changed Succesfully'})

    } catch (error) {
        return res.status(500).json({message: `Something went wrong in changing password, ${error}`})
    }
}

export const update = async (req,res) => {
    try {
        
        const {email,userName,image} = req.body
        const user = await User.findById(req.user._id).select('-password')

        if (email)user.email = email
        if (userName)user.userName = userName
        if (image)user.image = image

        const isSaved = await user.save()
        if (!isSaved)return res.status(500).json({message: 'Problem in saving user details'})
        
        return res.status(200).json({user, message: 'User details updated Succesfully'})

    } catch (error) {
        return res.status(500).json({message: `Problem in updating User Details, ${error}`})
    }
}

export const getChannel = async(req,res) => {
    try {
        
        const {userName} = req.params
        
        const channel = await User.aggregate([{
            $match: {userName: userName},
        }])
        
        const channelProfile = await User.findById(channel[0]._id).select('-password')
        if (!channelProfile)return res.status(400).json({message: 'Channel does not exist'})
        return res.status(200).json({channelProfile, message: 'Channel fetched Succesfully'})

    } catch (error) {
        return res.status(500).json({message : `Error in finding channel ${error}`})
    }
}

export const subscribe = async (req,res) => {
    try {
        const {userId} = req.params

        const selfUser = await User.findByIdAndUpdate(req.user._id,
            { $push: { subscribedUsers: userId } },
        )
        const otherUser = await User.findByIdAndUpdate(userId,
            { $inc: {subscriberCount: 1}},
        )

        if (!selfUser || !otherUser)return res.status(500).json({message : `Error in updating subscription`})
        
        return res.status(200).json({message : `Subscribed Successfully`})
        
    } catch (error) {
        return res.status(500).json({message : `Error in subscribing ${error}`})
    }
}

export const unsubscribe = async (req,res) => {
    try {
        const {userId} = req.params

        const selfUser = await User.findByIdAndUpdate(req.user._id,
            { $pull: { subscribedUsers: userId } },
        )
        const otherUser = await User.findByIdAndUpdate(userId,
            { $inc: {subscriberCount: -1}},
        )

        if (!selfUser || !otherUser)return res.status(500).json({message : `Error in updating unsubscription`})
        
        return res.status(200).json({message : `Unubscribed Successfully`})
        
    } catch (error) {
        return res.status(500).json({message : `Error in unsubscribing ${error}`})
    }
}

export const likeVideo = async (req,res) => {
    try {
        await Video.findByIdAndUpdate(
            req.params.videoId,
            {
                $addToSet : {likes :  req.user.id},
                $pull : {dislikes : req.user.id},
            }
        )
        return res.status(200).json({message: 'Likes added'})
    } catch (error) {
        return res.status(500).json({message: `Error in adding likes ${error}`})
    }
} 
export const unlikeVideo = async (req,res) => {
    try {
        await Video.findByIdAndUpdate(
            req.params.videoId,
            {
                $pull : {likes : req.user.id}
            }
        )
        return res.status(200).json({message: 'Unliked'})
    } catch (error) {
        return res.status(500).json({message: `Error in unliking ${error}`})
    }
} 
export const dislikeVideo = async (req,res) => {
    try {
        await Video.findByIdAndUpdate(
            req.params.videoId,
            {
                $addToSet : {dislikes :  req.user.id},
                $pull : {likes : req.user.id}
            }
        )
        return res.status(200).json({message: 'disikes added'})
    } catch (error) {
        return res.status(500).json({message: `Error in adding dislikes ${error}`})
    }
} 
export const undislikeVideo = async (req,res) => {
    try {
        await Video.findByIdAndUpdate(
            req.params.videoId,
            {
                $pull : {dislikes : req.user.id}
            }
        )
        return res.status(200).json({message: 'undisliked'})
    } catch (error) {
        return res.status(500).json({message: `Error in undislike ${error}`})
    }
} 
export const getUserById = async(req,res) => {
    try {
        
        const user = await User.findById(req.params.id)
        if (!user) return res.status(500).json({message: `user does not exist`})
        return res.status(200).json({user, message: `User fteched successfully`})
    } catch (error) {
        return res.status(500).json({message: `Error in getUserByVideoId ${error}`})
    }
}

export const googleAuth = async (req,res) => {
    try {
        const user = await User.findOne({email: req.body.email})
        if (user){
            const access_token = jwt.sign({id: user._id},process.env.SECRET_JWT_KEY)

            const options = {
                httpOnly: true,
            }
            return res.status(200)
            .cookie('accessToken', access_token,options)
            .json({user, message : 'User Logged In Succesfully'})
        }
        else {
            const newUser = await User({
                ...req.body,
                fromGoogle: true,
            })
            const savedUser = await newUser.save()
            const access_token = jwt.sign({id: savedUser._id},process.env.SECRET_JWT_KEY)

            const options = {
                httpOnly: true,
            }
            return res.status(200)
            .cookie('accessToken', access_token,options)
            .json({savedUser, message : 'User Logged In Succesfully'})
        }
    } catch (error) {
        return res.status(500).json({message: `Error in Google Auth ${error}`})
    }
}

/*"userName": "Guest_user",
    "password": "Guest@pass123"*/