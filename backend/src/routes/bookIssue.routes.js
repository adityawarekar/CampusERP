import { Router } from "express";
import bookIssueController from "../controllers/bookIssue.controller.js";

const router = Router();

router.get(
    "/",
    bookIssueController.getAllBookIssues
);
router.post(
    "/",
    bookIssueController.createBookIssue
);
router.put(
    "/:id/return",
    bookIssueController.returnBook
);
router.get(
    "/student/:studentId",
    bookIssueController.getBookIssuesByStudentId
);
router.get(
    "/:id",
    bookIssueController.getBookIssueById
);


export default router;