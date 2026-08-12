import enrollmentService from "../services/enrollment.service.js";

class EnrollmentController {

    async enrollStudent(req, res) {

        try {

            const { studentId, courseId } = req.body;

            const enrollment =
                await enrollmentService.enrollStudent(
                    studentId,
                    courseId
                );

            return res.status(201).json({
                success: true,
                message: "Student enrolled successfully",
                data: enrollment
            });

        } catch (error) {

            if (
                error.message === "Student not found" ||
                error.message === "Course not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            return res.status(400).json({
                success: false,
                message: error.message
            });

        }
    }
}

export default new EnrollmentController();