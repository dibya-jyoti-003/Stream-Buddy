import Comment from '../models/commentModel.js'
import Video from '../models/videoModel.js'

export const addComment = async (req,res) => {
    try {
        
        const userId = req.user._id
        const videoId = req.params.videoId
        const video = await Video.findById(videoId)
        if (!video)return res.status(400).json(comment, {message : `Video does not exist`})
        const comment = new Comment({...req.body, userId, videoId})
        const saveComment = await comment.save()
        if (!saveComment)return res.status(500).json({message : `Error in saving comment`})

        return res.status(200).json({comment ,message : `Succesfully added comment`})

    } catch (error) {
        return res.status(500).json({message : `Error in uploading comment, ${error}`})
    }
}

export const editComment = async(req,res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (req.user.id !== comment.userId){
            return res.status(400).json({message: 'You can only update your comment '})
        }
        const {desc} = req.body
        comment.description = desc
        const updatedComment = await comment.save()
        return res.status(200).json({comment , message: 'Comment Saved successfully'})
    } catch (error) {
        return res.status(400).json({message: `Error is updating comment ,${error}`})
    }
}
export const deleteComment = async(req,res) => {
    try {
        const comment = await Comment.findById(req.params.id)
        if (req.user.id !== comment.userId){
            return res.status(400).json({message: 'You can only delete your comment '})
        }
        const delComment = await Comment.findByIdAndDelete(req.params.id)
        if (!delComment)return res.status(500).json({message: 'Error in deleting comment '})
        return res.status(200).json({message: 'Comment deleted successfully'})
    } catch (error) {
        return res.status(500).json({message: `Comment deleted Successfully `})
    }
}

export const getComments = async(req,res) =>{
    try {
        const videoId = req.params.videoId
        const comments = await Comment.find({videoId}).limit(10)
        return res.status(200).json(comments)
    } catch (error) {
        return res.status(500).json({message: `Error in getting comments, ${error}`})
    }
}