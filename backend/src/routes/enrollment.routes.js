import { Router } from "express";

import enrollmentController from "../controllers/enrollment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import enrollmentOwnershipMiddleware
    from "../middleware/enrollmentOwnership.middleware.js";

const router = Router();

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    enrollmentController.enrollStudent
);

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    enrollmentController.getAllEnrollments
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    enrollmentOwnershipMiddleware,
    enrollmentController.getEnrollmentById
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    enrollmentController.deleteEnrollment
);

export default router;