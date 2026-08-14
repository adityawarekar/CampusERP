import pool from "../config/db.js";

class ResultRepository {

    async findAll() {

        const query = `
            SELECT
                results.id,

                students.id AS student_id,
                students.roll_number,
                students.first_name || ' ' || students.last_name AS student_name,

                exams.id AS exam_id,
                exams.exam_name,
                exams.exam_date,
                exams.max_marks,

                courses.id AS course_id,
                courses.name AS course_name,
                courses.code AS course_code,

                results.marks_obtained

            FROM results

            INNER JOIN students
                ON results.student_id = students.id

            INNER JOIN exams
                ON results.exam_id = exams.id

            INNER JOIN courses
                ON exams.course_id = courses.id

            ORDER BY results.id;
        `;

        const result = await pool.query(query);

        return result.rows;
    }

    async findById(id) {

        const query = `
        SELECT
            results.id,
            students.id AS student_id,
            students.roll_number,
            students.first_name || ' ' || students.last_name AS student_name,

            exams.id AS exam_id,
            exams.exam_name,
            exams.exam_date,
            exams.max_marks,

            courses.id AS course_id,
            courses.name AS course_name,
            courses.code AS course_code,

            results.marks_obtained

        FROM results

        INNER JOIN students
            ON results.student_id = students.id

        INNER JOIN exams
            ON results.exam_id = exams.id

        INNER JOIN courses
            ON exams.course_id = courses.id

        WHERE results.id = $1;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async findStudentById(studentId) {

        const query = `
        SELECT id
        FROM students
        WHERE id = $1;
    `;

        const result = await pool.query(query, [studentId]);

        return result.rows[0];
    }

    async findExamById(examId) {

        const query = `
        SELECT
            id,
            course_id,
            max_marks
        FROM exams
        WHERE id = $1;
    `;

        const result = await pool.query(query, [examId]);

        return result.rows[0];
    }

    async findEnrollment(studentId, courseId) {

        const query = `
        SELECT id
        FROM enrollments
        WHERE student_id = $1
        AND course_id = $2;
    `;

        const result = await pool.query(query, [
            studentId,
            courseId
        ]);

        return result.rows[0];
    }

    async findByStudentAndExam(studentId, examId) {

        const query = `
        SELECT id
        FROM results
        WHERE student_id = $1
        AND exam_id = $2;
    `;

        const result = await pool.query(query, [
            studentId,
            examId
        ]);

        return result.rows[0];
    }

    async create(studentId, examId, marksObtained) {

        const query = `
        INSERT INTO results (
            student_id,
            exam_id,
            marks_obtained
        )
        VALUES ($1, $2, $3)
        RETURNING
            id,
            student_id,
            exam_id,
            marks_obtained,
            created_at;
    `;

        const result = await pool.query(query, [
            studentId,
            examId,
            marksObtained
        ]);

        return result.rows[0];
    }

    async update(id, marksObtained) {

        const query = `
        UPDATE results
        SET marks_obtained = $2
        WHERE id = $1
        RETURNING
            id,
            student_id,
            exam_id,
            marks_obtained;
    `;

        const result = await pool.query(query, [
            id,
            marksObtained
        ]);

        return result.rows[0];
    }

    async delete(id) {
        const query = `
            DELETE FROM results
            WHERE id = $1
            RETURNING
               id,
               student_id,
               exam_id,
               marks_obtained;
        `;

        const result = await pool.query(query, [id]);

        return result.rows[0];

    }

}

export default new ResultRepository();