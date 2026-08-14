import { Router } from "express";
import enrollmentController from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/", enrollmentController.enrollStudent);
router.get("/", enrollmentController.getAllEnrollments);
router.get("/:id", enrollmentController.getEnrollmentById);
router.delete("/:id", enrollmentController.deleteEnrollment);


export default router;