
import Video from '../models/videoModel.js'
import User from '../models/userModel.js'

export const addVideo = async (req,res) => {
    try {
        
        const userId = req.user._id
        const {title , thumbnail, description ,videoUrl} = req.body
        if ([title , thumbnail, description ,videoUrl].some(field => field?.trim() === '')){
            return res.status(400).json({message : 'Please fill all the fields.'})
        }
        // console.log(req.body)
        const newVideo = new Video({...req.body,userId})
        const saveVideo = await newVideo.save()
        if (!saveVideo)return res.status(500).json({message : 'Error in saving video'})
        console.log(saveVideo)
        return res.status(200).json({saveVideo, message : 'Video Added successfully'})


    } catch (error) {
        return res.status(500).json({message : `Error in uploading video, ${error}`})
    }
}

export const updateVideo = async (req,res) => {
    try {
        const videoExist = await Video.findById(req.params.id)
        if (!videoExist)return res.status(400).json({message : 'No such video'})
        // console.log(videoExist)
        // console.log(req.user.id)
        // console.log(videoExist.userId)
        if (req.user.id !== videoExist.userId)return res.status(400).json({message : 'You can only update your video'})
        const reqVideo = await Video.findByIdAndUpdate(
             req.params.id,
             {
                 $set : req.body,
             },
             {new : true}
        )
        //console.log(reqVideo)
        if (!reqVideo)return res.status(500).json({message : 'Error in updating Video'})
        return res.status(200).json({message : 'Successfully updated video'})
        

    } catch (error) {
        
    }
}
export const deleteVideo = async (req,res) => {
    try {
        const reqVideo = await Video.findById(req.params.id)
        if (!reqVideo)return res.status(400).json({message : 'Video not found'})
        
        if (req.user.id !== reqVideo.userId)return res.status(400).json({message : 'You can delete your video only'})
        
        const delVideo = await Video.findByIdAndDelete(reqVideo._id)
        if (!delVideo)return res.status(500).json({message : 'Error in deleting video'})

        return res.status(200).json({message : 'succesfully Deleted Video'})
        
    } catch (error) {
        return res.status(500).json({message : `Error in getting Video, error ${error}`})
    }
}
export const getVideo = async (req,res) => {
    try {
        const reqVideo = await Video.findById(req.params.id)
        if (!reqVideo)return res.status(400).json({message : 'Video not found'})
        
        return res.status(200).json({reqVideo, message : 'succesfully fetched Video'})
        
    } catch (error) {
        return res.status(500).json({message : `Error in getting Video, error ${error}`})
    }
}
export const addView = async (req,res) => {
    try {
        await Video.findByIdAndUpdate(req.params.id,
            {$inc: {views:1}},
        )
        return res.status(200).json({message : 'View has been increased'})
    } catch (error) {
        return res.status(500).json({message : `Error in increasing view, error -> ${error}`})
    }
}
export const trend = async (req,res) => {
    try {
        const videos = await Video.find().sort({views:-1}).limit(4)
        return res.status(200).json(videos)
    } catch (error) {
        return res.status(500).json({message : `Error in trending videos, ${error}`})
    }
}
export const random = async (req,res) => {
    try {
        const videos = await Video.aggregate([{$sample:{size: 20}}])
        res.status(200).json(videos)
    } catch (error) {
        res.status(500).json({message : `Error in random videos, ${error}`})
    }
}
export const sub = async (req,res) => {
    try {
        const user = await User.findById(req.user.id)
        const subscribedChannels = user.subscribedUsers

        const list = await Promise.all(
            subscribedChannels.map(async (channelId) => {
                return await Video.find({userId: channelId})
            })
        )
        return res.status(200).json(list)

    } catch (error) {
        return res.status(500).json({message: `Error in getting subscribed videos, ${error}`})
    }
}
export const getByTag = async (req,res) => {
    try {
            const tags = req.query.tags.split(",")
            const videos = await Video.find({tags:{$in:tags}}).limit(20)
            return res.status(200).json(videos)
    } catch (error) {
        return res.status(500).json({message : `Error in get by tag, ${error}`})
    }
}
export const search = async (req,res) => {
    try {
        const query = req.query.search;
        console.log(query)
        const videos = await Video.find({
            title : { $regex: query, $options : "i"},
        }).limit(20)
        return res.status(200).json(videos)
    } catch (error) {
        return res.status(500).json({message : `Error in search ${error}`})
    }
}