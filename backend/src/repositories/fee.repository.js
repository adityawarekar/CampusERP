import pool from "../config/db.js";

class FeeRepository {

    async findAll() {

        const query = `
            SELECT
                fee_records.id,
                students.id AS student_id,
                students.roll_number,
                students.first_name || ' ' || students.last_name AS student_name,
                fee_records.total_amount,
                fee_records.amount_paid,
                fee_records.total_amount - fee_records.amount_paid AS remaining_amount,
                fee_records.due_date,
                fee_records.status
            FROM fee_records
            INNER JOIN students
                ON fee_records.student_id = students.id
            ORDER BY fee_records.id;
        `;

        const result = await pool.query(query);

        return result.rows;
    }

    async findById(id) {

        const query = `
        SELECT
            fee_records.id,
            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,
            fee_records.total_amount,
            fee_records.amount_paid,
            fee_records.total_amount - fee_records.amount_paid AS remaining_amount,
            fee_records.due_date,
            fee_records.status
        FROM fee_records
        INNER JOIN students
            ON fee_records.student_id = students.id
        WHERE fee_records.id = $1;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async findStudentById(studentId) {
        const query = `
            SELECT Id
            FROM students
            WHERE id = $1;   
         `;

        const result = await pool.query(query, [studentId]);
        

        return result.rows[0];
    }

    async findByStudentId(studentId) {
        const query = `
           SELECT id
           FROM fee_records
           WHERE student_id = $1; 
        `;

        const result = await pool.query(query, [studentId]);

        return result.rows[0];
    }

    async create(
        studentId,
        totalAmount,
        dueDate
    ) {
        const query = `
          INSERT INTO fee_records (
              student_id,
              total_amount,
              due_date
          )
           VALUES ($1, $2, $3)
           RETURNING
               id,
               student_id,
               total_amount,
               amount_paid,
               due_date,
               status,
               created_at;    
        `;

        const result = await pool.query(query, [
            studentId,
            totalAmount,
            dueDate
        ]);
        return result.rows[0];
    }

}

export default new FeeRepository();