import { Router } from "express";

import hostelAllocationController
    from "../controllers/hostelAllocation.controller.js";

const router = Router();

router.post(
    "/",
    hostelAllocationController.createAllocation
);

export default router;