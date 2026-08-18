import pool from "../config/db.js";

class BookRepository {

    async findAll() {

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
            ORDER BY id;
        `;

        const result = await pool.query(query);

        return result.rows;
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