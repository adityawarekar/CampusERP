import pool from "../config/db.js";

class BookIssueRepository {

    async findAll(
        limit,
        offset,
        studentId,
        bookId,
        status,
        search,
        sortBy,
        order
    ) {
        const ALLOWED_SORT_COLUMNS = {
            id: "book_issues.id",
            issueDate: "book_issues.issue_date",
            dueDate: "book_issues.due_date",
            returnDate: "book_issues.return_date",
            status: "book_issues.status"
        };

        const sortColumn = ALLOWED_SORT_COLUMNS[sortBy] || "book_issues.id";
        const sortOrder = order && order.toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

        const query = `
        SELECT
            book_issues.id,
            book_issues.book_id,
            books.title AS book_title,
            book_issues.student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name
                AS student_name,
            book_issues.issue_date,
            book_issues.due_date,
            book_issues.return_date,
            book_issues.status
        FROM book_issues

        INNER JOIN books
            ON book_issues.book_id = books.id

        INNER JOIN students
            ON book_issues.student_id = students.id

        WHERE
            ($3::integer IS NULL
                OR book_issues.student_id = $3::integer)

            AND

            ($4::integer IS NULL
                OR book_issues.book_id = $4::integer)

            AND

            ($5::text IS NULL
                OR book_issues.status = $5::text)

            AND

            (
                $6::text IS NULL
                OR books.title ILIKE '%' || $6::text || '%'
                OR students.first_name || ' ' || students.last_name
                    ILIKE '%' || $6::text || '%'
            )

        ORDER BY ${sortColumn} ${sortOrder}

        LIMIT $1
        OFFSET $2;
    `;

        const result = await pool.query(
            query,
            [
                limit,
                offset,
                studentId,
                bookId,
                status,
                search
            ]
        );

        return result.rows;
    }

    async countAll(studentId, bookId, status, search) {
        const query = `
            SELECT COUNT(*)
            FROM book_issues
            INNER JOIN books
                ON book_issues.book_id = books.id
            INNER JOIN students
                ON book_issues.student_id = students.id
            WHERE
                ($1::integer IS NULL OR book_issues.student_id = $1::integer)
                AND
                ($2::integer IS NULL OR book_issues.book_id = $2::integer)
                AND
                ($3::text IS NULL OR book_issues.status = $3::text)
                AND
                (
                    $4::text IS NULL
                    OR books.title ILIKE '%' || $4::text || '%'
                    OR students.first_name || ' ' || students.last_name
                        ILIKE '%' || $4::text || '%'
                )
        `;

        const result = await pool.query(
            query,
            [studentId, bookId, status, search]
        );

        return parseInt(result.rows[0].count, 10);
    }

    async createIssue(
        bookId,
        studentId,
        dueDate
    ) {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");


            const bookResult = await client.query(
                `
                SELECT
                    id,
                    total_copies,
                    available_copies
                FROM books
                WHERE id = $1
                FOR UPDATE;
                `,
                [bookId]
            );


            if (bookResult.rows.length === 0) {
                throw new Error("Book not found");
            }

            const book = bookResult.rows[0];


            if (book.available_copies <= 0) {
                throw new Error(
                    "Book is not available"
                );
            }


            const studentResult = await client.query(
                `
                SELECT id
                FROM students
                WHERE id = $1;
                `,
                [studentId]
            );

            if (studentResult.rows.length === 0) {
                throw new Error("Student not found");
            }


            const issueResult = await client.query(
                `
                INSERT INTO book_issues (
                    book_id,
                    student_id,
                    due_date
                )
                VALUES ($1, $2, $3)
                RETURNING
                    id,
                    book_id,
                    student_id,
                    issue_date,
                    due_date,
                    return_date,
                    status;
                `,
                [
                    bookId,
                    studentId,
                    dueDate
                ]
            );


            await client.query(
                `
                UPDATE books
                SET
                    available_copies =
                        available_copies - 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = $1;
                `,
                [bookId]
            );


            await client.query("COMMIT");

            return issueResult.rows[0];

        } catch (error) {


            await client.query("ROLLBACK");

            throw error;

        } finally {

            client.release();
        }
    }

    async returnBook(issueId) {
        const client = await pool.connect();

        try {
            await client.query("BEGIN");

            const issueResult = await client.query(
                `
                SELECT
                    id,
                    book_id,
                    status
                FROM book_issues
                WHERE ID = $1
                FOR UPDATE;    
                `,
                [issueId]
            );

            if (issueResult.rows.length === 0) {
                throw new Error("Book issue not found");
            }

            const issue = issueResult.rows[0];

            if (issue.status === "Returned") {
                throw new Error(
                    "Book has already been returned"
                );
            }

            const updateIssueResult = await client.query(
                `
                UPDATE book_issues
                SET
                   return_date = CURRENT_DATE,
                   status = 'Returned'
                WHERE id = $1
                RETURNING
                    id,
                    book_id,
                    student_id,
                    issue_date,
                    due_date,
                    return_date,
                    status;   
                
                `,
                [issueId]
            );

            await client.query(
                `
                UPDATE books
                SET
                   available_copies = 
                      available_copies + 1,
                    updated_at = CURRENT_TIMESTAMP
                WHERE Id = $1;      
                
                `,
                [issue.book_id]
            );
            await client.query("COMMIT");

            return updateIssueResult.rows[0];
        } catch (error) {
            await client.query("ROLLBACK");

            throw error;
        } finally {
            client.release();
        }
    }

    async findById(id) {
        const query = ` 
           SELECT
               book_issues.id,
               book_issues.book_id,
               books.title AS book_title,
               books.isbn,

               book_issues.student_id,
               students.roll_number,
               students.first_name || ' ' || students.last_name
                    AS student_name,
                
                book_issues.issue_date,
                book_issues.due_date,
                book_issues.return_date,
                book_issues.status
            
            FROM book_issues
            
            INNER JOIN books
               ON book_issues.book_id = books.id
              
            INNER JOIN students
               ON book_issues.student_id = students.id
            
            WHERE book_issues.id = $1;   
         
        `;
        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async findByStudentId(studentId) {

        const query = `
        SELECT
            book_issues.id,
            book_issues.book_id,
            books.title AS book_title,
            books.isbn,

            book_issues.student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name
                AS student_name,

            book_issues.issue_date,
            book_issues.due_date,
            book_issues.return_date,
            book_issues.status

        FROM book_issues

        INNER JOIN books
            ON book_issues.book_id = books.id

        INNER JOIN students
            ON book_issues.student_id = students.id

        WHERE book_issues.student_id = $1

        ORDER BY book_issues.issue_date DESC;
    `;

        const result = await pool.query(
            query,
            [studentId]
        );

        return result.rows;
    }


}

export default new BookIssueRepository();