import examService from "../services/exam.service.js";

class ExamController {

    async getAllExams(req, res) {

        try {
            const page = 
               parseInt(req.query.page) || 1;
            const limit = 
               parseInt(req.query.limit) || 10;
            const courseId = 
                req.query.courseId
                   ? parseInt(req.query.courseId)
                   : null;
            const search = 
                req.query.search || null;            

            const sortBy = req.query.sortBy || null;
            const order = req.query.order || null;

            const result =
                await examService.getAllExams(
                    page,
                    limit,
                    courseId,
                    search,
                    sortBy,
                    order
                );

            return res.status(200).json({
                success: true,
                message: "Exams fetched successfully",
                data: result.data,
                pagination: result.pagination
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