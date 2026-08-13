import { Router } from "express";
import courseController from "../controllers/course.controller.js";

const router = Router();

router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", courseController.createCourse);
router.put("/:id", courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

export default router;