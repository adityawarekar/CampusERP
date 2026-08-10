import pool from "../config/db.js";

class AttendanceRepository {
    async findAll() {
        const query = `
            SELECT
                 attendance.id,
                 attendance.attendance_date,
                 attendance.status,
                 students.roll_number,
                 students.first_name || ' ' || students.last_name AS student_name,
                 departments.name AS department
            FROM attendance
            INNER JOIN students
                ON attendance.student_id = students.id
            INNER JOIN departments
                ON students.department_id = departments.id    
            ORDER BY attendance.attendance_date DESC;       
          `;

          const result = await pool.query(query);

          return result.rows;
    }

    async findById(id) {

    const query = `
        SELECT
            attendance.id,
            attendance.attendance_date,
            attendance.status,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,
            departments.name AS department
        FROM attendance
        INNER JOIN students
            ON attendance.student_id = students.id
        INNER JOIN departments
            ON students.department_id = departments.id
        WHERE attendance.id = $1;
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
}
}



export default new AttendanceRepository();