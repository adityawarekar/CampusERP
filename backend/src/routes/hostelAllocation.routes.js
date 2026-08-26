import { Router } from "express";

import hostelAllocationController
    from "../controllers/hostelAllocation.controller.js";

const router = Router();

router.get(
    "/",
    hostelAllocationController.getAllAllocations
);

router.post(
    "/",
    hostelAllocationController.createAllocation
);

router.get(
    "/student/:studentId",
    hostelAllocationController
        .getAllocationsByStudentId
);
router.get(
    "/active",
    hostelAllocationController
        .getActiveAllocations
);


router.get(
    "/:id",
    hostelAllocationController.getAllAllocationById
);


router.put(
    "/:id/vacate",
    hostelAllocationController.vacateAllocation
);



export default router;