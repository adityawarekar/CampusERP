import pool from "../config/db.js";

class DepartmentRepository {
    async findAll() {
        const query = `
          SELECT id, name, code
          FROM departments
          ORDER BY name;
        `;

        const result = await pool.query(query);

        return result.rows;
    }

    async findById(id) {
        const query = `
            SELECT id, name, code
            FROM departments
            WHERE id = $1;
        `;
        const result = await pool.query(query, [id]);

        return result.rows[0];

    }
}

export default new DepartmentRepository();