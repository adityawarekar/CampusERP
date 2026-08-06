import { Router } from "express";
import studentController from "../controllers/student.controller.js";

const router = Router();

router.get("/", studentController.getAllStudents);
router.get("/:id", studentController.getStudentById);
router.post("/", studentController.createStudent);

export default router;