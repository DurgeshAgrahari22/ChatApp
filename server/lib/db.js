import mongoose from "mongoose";

export const connectDB = async()=>{
    try {
        // This is a listener that runs when Mongoose successfully connects to MongoDB.
        mongoose.connection.on('connected',()=>{
            console.log("Database Connected")
        })
        await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`)
    } catch (error) {
        console.log(error)
    }
}