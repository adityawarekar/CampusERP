import { Router } from "express";

import feeController from "../controllers/fee.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import feeOwnershipMiddleware from "../middleware/feeOwnership.middleware.js";
import paymentOwnershipMiddleware from "../middleware/paymentOwnership.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
    createFeeSchema,
    createPaymentSchema,
    updateFeeSchema
} from "../validators/fee.validator.js";
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
    feeOwnershipMiddleware,
    feeController.getFeeById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validate(createFeeSchema),
    feeController.createFee
);

router.post(
    "/:feeId/payments",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    paymentOwnershipMiddleware,
    validate(createPaymentSchema),
    feeController.createPayment
);

router.get(
    "/:feeId/payments",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    paymentOwnershipMiddleware,
    feeController.getPaymentsByFeeId
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validate(updateFeeSchema),
    feeController.updateFee
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    feeController.deleteFee
);

export default router;