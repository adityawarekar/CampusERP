import pool from "../config/db.js";

class EnrollmentRepository {

    async enrollStudent(studentId, courseId) {

        const client = await pool.connect();

        try {

            await client.query("BEGIN");

            const studentResult = await client.query(
                `SELECT id FROM students WHERE id = $1`,
                [studentId]
            );

            if (studentResult.rows.length === 0) {
                throw new Error("Student not found");
            }

            const courseResult = await client.query(
                `SELECT id FROM courses WHERE id = $1`,
                [courseId]
            );

            if (courseResult.rows.length === 0) {
                throw new Error("Course not found");
            }

            const enrollmentResult = await client.query(
                `
                INSERT INTO enrollments (student_id, course_id)
                VALUES ($1, $2)
                RETURNING id, student_id, course_id, enrolled_at;
                `,
                [studentId, courseId]
            );

            await client.query("COMMIT");

            return enrollmentResult.rows[0];

        } catch (error) {

            await client.query("ROLLBACK");

            throw error;

        } finally {

            client.release();

        }
    }

    async findAll() {

        const query = `
        SELECT
            enrollments.id,

            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,

            courses.id AS course_id,
            courses.name AS course_name,
            courses.code AS course_code,
            courses.credits,

            enrollments.enrolled_at

        FROM enrollments

        INNER JOIN students
            ON enrollments.student_id = students.id

        INNER JOIN courses
            ON enrollments.course_id = courses.id

        ORDER BY enrollments.enrolled_at DESC;
    `;

        const result = await pool.query(query);

        return result.rows;
    }

    async findAllByUserId(userId) {

        const query = `
        SELECT
            enrollments.id,

            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,

            courses.id AS course_id,
            courses.name AS course_name,
            courses.code AS course_code,
            courses.credits,

            enrollments.enrolled_at

        FROM enrollments

        INNER JOIN students
            ON enrollments.student_id = students.id

        INNER JOIN courses
            ON enrollments.course_id = courses.id

        WHERE students.user_id = $1

        ORDER BY enrollments.enrolled_at DESC;
    `;

        const result = await pool.query(
            query,
            [userId]
        );

        return result.rows;
    }



    async findById(id) {

        const query = `
        SELECT
            enrollments.id,

            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,

            courses.id AS course_id,
            courses.name AS course_name,
            courses.code AS course_code,
            courses.credits,

            enrollments.enrolled_at

        FROM enrollments

        INNER JOIN students
            ON enrollments.student_id = students.id

        INNER JOIN courses
            ON enrollments.course_id = courses.id

        WHERE enrollments.id = $1;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async delete(id) {
        const query = `
            DELETE FROM enrollments
            WHERE id = $1
            RETURNING
               id, 
               student_id,
               course_id,
               enrolled_at;
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

}

export default new EnrollmentRepository();