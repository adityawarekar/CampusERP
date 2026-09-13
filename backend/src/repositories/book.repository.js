import pool from "../config/db.js";

class BookRepository {

    async findAll(
        limit,
        offset,
        search,
        sortBy,
        order
    ) {
        const ALLOWED_SORT_COLUMNS = {
            id: "books.id",
            title: "books.title",
            author: "books.author",
            totalCopies: "books.total_copies",
            availableCopies: "books.available_copies",
            createdAt: "books.created_at"
        };

        const sortColumn = ALLOWED_SORT_COLUMNS[sortBy] || "books.id";
        const sortOrder = order && order.toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

        const query = `
        SELECT
            id,
            title,
            author,
            isbn,
            total_copies,
            available_copies,
            created_at,
            updated_at
        FROM books
        WHERE
            (
                $3::text IS NULL
                OR title ILIKE '%' || $3::text || '%'
                OR author ILIKE '%' || $3::text || '%'
            )
        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT $1
        OFFSET $2
    `;

        const result = await pool.query(
            query,
            [limit, offset, search]
        );

        return result.rows;
    }

    async countAll(search) {
        const query = `
            SELECT COUNT(*)
            FROM books
            WHERE
                (
                    $1::text IS NULL
                    OR title ILIKE '%' || $1::text || '%'
                    OR author ILIKE '%' || $1::text || '%'
                )
        `;

        const result = await pool.query(query, [search]);
        return parseInt(result.rows[0].count, 10);
    }

    async create(
        title,
        author,
        isbn,
        totalCopies
    ) {
        const query = `
           INSERT INTO books (
                title,
                author,
                isbn,
                total_copies,
                available_copies
           )
           VALUES ($1, $2, $3, $4, $4)
           RETURNING
               id,
               title,
               author,
               isbn,
               total_copies,
               available_copies,
               created_at;     
        `;

        const result = await pool.query(query, [
            title,
            author,
            isbn,
            totalCopies
        ]);

        return result.rows[0];
    }

    async findByIsbn(isbn) {
        const query = `
           SELECT id
           FROM books
           WHERE isbn = $1;
        `;

        const result = await pool.query(query, [isbn]);

        return result.rows[0];
    }

    async findById(id) {
        const query = `
            SELECT
                id,
                title,
                author,
                isbn,
                total_copies,
                available_copies,
                created_at,
                updated_at
            FROM books
            WHERE id = $1;      
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async update(
        id,
        title,
        author,
        isbn,
        totalCopies,
        availableCopies
    ) {

        const query = `
        UPDATE books
        SET
            title = $2,
            author = $3,
            isbn = $4,
            total_copies = $5,
            available_copies = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        RETURNING
            id,
            title,
            author,
            isbn,
            total_copies,
            available_copies,
            created_at,
            updated_at;
    `;

        const result = await pool.query(query, [
            id,
            title,
            author,
            isbn,
            totalCopies,
            availableCopies
        ]);

        return result.rows[0];
    }

    async delete(id) {

        const query = `
        DELETE FROM books
        WHERE id = $1
        RETURNING
            id,
            title,
            author,
            isbn,
            total_copies,
            available_copies;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

}

export default new BookRepository();