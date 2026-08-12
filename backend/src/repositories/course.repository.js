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
}

export default new CourseRepository();