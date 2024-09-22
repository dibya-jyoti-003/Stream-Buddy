import mongoose from "mongoose";

export default async function connect_DB (){
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI)
        console.log('Connected to MongoDB')
    } catch (error) {
        console.error('Failed to connect to MongoDB')
        process.exit(1);
    }
}