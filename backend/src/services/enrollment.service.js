import enrollmentRepository from "../repositories/enrollment.repository.js";

class EnrollmentService {

    async enrollStudent(studentId, courseId) {

        return await enrollmentRepository.enrollStudent(
            studentId,
            courseId
        );

    }

    async getAllEnrollments(
    userId,
    role,
    page = 1,
    limit = 10,
    studentId = null,
    courseId = null,
    sortBy = null,
    order = null
) {

    const offset = (page - 1) * limit;

    if (
        role === "ADMIN" ||
        role === "FACULTY"
    ) {
        const [enrollments, total] = await Promise.all([
            enrollmentRepository.findAll(
                limit,
                offset,
                studentId,
                courseId,
                sortBy,
                order
            ),
            enrollmentRepository.countAll(
                studentId,
                courseId
            )
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: enrollments,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    const [enrollments, total] = await Promise.all([
        enrollmentRepository.findAllByUserId(userId, limit, offset, sortBy, order),
        enrollmentRepository.countAllByUserId(userId)
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
        data: enrollments,
        pagination: {
            page,
            limit,
            total,
            totalPages
        }
    };
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