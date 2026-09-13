import attendanceService from "../services/attendance.service.js";

class AttendanceController {

    async getAllAttendance(req, res) {

        try {

            const page =
                parseInt(req.query.page) || 1;

            const limit =
                parseInt(req.query.limit) || 10;

            const studentId =
                req.query.studentId
                    ? parseInt(req.query.studentId)
                    : null;

            const status =
                req.query.status || null;

            const sortBy = req.query.sortBy || null;
            const order = req.query.order || null;

            const result =
                await attendanceService.getAllAttendance(
                    page,
                    limit,
                    studentId,
                    status,
                    sortBy,
                    order
                );

            return res.status(200).json({
                success: true,
                message: "Attendance fetched successfully",
                data: result.data,
                pagination: result.pagination
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    async getAttendanceById(req, res) {

        try {

            const { id } = req.params;

            const attendance =
                await attendanceService.getAttendanceById(id);

            return res.status(200).json({
                success: true,
                data: attendance
            });

        } catch (error) {

            if (error.message === "Attendance record not found") {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async getStudentAttendanceSummary(req, res) {

        try {

            const { studentId } = req.params;

            const summary =
                await attendanceService.getStudentAttendanceSummary(
                    studentId
                );

            return res.status(200).json({
                success: true,
                message: "Attendance summary fetched successfully",
                data: summary
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async getLowAttendanceStudents(req, res) {

        try {

            const students =
                await attendanceService.getLowAttendanceStudents();

            return res.status(200).json({
                success: true,
                message: "Low attendance students fetched successfully",
                data: students
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

}

export default new AttendanceController();