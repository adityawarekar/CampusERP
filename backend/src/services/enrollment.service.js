import enrollmentRepository from "../repositories/enrollment.repository.js";

class EnrollmentService {

    async enrollStudent(studentId, courseId) {

        return await enrollmentRepository.enrollStudent(
            studentId,
            courseId
        );

    }

    async getAllEnrollments(userId, role) {

        if (
            role === "ADMIN" ||
            role === "FACULTY"
        ) {
            return await enrollmentRepository.findAll();
        }

        return await enrollmentRepository.findAllByUserId(
            userId
        );
    }

    async getEnrollmentById(id) {

        const enrollment =
            await enrollmentRepository.findById(id);

        if (!enrollment) {
            throw new Error("Enrollment not found");
        }

        return enrollment;
    }

    async deleteEnrollment(id) {
        const enrollment =
            await enrollmentRepository.findById(id);

        if (!enrollment) {
            throw new Error("Enrollment not found");
        }

        return await enrollmentRepository.delete(id);
    }

}

export default new EnrollmentService();