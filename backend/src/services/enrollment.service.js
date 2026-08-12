import enrollmentRepository from "../repositories/enrollment.repository.js";

class EnrollmentService {

    async enrollStudent(studentId, courseId) {

        return await enrollmentRepository.enrollStudent(
            studentId,
            courseId
        );

    }

}

export default new EnrollmentService();