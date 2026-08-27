import { Router } from "express";

import roomController from "../controllers/room.controller.js";

const router = Router();

router.get(
    "/",
    roomController.getAllRooms
);
router.get(
    "/availability",
    roomController.getRoomAvailability
);
router.get(
    "/:id",
    roomController.getRoomsById
);
router.post(
    "/",
    roomController.createRoom
);

router.put(
    "/:id",
    roomController.updateRoom
);
router.delete(
    "/:id",
    roomController.deleteRoom
);

export default router;