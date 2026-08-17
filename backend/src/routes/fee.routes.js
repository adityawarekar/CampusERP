import { Router } from "express";
import feeController from "../controllers/fee.controller.js";

const router = Router();

router.get("/", feeController.getAllFees);
router.get("/:id", feeController.getFeeById);
router.post("/", feeController.createFee);
router.post("/:feeId/payments", feeController.createPayment);
router.get("/:feeId/payments", feeController.getPaymentsByFeeId);
router.put("/:id", feeController.updateFee);
router.delete("/:id", feeController.deleteFee);

export default router;