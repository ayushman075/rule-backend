import rateLimit from "express-rate-limit";

const rateLimiter = rateLimit({
    windowMs: 1 * 1000,
    max: 2,
    message: 'Too many requests, please try again later.'
});
  
export {rateLimiter}
