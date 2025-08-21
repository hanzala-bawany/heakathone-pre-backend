import express from "express"
import { authRoutes } from "./src/routes/authRoute.js"
import { connectDB } from "./src/utills/connectDB.js"
// import cookieParser from "cookie-parser"
import cors from "cors"
import dotenv from "dotenv"
import { testRoutes } from "./src/routes/testRoute.js"
// import helmet from "helmet";
// import mongoSanitize from 'express-mongo-sanitize';


dotenv.config();

const app = express()
const port = 3000

connectDB()

// app.use(helmet());
// app.use(mongoSanitize());
app.use(cors({
 origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"] ,
//  credentials: true
}))
app.use(express.json())
// app.use(cookieParser())

app.use('/api/auth', authRoutes)
app.use('/api/test', testRoutes)


app.get('/', (req, res) => {
  res.send("Server is running")
})


if (process.env.NODE_ENV === "development") {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}

export default app;

