import pool from "../config/db.js";

class CourseRepository {

    async findAll(limit, offset, search, sortBy, order) {
        const ALLOWED_SORT_COLUMNS = {
            name: "courses.name",
            code: "courses.code",
            credits: "courses.credits",
            createdAt: "courses.created_at"
        };

        const sortColumn = ALLOWED_SORT_COLUMNS[sortBy] || "courses.name";
        const sortOrder = order && order.toString().toUpperCase() === "DESC" ? "DESC" : "ASC";

        const query = `
        SELECT
            id,
            name,
            code,
            credits,
            created_at
        FROM courses
        WHERE
            (
                $3::text IS NULL
                OR name ILIKE '%' || $3::text || '%'
                OR code ILIKE '%' || $3::text || '%'
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
            FROM courses
            WHERE
                (
                    $1::text IS NULL
                    OR name ILIKE '%' || $1::text || '%'
                    OR code ILIKE '%' || $1::text || '%'
                )
        `;

        const result = await pool.query(query, [search]);
        return parseInt(result.rows[0].count, 10);
    }

    async findById(id) {

        const query = `
        SELECT
            id,
            name,
            code,
            credits,
            created_at
        FROM courses
        WHERE id = $1;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async findByCode(code) {
        const query = `
            SELECT id, name, code, credits
            FROM courses
            WHERE code = $1;
        `;

        const result = await pool.query(query, [code]);

        return result.rows[0];
    }
    async create(name, code, credits) {
        const query = `
            INSERT INTO courses (name, code, credits)
            VALUES ($1, $2, $3)
            RETURNING id, name, code, credits;
        `;

        const result = await pool.query(query, [
            name,
            code,
            credits
        ]);

        return result.rows[0];
    }

    async update(id, name, code, credits) {
        const query = `
           UPDATE courses
           SET
              name = $2,
              code = $3,
              credits = $4
           WHERE id = $1
           RETURNING id, name, code, credits;   
           
        `;
        const result = await pool.query(query, [
            id,
            name,
            code,
            credits
        ]);


        return result.rows[0];
    }

    async findByCodeExceptId(code, id) {

        const query = `
        SELECT id, name, code, credits
        FROM courses
        WHERE code = $1
        AND id != $2;
    `;

        const result = await pool.query(query, [
            code,
            id
        ]);

        return result.rows[0];
    }

    async delete(id) {
        const query = `
           DELETE FROM courses
           WHERE id = $1
           RETURNING id, name, code, credits; 
         `;

         const result = await pool.query(query, [id]);

         return result.rows[0];
    }
}

export default new CourseRepository();