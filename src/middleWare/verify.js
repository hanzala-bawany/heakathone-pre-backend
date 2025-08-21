import { errorHandler, successHandler } from "../utills/resHandler.js";
import pkg from "jsonwebtoken"
const { verify } = pkg

export const verifyToken = async (req, res, next) => {

    try {

        // console.log(req, "<------ console req");
        const token = req?.cookies?.token || req?.headers?.authorization?.split(" ")[1]
        // console.log(token, "<---- token")
        if (!token) return errorHandler(res, 404, "token not found")

        const isTokenValid = verify(token, process.env.JWT_secretKey);
        // console.log(isTokenValid, "----> login wale user ka token wala data");

        req.loginUser = { ...isTokenValid }
        // console.log(req.loginUser, "---> token ke waqt dia hua data");
        next()

    }
    catch (error) {

        console.log(error, "---> token verification error")
        
        if (error?.name === "TokenExpiredError" || error?.name === "JsonWebTokenError") {
            //   res.clearCookie("token", {
            //     httpOnly: true,
            //     sameSite: "lax",
            //     secure: false
            //   })
            console.log("invalid token or expires token");
            return errorHandler(res, 401, "Invalid User")
        }

        return errorHandler(res, 500, "Server error during token verification")
    }

}

export const verifyUser = async (req, res, next) => {
    try {

        const { userId: loginUserId, isAdmin } = req.loginUser
        const { id: paramsId } = req.params
        if (loginUserId !== paramsId && !isAdmin) errorHandler(res, 404, "you are not able to update others data")
        next()

    }
    catch (error) {
        console.log(error, "---> verify user me error he");
        errorHandler(res, 500, "uknown error in verify user", error)
    }
}

export const verifyAdmin = async (req, res, next) => {
    try {

        const { isAdmin } = req.loginUser
        if (!isAdmin) errorHandler(res, 404, "Only admin can access")
        next()

    }
    catch (error) {
        console.log(error, "---> verify admin me error he");
        errorHandler(res, 500, "uknown error in verify admin")
    }
}

