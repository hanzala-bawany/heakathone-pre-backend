import express from "express"
import rateLimit from "express-rate-limit"
import { testGetDatController } from "../controllers/testController.js"
import { verifyToken }  from "../middleWare/verify.js"

const testRoutes = express.Router()


testRoutes.get("/getTestData" , verifyToken  , rateLimit( 20*1000 , 5 ,"Too many get data attempts try again letter")  , testGetDatController)


export {testRoutes}