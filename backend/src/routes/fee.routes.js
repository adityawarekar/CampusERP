import { Router } from "express";

import feeController from "../controllers/fee.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    feeController.getAllFees
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    feeController.getFeeById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    feeController.createFee
);

router.post(
    "/:feeId/payments",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    feeController.createPayment
);

router.get(
    "/:feeId/payments",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    feeController.getPaymentsByFeeId
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    feeController.updateFee
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    feeController.deleteFee
);

export default router;