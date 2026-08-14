import examService from "../services/exam.service.js";

class ExamController {

    async getAllExams(req, res) {

        try {

            const exams =
                await examService.getAllExams();

            return res.status(200).json({
                success: true,
                message: "Exams fetched successfully",
                data: exams
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    async getExamById(req, res) {

        try {

            const { id } = req.params;

            const exam =
                await examService.getExamById(id);

            return res.status(200).json({
                success: true,
                data: exam
            });

        } catch (error) {

            if (error.message === "Exam not found") {
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

    async createExam(req, res) {
        try {
            const {
                examName,
                examDate,
                maxMarks,
                courseId

            } = req.body;

            const exam =
                await examService.createExam(
                    examName,
                    examDate,
                    maxMarks,
                    courseId
                );
            return res.status(201).json({
                success: true,
                message: "Exam created successfully",
                data: exam
            });
        } catch (error) {
            if (error.message === "Course not found") {
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

    async updateExam(req, res) {

        try {

            const { id } = req.params;

            const {
                examName,
                examDate,
                maxMarks,
                courseId
            } = req.body;

            const exam =
                await examService.updateExam(
                    id,
                    examName,
                    examDate,
                    maxMarks,
                    courseId
                );

            return res.status(200).json({
                success: true,
                message: "Exam updated successfully",
                data: exam
            });

        } catch (error) {

            if (
                error.message === "Exam not found" ||
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

    async deleteExam(req, res) {
        try {
            const { id } = req.params;

            const exam = await examService.deleteExam(id);
            
            return res.status(200).json({
                success: true,
                message: "Exam deleted successfully",
                data: exam
            });
        } catch (error) {
            if (error.message === "Exam not found") {
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

export default new ExamController();