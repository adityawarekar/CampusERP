import { Router } from "express";

import hostelController from "../controllers/hostel.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF",
        "STUDENT"
    ),
    hostelController.getAllHostels
);

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

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF"
    ),
    hostelController.createHostel
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF"
    ),
    hostelController.updateHostel
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    hostelController.deleteHostel
);

export default router;