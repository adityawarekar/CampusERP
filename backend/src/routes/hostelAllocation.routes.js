import { Router } from "express";

import hostelAllocationController
    from "../controllers/hostelAllocation.controller.js";

import authMiddleware
    from "../middleware/auth.middleware.js";

import roleMiddleware
    from "../middleware/role.middleware.js";
import studentOwnershipMiddleware
    from "../middleware/studentOwnership.middleware.js";

import hostelAllocationOwnershipMiddleware
    from "../middleware/hostelAllocationOwnership.middleware.js";

import validate
    from "../middleware/validation.middleware.js";

import {
    createHostelAllocationSchema
} from "../validators/hostelAllocation.validator.js";
const router = Router();
import {
    hostelAllocationQuerySchema
} from "../validators/hostelAllocationQuery.validator.js";

/**
 * @swagger
 * tags:
 *   name: Hostel Allocations
 *   description: Hostel allocation management APIs
 */

/**
 * @swagger
 * /hostel-allocations:
 *   get:
 *     summary: Get all hostel allocations
 *     tags: [Hostel Allocations]
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
 *         name: roomId
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Vacated]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, allocationDate, status, studentName]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Hostel allocations retrieved successfully
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
        "HOSTEL_STAFF"
    ),
    validate(
        hostelAllocationQuerySchema,
        "query"
    ),
    hostelAllocationController.getAllAllocations
);

/**
 * @swagger
 * /hostel-allocations:
 *   post:
 *     summary: Create a hostel allocation
 *     tags: [Hostel Allocations]
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
 *                 example: 1
 *               roomId:
 *                 type: integer
 *                 example: 1
 *               bedNumber:
 *                 type: integer
 *                 example: 1
 *               allocationDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-09-19"
 *     responses:
 *       201:
 *         description: Hostel allocation created successfully
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
        "HOSTEL_STAFF"
    ),
    validate(createHostelAllocationSchema),
    hostelAllocationController.createAllocation
);

/**
 * @swagger
 * /hostel-allocations/student/{studentId}:
 *   get:
 *     summary: Get hostel allocations by student ID
 *     tags: [Hostel Allocations]
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
 *         description: Student hostel allocations retrieved successfully
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
        "HOSTEL_STAFF",
        "STUDENT"
    ),
    studentOwnershipMiddleware,
    hostelAllocationController.getAllocationsByStudentId
);

/**
 * @swagger
 * /hostel-allocations/active:
 *   get:
 *     summary: Get active hostel allocations
 *     tags: [Hostel Allocations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Active hostel allocations retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get(
    "/active",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF"
    ),
    hostelAllocationController.getActiveAllocations
);

/**
 * @swagger
 * /hostel-allocations/{id}:
 *   get:
 *     summary: Get hostel allocation by ID
 *     tags: [Hostel Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Hostel allocation ID
 *     responses:
 *       200:
 *         description: Hostel allocation retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Hostel allocation not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF",
        "STUDENT"
    ),
    hostelAllocationOwnershipMiddleware,
    hostelAllocationController.getAllAllocationById
);

/**
 * @swagger
 * /hostel-allocations/{id}/vacate:
 *   put:
 *     summary: Vacate a hostel allocation
 *     tags: [Hostel Allocations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Hostel allocation ID
 *     responses:
 *       200:
 *         description: Hostel allocation vacated successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Hostel allocation not found
 */
router.put(
    "/:id/vacate",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF"
    ),
    hostelAllocationController.vacateAllocation
);

export default router;