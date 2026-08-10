import attendanceRepository from "../repositories/attendance.repository.js";

class AttendanceService {
    async getAllAttendance() {
        return await attendanceRepository.findAll();
    }
    async getAttendanceById(id) {

    const attendance =
        await attendanceRepository.findById(id);

    if (!attendance) {
        throw new Error("Attendance record not found");
    }

    return attendance;
}
}

export default new AttendanceService();