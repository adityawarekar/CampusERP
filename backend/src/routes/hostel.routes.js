import { Router } from "express";

import hostelController from "../controllers/hostel.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate
    from "../middleware/validation.middleware.js";

import {
    createHostelSchema,
    updateHostelSchema
} from "../validators/hostel.validator.js";
import {
    hostelQuerySchema
} from "../validators/hostelQuery.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Hostels
 *   description: Hostel management APIs
 */

/**
 * @swagger
 * /hostels:
 *   get:
 *     summary: Get all hostels
 *     tags: [Hostels]
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
 *         description: Search hostels
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, name, location, totalRooms]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Hostels retrieved successfully
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
        "HOSTEL_STAFF",
        "STUDENT"
    ),
    validate(
    hostelQuerySchema,
    "query"
),
    hostelController.getAllHostels
);

/**
 * @swagger
 * /hostels/{id}:
 *   get:
 *     summary: Get hostel by ID
 *     tags: [Hostels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Hostel ID
 *     responses:
 *       200:
 *         description: Hostel retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Hostel not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF",
        "STUDENT"
    ),
    hostelController.getHostelById
);

/**
 * @swagger
 * /hostels:
 *   post:
 *     summary: Create a new hostel
 *     tags: [Hostels]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Boys Hostel A"
 *               location:
 *                 type: string
 *                 example: "North Campus"
 *               totalRooms:
 *                 type: integer
 *                 example: 50
 *     responses:
 *       201:
 *         description: Hostel created successfully
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
    validate(createHostelSchema),
    hostelController.createHostel
);

/**
 * @swagger
 * /hostels/{id}:
 *   put:
 *     summary: Update a hostel
 *     tags: [Hostels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Hostel ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Boys Hostel A Updated"
 *               location:
 *                 type: string
 *                 example: "North Campus"
 *               totalRooms:
 *                 type: integer
 *                 example: 60
 *     responses:
 *       200:
 *         description: Hostel updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Hostel not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF"
    ),
    validate(updateHostelSchema),
    hostelController.updateHostel
);

/**
 * @swagger
 * /hostels/{id}:
 *   delete:
 *     summary: Delete a hostel
 *     tags: [Hostels]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Hostel ID
 *     responses:
 *       200:
 *         description: Hostel deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Hostel not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    hostelController.deleteHostel
);

export default router;