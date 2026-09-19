import { Router } from "express";

import resultController from "../controllers/result.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import resultOwnershipMiddleware
    from "../middleware/resultOwnership.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
    createResultSchema,
    updateResultSchema
} from "../validators/result.validator.js";
import {
    resultQuerySchema
} from "../validators/resultQuery.validator.js";    

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Results
 *   description: Student examination result management APIs
 */

/**
 * @swagger
 * /results:
 *   get:
 *     summary: Get all results
 *     tags: [Results]
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
 *         description: Number of results per page
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter results by student ID
 *       - in: query
 *         name: examId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter results by exam ID
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [marks, grade, studentName, examName]
 *         description: Sort field
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Sort order
 *     responses:
 *       200:
 *         description: Results retrieved successfully
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
    validate(resultQuerySchema, "query"),
    resultController.getAllResults
);

/**
 * @swagger
 * /results/{id}:
 *   get:
 *     summary: Get result by ID
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Result ID
 *     responses:
 *       200:
 *         description: Result retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Result not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    resultOwnershipMiddleware,
    resultController.getResultById
);

/**
 * @swagger
 * /results:
 *   post:
 *     summary: Create a student result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - examId
 *               - marks
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 2
 *               examId:
 *                 type: integer
 *                 example: 1
 *               marks:
 *                 type: number
 *                 example: 85
 *               grade:
 *                 type: string
 *                 example: A
 *     responses:
 *       201:
 *         description: Result created successfully
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
    validate(createResultSchema),
    resultController.createResult
);

/**
 * @swagger
 * /results/{id}:
 *   put:
 *     summary: Update a student result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Result ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marks:
 *                 type: number
 *                 example: 90
 *               grade:
 *                 type: string
 *                 example: A+
 *     responses:
 *       200:
 *         description: Result updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Result not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    validate(updateResultSchema),
    resultController.updateResult
);

/**
 * @swagger
 * /results/{id}:
 *   delete:
 *     summary: Delete a student result
 *     tags: [Results]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Result ID
 *     responses:
 *       200:
 *         description: Result deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Result not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    resultController.deleteResult
);

export default router;