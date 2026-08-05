import pool from "../config/db.js";

class StudentRepository {

    async findAll() {

        const query = `
            SELECT
                students.id,
                students.roll_number,
                students.first_name || ' ' || students.last_name AS name, 
                students.email,
                departments.name AS department
            FROM students
            INNER JOIN departments
            ON students.department_id = departments.id
            ORDER BY students.roll_number;
        `;

        const result = await pool.query(query);

        return result.rows;
    }

}

export default new StudentRepository();