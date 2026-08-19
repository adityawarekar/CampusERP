import bookIssueService from "../services/bookIssue.service.js";

class BookIssueController {
    async getAllBookIssues(req, res) {
        try {
            const issues =
                await bookIssueService.getAllBookIssues();

            return res.status(200).json({
                success: true,
                message: "Book issues fetched successfully",
                data: issues
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    async createBookIssue(req, res) {

        try {

            const {
                bookId,
                studentId,
                dueDate
            } = req.body;

            const issue =
                await bookIssueService.createBookIssue(
                    bookId,
                    studentId,
                    dueDate
                );

            return res.status(201).json({
                success: true,
                message: "Book issued successfully",
                data: issue
            });

        } catch (error) {

            if (
                error.message === "Book not found" ||
                error.message === "Student not found"
            ) {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message === "Book is not available" ||
                error.message === "Due date is required"
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

    async returnBook(req, res) {
        try {
            const { id } = req.params;

            const issue =
                await bookIssueService.returnBook(id);

            return res.status(200).json({
                success: true,
                message: "Book returned successfully",
                data: issue
            });
        } catch (error) {
            if (
                error.message ===
                "Book issue not found"
            ) {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Book has already been returned"
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

    async getBookIssueById(req, res) {
        try {
            const { id } = req.params;

            const issue =
                await bookIssueService.getBookIssueById(id);

            return res.status(200).json({
                success: true,
                data: issue
            });
        } catch (error) {
            if (
                error.message ===
                "Book issue not found"
            ) {
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

    async getBookIssuesByStudentId(req, res) {

        console.log(
            "🔥 STUDENT ROUTE HIT:",
            req.params
        );

        try {

            const { studentId } = req.params;

            const issues =
                await bookIssueService.getBookIssuesByStudentId(
                    studentId
                );

            return res.status(200).json({
                success: true,
                message: "Student book issues fetched successfully",
                data: issues
            });

        } catch (error) {

            return res.status(500).json({
                success: false,
                message: error.message
            });

        }
    }



}

export default new BookIssueController();