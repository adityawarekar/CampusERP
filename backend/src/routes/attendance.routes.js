import { Router } from "express";
import attendanceController from "../controllers/attendance.controller.js";

const router = Router();

router.get("/", attendanceController.getAllAttendance);
router.get("/:id", attendanceController.getAttendanceById);

export default router;