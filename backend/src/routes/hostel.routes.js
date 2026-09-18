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
    validate(createHostelSchema),
    hostelController.createHostel
);

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

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    hostelController.deleteHostel
);

export default router;