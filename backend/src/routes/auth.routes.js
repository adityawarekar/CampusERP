import { Router } from "express";

import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate
    from "../middleware/validation.middleware.js";

import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator.js";
import { authRateLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router();

router.post(
    "/register",
    authRateLimiter,
    validate(registerSchema),
    userController.registerUser
);
router.post(
    "/login",
    authRateLimiter,
    validate(loginSchema),
    userController.loginUser
)
router.get(
    "/me",
    authMiddleware,
    userController.getCurrentUser
);

export default router;