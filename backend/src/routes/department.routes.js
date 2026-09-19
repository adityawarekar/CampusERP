import { Router } from "express";

import departmentController from "../controllers/department.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import roleMiddleware from "../middleware/role.middleware.js";
import validate
    from "../middleware/validation.middleware.js";

import {
    createDepartmentSchema,
    updateDepartmentSchema
} from "../validators/department.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management APIs
 */

/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments fetched successfully
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
    departmentController.getAllDepartments
);

/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     tags: [Departments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department fetched successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Department not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    departmentController.getDepartmentById
);
/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a department
 *     tags: [Departments]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: Computer Engineering
 *               code:
 *                 type: string
 *                 example: COMP
 *     responses:
 *       201:
 *         description: Department created successfully
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
    validate(createDepartmentSchema),
    departmentController.createDepartment
);
/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update a department
 *     tags: [Departments]
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
 *                 example: Computer Engineering
 *               code:
 *                 type: string
 *                 example: COMP
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Department not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    validate(updateDepartmentSchema),
    departmentController.updateDepartment
);
/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department
 *     tags: [Departments]
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
 *         description: Department deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Department not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    departmentController.deleteDepartment
);

export default router;