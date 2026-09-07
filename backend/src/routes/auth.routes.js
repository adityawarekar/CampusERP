import { Router } from "express";

import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import validate
    from "../middleware/validation.middleware.js";

import {
    registerSchema,
    loginSchema
} from "../validators/auth.validator.js";

const router = Router();

router.post(
    "/register",
    validate(registerSchema),
    userController.registerUser
);
router.post(
    "/login",
    validate(loginSchema),
    userController.loginUser
)
router.get(
    "/me",
    authMiddleware,
    userController.getCurrentUser
);

export default router;