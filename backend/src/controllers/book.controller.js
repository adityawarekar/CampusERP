import bookService from "../services/book.service.js";

class BookController {
    async getAllBooks(req, res) {
        try {
            const books =
                await bookService.getAllBooks();

            return res.status(200).json({
                success: true,
                message: "Books fetched successfully",
                data: books
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }

    }

    async createBook(req, res) {
        try {
            const {
                title,
                author,
                isbn,
                totalCopies
            } = req.body;

            const book =
                await bookService.createBook(
                    title,
                    author,
                    isbn,
                    totalCopies
                );
            return res.status(201).json({
                success: true,
                message: "Book created successfully",
                data: book
            });

        } catch (error) {
            if (
                error.message ===
                "Title and author are required"
            ) {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Total copies must be greater than zero" ||
                error.message ===
                "Book with this ISBN already exists"
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

    async getBookById(req, res) {
        try {
            const { id } = req.params;

            const book =
                await bookService.getBookById(id);

            return res.status(200).json({
                success: true,
                data: book
            });
        } catch (error) {
            if (error.message === "Book not found") {
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

    async updateBook(req, res) {

        try {

            const { id } = req.params;

            const {
                title,
                author,
                isbn,
                totalCopies
            } = req.body;

            const book =
                await bookService.updateBook(
                    id,
                    title,
                    author,
                    isbn,
                    totalCopies
                );

            return res.status(200).json({
                success: true,
                message: "Book updated successfully",
                data: book
            });

        } catch (error) {

            if (error.message === "Book not found") {

                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (
                error.message ===
                "Title and author are required" ||
                error.message ===
                "Total copies must be greater than zero" ||
                error.message ===
                "Total copies cannot be less than issued copies" ||
                error.message ===
                "Book with this ISBN already exists"
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

    async deleteBook(req, res) {

    try {

        const { id } = req.params;

        const book =
            await bookService.deleteBook(id);

        return res.status(200).json({
            success: true,
            message: "Book deleted successfully",
            data: book
        });

    } catch (error) {

        if (error.message === "Book not found") {

            return res.status(404).json({
                success: false,
                message: error.message
            });
        }

        if (
            error.message ===
            "Cannot delete book while copies are issued"
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
}

export default new BookController();