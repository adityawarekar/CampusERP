import bookRepository from "../repositories/book.repository.js";

class BookService {
    async getAllBooks() {
        return await bookRepository.findAll();
    }

    async createBook(
        title,
        author,
        isbn,
        totalCopies
    ) {
        if (!title || !author) {
            throw new Error(
                "Title and author are required"
            );
        }

        if (totalCopies <= 0) {
            throw new Error(
                "Totel copies must be greater then zero"
            );
        }

        if (isbn) {
            const existingBook =
                await bookRepository.findByIsbn(isbn);

            if (existingBook) {
                throw new Error(
                    "Book with this ISBN already exists"
                );
            }
        }
        return await bookRepository.create(
            title,
            author,
            isbn,
            totalCopies
        );
    }

    async getBookById(id) {
        const book =
            await bookRepository.findById(id);

        if (!book) {
            throw new Error("Book not found");
        }

        return book;
    }

    async updateBook(
        id,
        title,
        author,
        isbn,
        totalCopies
    ) {
        const book =
            await bookRepository.findById(id);

        if (!book) {
            throw new Error("Book not found");
        }

        if (!title || !author) {
            throw new Error(
                "Title and author are required"
            );
        }

        if (totalCopies <= 0) {
            throw new Error(
                "Total copies muist be greater than zero"
            );
        }

        const issuedCopies =
            book.total_copies -
            book.available_copies;

        if (totalCopies < issuedCopies) {
            throw new Error(
                "Total copies cannot be less than issued copies"
            );
        }

        if (isbn && isbn !== book.isbn) {
            const existingBook =
                await bookRepository.findByIsbn(isbn);

            if (
                existingBook &&
                existingBook.id !== Number(id)
            ) {
                throw new Error(
                    "Book with this ISBN alreday exists"
                );
            }
        }

        const newAvailableCopies =
            totalCopies - issuedCopies;

        return await bookRepository.update(
            id,
            title,
            author,
            isbn,
            totalCopies,
            newAvailableCopies
        );
    }

    async deleteBook(id) {

    const book =
        await bookRepository.findById(id);

    if (!book) {
        throw new Error("Book not found");
    }

    const issuedCopies =
        book.total_copies -
        book.available_copies;

    if (issuedCopies > 0) {
        throw new Error(
            "Cannot delete book while copies are issued"
        );
    }

    return await bookRepository.delete(id);
}

}

export default new BookService();