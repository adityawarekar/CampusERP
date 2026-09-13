import attendanceRepository from "../repositories/attendance.repository.js";

class AttendanceService {
    async getAllAttendance(
        page = 1,
        limit = 10,
        studentId = null,
        status = null,
        sortBy = null,
        order = null
    ) {

        const offset = (page - 1) * limit;

        const [attendanceRecords, total] = await Promise.all([
            attendanceRepository.findAll(
                limit,
                offset,
                studentId,
                status,
                sortBy,
                order
            ),
            attendanceRepository.countAll(
                studentId,
                status
            )
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: attendanceRecords,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    async getAttendanceById(id) {

        const attendance =
            await attendanceRepository.findById(id);

        if (!attendance) {
            throw new Error("Attendance record not found");
        }

        return attendance;
    }

    async getStudentAttendanceSummary(studentId) {

        return await attendanceRepository
            .getStudentAttendanceSummary(studentId);

    }

    async getLowAttendanceStudents() {

        return await attendanceRepository.getLowAttendanceStudents();

    }
}

export default new AttendanceService();