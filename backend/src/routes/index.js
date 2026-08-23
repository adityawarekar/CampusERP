import { Router } from "express";
import departmentRoutes from "./department.routes.js";
import studentRoutes from  "./student.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";
import courseRoutes from "./course.routes.js";
import examRoutes from "./exam.routes.js";
import resultRoutes from "./result.routes.js";
import feeRoutes from "./fee.routes.js";
import bookRoutes from "./book.routes.js";
import bookIssueRoutes from "./bookIssue.routes.js";
import hostelRoutes from "./hostel.routes.js";
import roomRoutes from "./room.routes.js";


const router = Router();

router.use("/departments", departmentRoutes);
router.use("/students", studentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/enrollments", enrollmentRoutes);
router.use("/courses", courseRoutes);
router.use("/exams", examRoutes);
router.use("/results", resultRoutes);
router.use("/fees", feeRoutes);
router.use("/books", bookRoutes);
router.use("/book-issues", bookIssueRoutes);
router.use("/hostels", hostelRoutes);
router.use("/rooms", roomRoutes);


export default router;