import { Router } from "express";

import roomController from "../controllers/room.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import validate
    from "../middleware/validation.middleware.js";

import {
    createRoomSchema,
    updateRoomSchema
} from "../validators/room.validator.js";
import {
    roomQuerySchema
} from "../validators/roomQuery.validator.js";

const router = Router();

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     tags: [Rooms]
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
 *         name: hostelId
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
 *           enum: [id, roomNumber, capacity, occupiedBeds]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
    roomQuerySchema,
    "query"
),
    roomController.getAllRooms
);

/**
 * @swagger
 * /rooms/availability:
 *   get:
 *     summary: Get room availability
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Room availability retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get(
    "/availability",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF",
        "STUDENT"
    ),
    roomController.getRoomAvailability
);

/**
 * @swagger
 * /rooms/{id}:
 *   get:
 *     summary: Get room by ID
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room not found
 */
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF",
        "STUDENT"
    ),
    roomController.getRoomsById
);

/**
 * @swagger
 * /rooms:
 *   post:
 *     summary: Create a new room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hostelId:
 *                 type: integer
 *                 example: 1
 *               roomNumber:
 *                 type: string
 *                 example: "101"
 *               capacity:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       201:
 *         description: Room created successfully
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
    validate(createRoomSchema),
    roomController.createRoom
);

/**
 * @swagger
 * /rooms/{id}:
 *   put:
 *     summary: Update a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomNumber:
 *                 type: string
 *                 example: "102"
 *               capacity:
 *                 type: integer
 *                 example: 4
 *     responses:
 *       200:
 *         description: Room updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room not found
 */
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF"
    ),
    validate(updateRoomSchema),
    roomController.updateRoom
);

/**
 * @swagger
 * /rooms/{id}:
 *   delete:
 *     summary: Delete a room
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Room not found
 */
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    roomController.deleteRoom
);

export default router;