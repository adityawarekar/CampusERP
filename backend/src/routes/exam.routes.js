import { Router } from "express";

import examController from "../controllers/exam.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    examController.getAllExams
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    examController.getExamById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    examController.createExam
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    examController.updateExam
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    examController.deleteExam
);

export default router;