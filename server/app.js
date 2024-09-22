import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
import {userRouter,videoRouter,commentRouter} from './routes/exportRouter.js'

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.use('/api/users', userRouter)
app.use('/api/videos', videoRouter)
app.use('/api/comments', commentRouter)

export {app}
