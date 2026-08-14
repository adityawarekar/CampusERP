import pool from "../config/db.js";

class ExamRepository {

    async findAll() {

        const query = `
            SELECT
                exams.id,
                exams.exam_name,
                exams.exam_date,
                exams.max_marks,

                courses.id AS course_id,
                courses.name AS course_name,
                courses.code AS course_code

            FROM exams

            INNER JOIN courses
                ON exams.course_id = courses.id

            ORDER BY exams.exam_date;
        `;

        const result = await pool.query(query);

        return result.rows;
    }

    async findById(id) {
        const query = `
            SELECT
                 exams.id,
                 exams.exam_name,
                 exams.max_marks,

                 courses.id AS course_id,
                 courses.name AS course_name,
                 courses.code AS course_code

            FROM exams
            
            INNER JOIN courses
               ON exams.course_id = courses.id

            WHERE exams.id = $1;   
           `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

    async findByCourseId(courseId) {

        const query = `
        SELECT id, name, code
        FROM courses
        WHERE id = $1;
    `;

        const result = await pool.query(query, [courseId]);

        return result.rows[0];
    }

    async create(examName, examDate, maxMarks, courseId) {

        const query = `
        INSERT INTO exams (
            exam_name,
            exam_date,
            max_marks,
            course_id
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
            id,
            exam_name,
            exam_date,
            max_marks,
            course_id;
    `;

        const result = await pool.query(query, [
            examName,
            examDate,
            maxMarks,
            courseId
        ]);

        return result.rows[0];
    }

    async update(id, examName, examDate, maxMarks, courseId) {

        const query = `
        UPDATE exams
        SET
            exam_name = $2,
            exam_date = $3,
            max_marks = $4,
            course_id = $5
        WHERE id = $1
        RETURNING
            id,
            exam_name,
            exam_date,
            max_marks,
            course_id;
    `;

        const result = await pool.query(query, [
            id,
            examName,
            examDate,
            maxMarks,
            courseId
        ]);

        return result.rows[0];
    }

    async delete(id) {

        const query = `
        DELETE FROM exams
        WHERE id = $1
        RETURNING
            id,
            exam_name,
            exam_date,
            max_marks,
            course_id;
    `;

        const result = await pool.query(query, [id]);

        return result.rows[0];
    }

}

export default new ExamRepository();