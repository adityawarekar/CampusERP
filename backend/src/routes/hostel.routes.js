import { Router } from "express";

import hostelController from "../controllers/hostel.controller.js";

const router = Router();

router.get(
    "/",
    hostelController.getAllHostels
);
router.get(
    "/:id",
    hostelController.getHostelById
);
router.post(
    "/",
    hostelController.createHostel
);
router.put(
    "/:id",
    hostelController.updateHostel
);
router.delete(
    "/:id",
    hostelController.deleteHostel
);

export default router;