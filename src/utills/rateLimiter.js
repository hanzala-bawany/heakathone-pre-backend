import rateLimit from "express-rate-limit";



// e.g. max 5 requests in 1 minute
export const rateLimiter = (time , apiLimit , message ) => {
   return rateLimit({
        windowMs: time, // 1 minute
        max: apiLimit,
        message: message,
    })

}
