import express, { urlencoded } from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import { connectDB } from './lib/db.js'
import userRouter from './routes/userRoutes.js'
import messageRouter from './routes/messageRoutes.js'
import {Server} from 'socket.io'

// create express app and http server
const app = express();

// socket io support http server
const server = http.createServer(app)

// initialize socket.io server
export const io = new Server(server,{
    cors:{origin:"*"}
})

// Store Online users
export const userSocketMap = {} // {userId:socketId}

// socket.io connection handler 
io.on("connection",(socket)=>{
    const userId = socket.handshake.query.userId;
    console.log("User connected", userId);
    if(userId) userSocketMap[userId] = socket.id

    // Emit Online users to all connected clients
    io.emit("getOnlineUsers",Object.keys(userSocketMap))

    socket.on("disconnect",()=>{
        console.log("User Disconnected",userId);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers",Object.keys(userSocketMap));
    })
}) 

// middleware setup
app.use(express.json({limit:"4mb"}));
app.use(cors())

// Routes Setup
app.use('/api/status',(req,res)=>{
    res.send("server is live")
})
app.use("/api/auth",userRouter)
app.use("/api/messages",messageRouter)

// connect to MongoDb
await connectDB();
const PORT = process.env.PORT || 5000;
server.listen(PORT,()=>{
    console.log(`server is runnung on PORT:${PORT}`)
})