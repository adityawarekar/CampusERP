import { Router } from "express";

import enrollmentController from "../controllers/enrollment.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import enrollmentOwnershipMiddleware
    from "../middleware/enrollmentOwnership.middleware.js";

import validate from "../middleware/validation.middleware.js";

import {
    createEnrollmentSchema
} from "../validators/enrollment.validator.js";
import {
    enrollmentQuerySchema
} from "../validators/enrollmentQuery.validator.js";


const router = Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Student course enrollment management APIs
 */

/**
 * @swagger
 * /enrollments:
 *   post:
 *     summary: Enroll a student in a course
 *     tags: [Enrollments]
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
 *               - courseId
 *             properties:
 *               studentId:
 *                 type: integer
 *                 example: 2
 *               courseId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Student enrolled successfully
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
    validate(createEnrollmentSchema),
    enrollmentController.enrollStudent
);
/**
 * @swagger
 * /enrollments:
 *   get:
 *     summary: Get all enrollments
 *     tags: [Enrollments]
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
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [enrolledAt, id]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Enrollments retrieved successfully
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
    validate(
        enrollmentQuerySchema,
        "query"
    ),
    enrollmentController.getAllEnrollments
);

/**
 * @swagger
 * /enrollments/{id}:
 *   get:
 *     summary: Get enrollment by ID
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Enrollment not found
 */
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



/**
 * @swagger
 * /enrollments/{id}:
 *   delete:
 *     summary: Delete an enrollment
 *     tags: [Enrollments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Enrollment ID
 *     responses:
 *       200:
 *         description: Enrollment deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Enrollment not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    enrollmentController.deleteEnrollment
);

export default router;