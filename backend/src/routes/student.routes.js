import { Router } from "express";
import studentController from "../controllers/student.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import studentIdOwnershipMiddleware
    from "../middleware/studentIdOwnership.middleware.js";
import validate from "../middleware/validation.middleware.js";

import {
    createStudentSchema,
    updateStudentSchema
} from "../validators/student.validator.js";
import {
    studentQuerySchema
} from "../validators/studentQuery.validator.js";    

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN"), validate(studentQuerySchema, "query"), studentController.getAllStudents);
router.get(
    "/:id",
    authMiddleware,
    studentIdOwnershipMiddleware,
    studentController.getStudentById
);
router.post(
    "/",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validate(createStudentSchema),
    studentController.createStudent
);
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("ADMIN"),
    validate(updateStudentSchema),
    studentController.updateStudent
);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), studentController.deleteStudent);

export default router;