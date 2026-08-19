import bookIssueRepository from "../repositories/bookIssue.repository.js";

class BookIssueService {

    async getAllBookIssues() {

        return await bookIssueRepository.findAll();

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