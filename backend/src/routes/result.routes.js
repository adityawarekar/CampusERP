import { Router } from "express";

import resultController from "../controllers/result.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import resultOwnershipMiddleware
    from "../middleware/resultOwnership.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
    createResultSchema,
    updateResultSchema
} from "../validators/result.validator.js";    

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    resultController.getAllResults
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    resultOwnershipMiddleware,
    resultController.getResultById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    validate(createResultSchema),
    resultController.createResult
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    validate(updateResultSchema),
    resultController.updateResult
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    resultController.deleteResult
);

export default router;