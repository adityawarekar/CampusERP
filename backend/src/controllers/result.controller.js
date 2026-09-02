import resultService from "../services/result.service.js";

class ResultController {

    async getAllResults(req, res) {

        try {

            const results =
                await resultService.getAllResults(
                    req.user.id,
                    req.user.role
                );

            return res.status(200).json({
                success: true,
                message: "Results fetched successfully",
                data: results
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }

    async getResultById(req, res) {

        try {

            const { id } = req.params;

            const result =
                await resultService.getResultById(id);

            return res.status(200).json({
                success: true,
                data: result
            });

        } catch (error) {

            if (error.message === "Result not found") {

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

    async createResult(req, res) {

        try {

            const {
                studentId,
                examId,
                marksObtained
            } = req.body;

            const result =
                await resultService.createResult(
                    studentId,
                    examId,
                    marksObtained
                );

            return res.status(201).json({
                success: true,
                message: "Result created successfully",
                data: result
            });

        } catch (error) {

            if (
                error.message === "Student not found" ||
                error.message === "Exam not found" ||
                error.message ===
                "Student is not enrolled in this course"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message === "Marks cannot be negative" ||
                error.message ===
                "Marks cannot exceed maximum marks" ||
                error.message ===
                "Result already exists for this student"
            ) {
                return res.status(400).json({
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

    async updateResult(req, res) {

        try {

            const { id } = req.params;
            const { marksObtained } = req.body;

            const result =
                await resultService.updateResult(
                    id,
                    marksObtained
                );

            return res.status(200).json({
                success: true,
                message: "Result updated successfully",
                data: result
            });

        } catch (error) {

            if (error.message === "Result not found") {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message === "Marks cannot be negative" ||
                error.message ===
                "Marks cannot exceed maximum marks"
            ) {

                return res.status(400).json({
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

    async deleteResult(req, res) {

        try {

            const { id } = req.params;

            const result =
                await resultService.deleteResult(id);

            return res.status(200).json({
                success: true,
                message: "Result deleted successfully",
                data: result
            });

        } catch (error) {

            if (error.message === "Result not found") {

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

export default new ResultController();