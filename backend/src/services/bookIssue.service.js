import bookIssueRepository from "../repositories/bookIssue.repository.js";

class BookIssueService {

    async getAllBookIssues(
        page = 1,
        limit = 10,
        studentId = null,
        bookId = null,
        status = null,
        search = null,
        sortBy = null,
        order = null
    ) {

        const offset = (page - 1) * limit;

        const [bookIssues, total] = await Promise.all([
            bookIssueRepository.findAll(
                limit,
                offset,
                studentId,
                bookId,
                status,
                search,
                sortBy,
                order
            ),
            bookIssueRepository.countAll(
                studentId,
                bookId,
                status,
                search
            )
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data: bookIssues,
            pagination: {
                page,
                limit,
                total,
                totalPages
            }
        };
    }

    async createBookIssue(
        bookId,
        studentId,
        dueDate,
    ) {
        if (!dueDate) {
            throw new Error("Due date is required");
        }

        return await bookIssueRepository.createIssue(
            bookId,
            studentId,
            dueDate
        );
    }

    async returnBook(issueId) {
        return await bookIssueRepository.returnBook(
            issueId
        );
    }

    async getBookIssueById(id) {
        const issue =
            await bookIssueRepository.findById(id);

        if (!issue) {
            throw new Error("Book issue not found");
        }

        return issue;
    }

    async getBookIssuesByStudentId(studentId) {

        const issues =
            await bookIssueRepository.findByStudentId(
                studentId
            );

        return issues;
    }

}

export default new BookIssueService();