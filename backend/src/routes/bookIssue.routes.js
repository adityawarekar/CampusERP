import { Router } from "express";

import bookIssueController from "../controllers/bookIssue.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import bookIssueOwnershipMiddleware from "../middleware/bookIssueOwnership.middleware.js";
import validate
    from "../middleware/validation.middleware.js";

import {
    createBookIssueSchema
} from "../validators/bookIssue.validator.js";
import {
    bookIssueQuerySchema
} from "../validators/bookIssueQuery.validator.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    validate(
        bookIssueQuerySchema,
        "query"
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
    validate(createBookIssueSchema),
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
    bookIssueOwnershipMiddleware,
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