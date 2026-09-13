import pool from "../config/db.js";

class AttendanceRepository {
    async findAll(
        limit,
        offset,
        studentId,
        status,
        sortBy,
        order
    ) {
        const ALLOWED_SORT_COLUMNS = {
            attendanceDate: "attendance.attendance_date",
            status: "attendance.status",
            id: "attendance.id"
        };

        const sortColumn = ALLOWED_SORT_COLUMNS[sortBy] || "attendance.attendance_date";
        const sortOrder = order && order.toString().toUpperCase() === "ASC" ? "ASC" : "DESC";

        const query = `
        SELECT
            attendance.id,
            attendance.attendance_date,
            attendance.status,

            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,

            departments.name AS department

        FROM attendance

        INNER JOIN students
            ON attendance.student_id = students.id

        INNER JOIN departments
            ON students.department_id = departments.id

        WHERE
            (
                $3::integer IS NULL
                OR attendance.student_id = $3::integer
            )
            AND
            (
                $4::text IS NULL
                OR attendance.status = $4::text
            )

        ORDER BY ${sortColumn} ${sortOrder}
        LIMIT $1
        OFFSET $2
    `;

        const result = await pool.query(
            query,
            [limit, offset, studentId, status]
        );

        return result.rows;
    }

    async countAll(studentId, status) {
        const query = `
            SELECT COUNT(*)
            FROM attendance
            INNER JOIN students
                ON attendance.student_id = students.id
            INNER JOIN departments
                ON students.department_id = departments.id
            WHERE
                (
                    $1::integer IS NULL
                    OR attendance.student_id = $1::integer
                )
                AND
                (
                    $2::text IS NULL
                    OR attendance.status = $2::text
                )
        `;

        const result = await pool.query(
            query,
            [studentId, status]
        );

        return parseInt(result.rows[0].count, 10);
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

    async getStudentAttendanceSummary(studentId) {

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

        WHERE students.id = $1

        GROUP BY
            students.id,
            students.roll_number,
            students.first_name,
            students.last_name;
    `;

        const result = await pool.query(
            query,
            [studentId]
        );

        return result.rows[0];
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