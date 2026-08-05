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

    async create(name, code) {
        const query = `
            INSERT INTO departments(name, code)
            VALUES($1, $2)
            RETURNING id, name, code;
        
        `;

        const result = await pool.query(query, [name, code]);
    }

    async findByCode(code) {
        const query = `
            SELECT id, name code
            FROM departments
            WHERE code = $1;
        `;

        const result = await pool.query(query, [code]);

        return result.rows[0];
    }

    async update(id, name, code) {
        const query = `
            UPDATE departments
            SET name = $2,
                code = $3
            WHERE id = $1
            RETURNING id, name, code;
        `;

        const result = await pool.query(query, [id, name, code]);

        return result.rows[0]
    }

    async delete(id) {
        const query = `
           DELETE FROM departments
           WHERE id = $1
           RETURNING id, name, code;

        `;

        const result = await pool.query(query, [id]);

        return result.rows[0]
    }
}

export default new DepartmentRepository();