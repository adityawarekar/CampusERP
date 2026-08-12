import { Router } from "express";
import enrollmentController from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/", enrollmentController.enrollStudent);
router.get("/", enrollmentController.getAllEnrollments);
router.get("/:id", enrollmentController.getEnrollmentById);

export default router;