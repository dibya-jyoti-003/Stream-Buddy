import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    userName : {
        type: String,
        required: true,
        unique: true
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password : {
        type: String,
    },
    image : {
        type: String,
        default: 'No image',
    },
    subscriberCount : {
        type: Number,
        default: 0
    },
    subscribedUsers : {
        type: [String],
        default : [],
    },
    fromGoogle : {
        type : Boolean,
        default : false
    },
},
{
    timestamps: true,
})

export default mongoose.model('User',userSchema)