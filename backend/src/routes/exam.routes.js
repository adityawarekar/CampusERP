import { Router } from "express";

import examController from "../controllers/exam.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
    createExamSchema,
    updateExamSchema
} from "../validators/exam.validator.js";

import {
    examQuerySchema
} from "../validators/examQuery.validator.js";

const router = Router();


/**
 * @swagger
 * tags:
 *   name: Exams
 *   description: Exam management APIs
 */

/**
 * @swagger
 * /exams:
 *   get:
 *     summary: Get all exams
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of exams per page
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter exams by course ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search exams
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [examName, examDate, courseName]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Exams retrieved successfully
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
        "FACULTY",
        "STUDENT"
    ),
    validate(examQuerySchema, "query"),
    examController.getAllExams
);

/**
 * @swagger
 * /exams/{id}:
 *   get:
 *     summary: Get exam by ID
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Exam not found
 */
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

/**
 * @swagger
 * /exams:
 *   post:
 *     summary: Create a new exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examName
 *               - examDate
 *               - courseId
 *             properties:
 *               examName:
 *                 type: string
 *                 example: "Mid Semester Examination"
 *               examDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-01"
 *               courseId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Exam created successfully
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
        "FACULTY"
    ),
    validate(createExamSchema),
    examController.createExam
);

/**
 * @swagger
 * /exams/{id}:
 *   put:
 *     summary: Update an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Exam ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               examName:
 *                 type: string
 *                 example: "Final Semester Examination"
 *               examDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-15"
 *               courseId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Exam updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Exam not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    validate(updateExamSchema),
    examController.updateExam
);

/**
 * @swagger
 * /exams/{id}:
 *   delete:
 *     summary: Delete an exam
 *     tags: [Exams]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Exam ID
 *     responses:
 *       200:
 *         description: Exam deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Exam not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    examController.deleteExam
);

export default router;