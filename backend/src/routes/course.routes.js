import { Router } from "express";

import courseController from "../controllers/course.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
    createCourseSchema,
    updateCourseSchema
} from "../validators/course.validator.js";
import {
    courseQuerySchema
} from "../validators/courseQuery.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management APIs
 */

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
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
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, code]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
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
    validate(courseQuerySchema, "query"),
    courseController.getAllCourses
);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    courseController.getCourseById
);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - code
 *               - departmentId
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               departmentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Course created successfully
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
    validate(createCourseSchema),
    courseController.createCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               code:
 *                 type: string
 *               departmentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Course updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    validate(updateCourseSchema),
    courseController.updateCourse
);

/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Course deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Course not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    courseController.deleteCourse
);

export default router;