import studentService from "../services/student.service.js";

class StudentController {
    async getAllStudents(req, res) {

    try {

        const students =
            await studentService.getAllStudents();

        return res.status(200).json({
            success: true,
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
export default new StudentController();
