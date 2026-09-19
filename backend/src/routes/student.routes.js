import { Router } from "express";
import studentController from "../controllers/student.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import studentIdOwnershipMiddleware
    from "../middleware/studentIdOwnership.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
    createStudentSchema,
    updateStudentSchema
} from "../validators/student.validator.js";
import {
    studentQuerySchema
} from "../validators/studentQuery.validator.js";    

const router = Router();
/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management APIs
 */

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
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
 *         name: departmentId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [rollNumber, name, email, department]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Students retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get("/", authMiddleware, roleMiddleware("ADMIN"), validate(studentQuerySchema, "query"), studentController.getAllStudents);

/**
 * @swagger
 * /students/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
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
 *         description: Student retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.get(
    "/:id",
    authMiddleware,
    studentIdOwnershipMiddleware,
    studentController.getStudentById
);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rollNumber
 *               - firstName
 *               - lastName
 *               - email
 *               - departmentId
 *             properties:
 *               rollNumber:
 *                 type: integer
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               departmentId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Student created successfully
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
    roleMiddleware("ADMIN"),
    validate(createStudentSchema),
    studentController.createStudent
);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update a student
 *     tags: [Students]
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               departmentId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validate(updateStudentSchema),
    studentController.updateStudent
);

/**
 * @swagger
 * /students/{id}:
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
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
 *         description: Student deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), studentController.deleteStudent);

export default router;