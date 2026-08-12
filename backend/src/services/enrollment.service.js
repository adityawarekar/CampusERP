import enrollmentRepository from "../repositories/enrollment.repository.js";

class EnrollmentService {

    async enrollStudent(studentId, courseId) {

        return await enrollmentRepository.enrollStudent(
            studentId,
            courseId
        );

    }

    async getAllEnrollments() {

        return await enrollmentRepository.findAll();

    }

    async getEnrollmentById(id) {

        const enrollment =
            await enrollmentRepository.findById(id);

        if (!enrollment) {
            throw new Error("Enrollment not found");
        }

        return enrollment;
    }

}

export default new EnrollmentService();