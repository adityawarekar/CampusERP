import { Router } from "express";
import feeController from "../controllers/fee.controller.js";

const router = Router();

router.get("/", feeController.getAllFees);
router.get("/:id", feeController.getFeeById);
router.post("/", feeController.createFee);

export default router;