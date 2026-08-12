import { Router } from "express";
import courseController from "../controllers/course.controller.js";

const router = Router();

router.get("/", courseController.getAllCourses);

export default router;