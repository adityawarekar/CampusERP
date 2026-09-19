import { Router } from "express";
import attendanceController from "../controllers/attendance.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";
import attendanceOwnershipMiddleware from "../middleware/attendanceOwnership.middleware.js";
import validate from "../middleware/validation.middleware.js";
import {
    attendanceQuerySchema
} from "../validators/attendanceQuery.validator.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Attendance
 *   description: Student attendance management APIs
 */

/**
 * @swagger
 * /attendance:
 *   get:
 *     summary: Get all attendance records
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *       - in: query
 *         name: studentId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter attendance by student ID
 *       - in: query
 *         name: courseId
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Filter attendance by course ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Present, Absent]
 *         description: Filter attendance by status
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter attendance by date
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [id, attendanceDate, status]
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *     responses:
 *       200:
 *         description: Attendance records retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get(
    "/",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    validate(
        attendanceQuerySchema,
        "query"
    ),
    attendanceController.getAllAttendance
);

/**
 * @swagger
 * /attendance/summary/{studentId}:
 *   get:
 *     summary: Get student attendance summary
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: studentId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student attendance summary retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Student not found
 */
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

/**
 * @swagger
 * /attendance/low-attendance:
 *   get:
 *     summary: Get students with low attendance
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Students with low attendance retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 */
router.get(
    "/low-attendance",
    authMiddleware,
    roleMiddleware(
        "ADMIN",
        "FACULTY"
    ),
    attendanceController.getLowAttendanceStudents
);
/**
 * @swagger
 * /attendance/{id}:
 *   get:
 *     summary: Get attendance record by ID
 *     tags: [Attendance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Attendance record ID
 *     responses:
 *       200:
 *         description: Attendance record retrieved successfully
 *       401:
 *         description: Authentication required
 *       403:
 *         description: Access denied
 *       404:
 *         description: Attendance record not found
 */
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