import { Router } from "express";

import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";

const router = Router();

router.post(
    "/register",
    userController.registerUser
);
router.post(
    "/login",
    userController.loginUser
)
router.get(
    "/me",
    authMiddleware,
    userController.getCurrentUser
);

export default router;