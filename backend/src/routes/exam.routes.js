import { Router } from "express";
import examController from "../controllers/exam.controller.js";

const router = Router();

router.get("/", examController.getAllExams);
router.get("/:id", examController.getExamById);
router.post("/", examController.createExam);
router.put("/:id", examController.updateExam);
router.delete("/:id", examController.deleteExam);

export default router;