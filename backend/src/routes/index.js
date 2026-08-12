import { Router } from "express";
import departmentRoutes from "./department.routes.js";
import studentRoutes from  "./student.routes.js";
import attendanceRoutes from "./attendance.routes.js";
import enrollmentRoutes from "./enrollment.routes.js";

const router = Router();

router.use("/departments", departmentRoutes);
router.use("/students", studentRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/enrollments", enrollmentRoutes);

export default router;