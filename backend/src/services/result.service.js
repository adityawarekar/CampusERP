import resultRepository from "../repositories/result.repository.js";

class ResultService {

    async getAllResults(
        userId,
        role,
        page = 1,
        limit = 10,
        studentId = null,
        examId = null,
        sortBy = null,
        order = null
    ) {

        const offset = (page - 1) * limit;

        if (
            role === "ADMIN" ||
            role === "FACULTY"
        ) {
            const [results, total] = await Promise.all([
                resultRepository.findAll(
                    limit,
                    offset,
                    studentId,
                    examId,
                    sortBy,
                    order
                ),
                resultRepository.countAll(
                    studentId,
                    examId
                )
            ]);

            const totalPages = Math.ceil(total / limit);

            return {
                data: results,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages
                }
            };
        }

        const [results, total] = await Promise.all([
            resultRepository.findAllByUserId(userId, limit, offset, sortBy, order),
            resultRepository.countAllByUserId(userId)
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: results,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    async getResultById(id) {
        const result =
            await resultRepository.findById(id);

        if (!result) {
            throw new Error("Result not found");
        }

        return result;
    }

    async createResult(
        studentId,
        examId,
        marksObtained
    ) {

        const student =
            await resultRepository.findStudentById(studentId);

        if (!student) {
            throw new Error("Student not found");
        }

        const exam =
            await resultRepository.findExamById(examId);

        if (!exam) {
            throw new Error("Exam not found");
        }

        if (marksObtained < 0) {
            throw new Error("Marks cannot be negative");
        }

        if (marksObtained > exam.max_marks) {
            throw new Error("Marks cannot exceed maximum marks");
        }

        const enrollment =
            await resultRepository.findEnrollment(
                studentId,
                exam.course_id
            );

        if (!enrollment) {
            throw new Error(
                "Student is not enrolled in this course"
            );
        }

        const existingResult =
            await resultRepository.findByStudentAndExam(
                studentId,
                examId
            );

        if (existingResult) {
            throw new Error(
                "Result already exists for this student"
            );
        }

        return await resultRepository.create(
            studentId,
            examId,
            marksObtained
        );
    }

    async updateResult(id, marksObtained) {

        const result =
            await resultRepository.findById(id);

        if (!result) {
            throw new Error("Result not found");
        }

        if (marksObtained < 0) {
            throw new Error("Marks cannot be negative");
        }

        if (marksObtained > result.max_marks) {
            throw new Error("Marks cannot exceed maximum marks");
        }

        return await resultRepository.update(
            id,
            marksObtained
        );
    }

    async deleteResult(id) {
        const result =
            await resultRepository.findById(id);

        if (!result) {
            throw new Error("Result not found");
        }

        return await resultRepository.delete(id);
    }

}

export default new ResultService();