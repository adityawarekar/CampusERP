import { Router } from "express";

import bookIssueController from "../controllers/bookIssue.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    bookIssueController.getAllBookIssues
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    bookIssueController.createBookIssue
);

router.put(
    "/:id/return",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    bookIssueController.returnBook
);

router.get(
    "/student/:studentId",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF",
        "STUDENT"
    ),
    bookIssueController.getBookIssuesByStudentId
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    bookIssueController.getBookIssueById
);

export default router;