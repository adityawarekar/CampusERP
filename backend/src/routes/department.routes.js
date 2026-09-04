import { Router } from "express";

import departmentController from "../controllers/department.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

import roleMiddleware from "../middleware/role.middleware.js";

const router = Router();

router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    departmentController.getAllDepartments
);

router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY",
        "STUDENT"
    ),
    departmentController.getDepartmentById
);

router.post(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    departmentController.createDepartment
);

router.put(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    departmentController.updateDepartment
);

router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    departmentController.deleteDepartment
);

export default router;