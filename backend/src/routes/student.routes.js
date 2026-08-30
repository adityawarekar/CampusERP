import { Router } from "express";
import studentController from "../controllers/student.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import studentIdOwnershipMiddleware
    from "../middleware/studentIdOwnership.middleware.js";

const router = Router();

router.get("/", authMiddleware, roleMiddleware("ADMIN"), studentController.getAllStudents);
router.get(
    "/:id",
    authMiddleware,
    studentIdOwnershipMiddleware,
    studentController.getStudentById
);
router.post("/", authMiddleware, roleMiddleware("ADMIN"), studentController.createStudent);
router.put("/:id", authMiddleware, roleMiddleware("ADMIN"), studentController.updateStudent);
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), studentController.deleteStudent);

export default router;