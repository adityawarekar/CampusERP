import { Router } from "express";
import attendanceController from "../controllers/attendance.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import attendanceOwnershipMiddleware from "../middleware/attendanceOwnership.middleware.js";

const router = Router();

router.get("/", attendanceController.getAllAttendance);
router.get(
    "/summary/:studentId",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    attendanceOwnershipMiddleware,
    attendanceController.getStudentAttendanceSummary
);
router.get("/low-attendance", attendanceController.getLowAttendanceStudents);
router.get(
    "/:id",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "STUDENT"
    ),
    attendanceOwnershipMiddleware,
    attendanceController.getAttendanceById
);

export default router;