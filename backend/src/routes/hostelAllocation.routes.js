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

router.get(
    "/active",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "HOSTEL_STAFF"
    ),
    hostelAllocationController.getActiveAllocations
);

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