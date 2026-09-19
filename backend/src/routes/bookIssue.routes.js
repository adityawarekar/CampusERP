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

/**
 * @swagger
 * tags:
 *   name: Book Issues
 *   description: Library book issue and return management APIs
 */

/**
 * @swagger
 * /book-issues:
 *   get:
 *     summary: Get all book issues
 *     tags: [Book Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter by student ID
 *       - in: query
 *         name: bookId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter by book ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Issued, Returned]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, issueDate, dueDate, returnDate, status]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Book issues retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
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

/**
 * @swagger
 * /book-issues:
 *   post:
 *     summary: Issue a book to a student
 *     tags: [Book Issues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 2
 *               bookId:
 *                 type: integer
 *                 example: 1
 *               issueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-19"
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-10-03"
 *     responses:
 *       201:
 *         description: Book issued successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
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

/**
 * @swagger
 * /book-issues/{id}/return:
 *   put:
 *     summary: Return an issued book
 *     tags: [Book Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Book issue ID
 *     responses:
 *       200:
 *         description: Book returned successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Book issue not found
 */
router.put(
    "/:id/return",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "LIBRARY_STAFF"
    ),
    bookIssueController.returnBook
);
/**
 * @swagger
 * /book-issues/student/{studentId}:
 *   get:
 *     summary: Get book issues for a student
 *     tags: [Book Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student book issues retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
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
/**
 * @swagger
 * /book-issues/{id}:
 *   get:
 *     summary: Get book issue by ID
 *     tags: [Book Issues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Book issue ID
 *     responses:
 *       200:
 *         description: Book issue retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Book issue not found
 */
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