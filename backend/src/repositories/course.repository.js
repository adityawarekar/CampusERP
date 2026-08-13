import pool from "../config/db.js";

class CourseRepository {

    async findAll() {

        const query = `
            SELECT
                id,
                name,
                code,
                credits,
                created_at
            FROM courses
            ORDER BY name;
        `;

        const result = await pool.query(query);

        return result.rows;
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