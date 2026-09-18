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

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    roomController.deleteRoom
);

export default router;