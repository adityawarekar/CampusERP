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

    async getStudentAttendanceSummary() {

        const query = `
        SELECT
            students.id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,

            COUNT(attendance.id) AS total_classes,

            COUNT(
                CASE
                    WHEN attendance.status = 'Present'
                    THEN 1
                END
            ) AS present,

            COUNT(
                CASE
                    WHEN attendance.status = 'Absent'
                    THEN 1
                END
            ) AS absent,

            
            COALESCE(

            (
                COUNT(
                    CASE
                       WHEN attendance.status = 'Present'
                       THEN 1
                    END

                ) * 100.0
                / NULLIF(COUNT(attendance.id), 0)
            ),
            0
            ) AS attendance_percentage

        FROM students

        LEFT JOIN attendance
            ON students.id = attendance.student_id

        GROUP BY
            students.id,
            students.roll_number,
            students.first_name,
            students.last_name

        ORDER BY students.roll_number;
    `;

        const result = await pool.query(query);

        return result.rows;
    }

    async getLowAttendanceStudents() {

        const query = `
        SELECT
            students.id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,

            COUNT(attendance.id) AS total_classes,

            COUNT(
                CASE
                    WHEN attendance.status = 'Present'
                    THEN 1
                END
            ) AS present,

            ROUND(
                (
                    COUNT(
                        CASE
                            WHEN attendance.status = 'Present'
                            THEN 1
                        END
                    ) * 100.0
                    / NULLIF(COUNT(attendance.id), 0)
                ),
                2
            ) AS attendance_percentage

        FROM students

        LEFT JOIN attendance
            ON students.id = attendance.student_id

        GROUP BY
            students.id,
            students.roll_number,
            students.first_name,
            students.last_name

        HAVING
            COUNT(attendance.id) > 0
            AND
            (
                COUNT(
                    CASE
                        WHEN attendance.status = 'Present'
                        THEN 1
                    END
                ) * 100.0
                / COUNT(attendance.id)
            ) < 75

        ORDER BY attendance_percentage;
    `;

        const result = await pool.query(query);

        return result.rows;
    }
}



export default new AttendanceRepository();