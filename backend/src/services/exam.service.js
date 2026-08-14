import examRepository from "../repositories/exam.repository.js";

class ExamService {
    async getAllExams() {
        return await examRepository.findAll();
    }

    async getExamById(id) {
        const exam =
            await examRepository.findById(id);

        if (!exam) {
            throw new Error("Exam not found");
        }

        return exam;
    }

    async createExam(
        examName,
        examDate,
        maxMarks,
        courseId
    ) {
        const course =
            await examRepository.findByCourseId(courseId);

        if (!course) {
            throw new Error("Course not found");
        }

        return await examRepository.create(
            examName,
            examDate,
            maxMarks,
            courseId
        );
    }

    async updateExam(
        id,
        examName,
        examDate,
        maxMarks,
        courseId
    ) {

        const exam =
            await examRepository.findById(id);

        if (!exam) {
            throw new Error("Exam not found");
        }

        const course =
            await examRepository.findByCourseId(courseId);

        if (!course) {
            throw new Error("Course not found");
        }

        return await examRepository.update(
            id,
            examName,
            examDate,
            maxMarks,
            courseId
        );
    }

    async deleteExam(id) {

        const exam =
            await examRepository.findById(id);

        if (!exam) {
            throw new Error("Exam not found");
        }

        return await examRepository.delete(id);
    }
}

export default new ExamService();