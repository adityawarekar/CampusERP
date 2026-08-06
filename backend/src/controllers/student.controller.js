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

    async getStudentById(req, res) {
        try {
            const { id } = req.params;

            const student = 
                await studentService.getStudentById(id);

            return res.status(200).json({
                success: true,
                data: student
            });    

        } catch (error) {
            if (error.message === "Student not found") {
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

    async createStudent(req, res) {

    try {

        const {
            rollNumber,
            firstName,
            lastName,
            email,
            phoneNumber,
            departmentId
        } = req.body;

        const student = await studentService.createStudent(
            rollNumber,
            firstName,
            lastName,
            email,
            phoneNumber,
            departmentId
        );

        return res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: student
        });

    } catch (error) {

        if (
            error.message === "Department not found" ||
            error.message === "Roll number already exists" ||
            error.message === "Email already exists"
        ) {
            return res.status(400).json({
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

    

}
export default new StudentController();
