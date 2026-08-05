import { Router } from "express";
import studentController from "../controllers/student.controller.js";

const router = Router();

router.get("/", studentController.getAllStudents);

export default router;