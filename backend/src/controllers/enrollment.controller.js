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

    async getAllEnrollments(req, res) {

        try {

            const enrollments =
                await enrollmentService.getAllEnrollments();

            return res.status(200).json({
                success: true,
                message: "Enrollments fetched successfully",
                data: enrollments
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }

    }

    async getEnrollmentById(req, res) {

        try {

            const { id } = req.params;

            const enrollment =
                await enrollmentService.getEnrollmentById(id);

            return res.status(200).json({
                success: true,
                data: enrollment
            });

        } catch (error) {

            if (error.message === "Enrollment not found") {
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

    async deleteEnrollment(req, res) {
        try {
            const { id } = req.params;

            const enrollment = 
               await enrollmentService.deleteEnrollment(id);
            
            return res.status(200).json({
                success: true,
                message: "Enrollment deleted sucessfully",
                data: enrollment
            });   
        } catch (error) {
            if (error.message === "Enrollment not found") {
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
}

export default new EnrollmentController();