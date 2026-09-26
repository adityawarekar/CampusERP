import rateLimit from "express-rate-limit";

const isTestEnvironment = process.env.NODE_ENV === "test";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,

    // Keep production security limit.
    // Allow enough requests for Jest integration tests.
    max: isTestEnvironment ? 100 : 10,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many authentication attempts. Please try again later."
    }
});