import express from "express"
import { signupController , loginController }  from "../controllers/authController.js"
import rateLimit from "express-rate-limit"

const authRoutes = express.Router()


authRoutes.post("/signup"  ,signupController)
authRoutes.post("/login" , rateLimit( 60*1000 , 5 ,"Too many login attempts, try again later.") , loginController)

export {authRoutes}