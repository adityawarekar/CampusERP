import { Router } from "express";
import enrollmentController from "../controllers/enrollment.controller.js";

const router = Router();

router.post("/", enrollmentController.enrollStudent);

export default router;