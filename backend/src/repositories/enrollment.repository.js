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
}

export default new EnrollmentRepository();