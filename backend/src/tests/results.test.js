import request from "supertest";
import app from "../app.js";

import { closeDB } from "../config/db.js";
import pool from "../config/db.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";


describe("Results API", () => {


    const STUDENT_ID = 2;



    const findAvailableCombination = async (studentId = null) => {

        let query = `
            SELECT
                e.student_id,
                e.course_id,
                ex.id AS exam_id,
                ex.max_marks
            FROM enrollments e
            INNER JOIN exams ex
                ON ex.course_id = e.course_id
            WHERE NOT EXISTS (
                SELECT 1
                FROM results r
                WHERE r.student_id = e.student_id
                AND r.exam_id = ex.id
            )
        `;

        const values = [];

        if (studentId !== null) {
            query += ` AND e.student_id = $1`;
            values.push(studentId);
        }

        query += ` LIMIT 1`;

        const result = await pool.query(query, values);

        return result.rows[0] || null;
    };



    const createTemporaryResult = async (studentId = null) => {

        const combination = await findAvailableCombination(studentId);

        if (!combination) {
            throw new Error(
                `No available student/exam combination found for student ${studentId}`
            );
        }

        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${await getAdminToken()}`
            )
            .send({
                studentId: Number(combination.student_id),
                examId: Number(combination.exam_id),
                marksObtained: 40
            });

        if (response.statusCode !== 201) {
            throw new Error(
                `Failed to create temporary result. Status: ${response.statusCode}`
            );
        }

        return {
            resultId: response.body.data.id,
            studentId: Number(combination.student_id),
            examId: Number(combination.exam_id),
            maxMarks: Number(combination.max_marks)
        };
    };



    test("should return all results for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);
    });


    test("should return all results for admin", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);
    });


    test("should reject results request without authentication", async () => {

        const response = await request(app)
            .get("/results");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });




    test("should allow student to access their own result", async () => {

        const token = await getStudentToken();

        let resultId;
        let createdTemporarily = false;

        // Find an existing result belonging to student 2.
        const existingResult = await pool.query(
            `
            SELECT id
            FROM results
            WHERE student_id = $1
            LIMIT 1;
            `,
            [STUDENT_ID]
        );

        if (existingResult.rows.length > 0) {

            resultId = existingResult.rows[0].id;

        } else {

            const temporaryResult =
                await createTemporaryResult(STUDENT_ID);

            resultId = temporaryResult.resultId;
            createdTemporarily = true;
        }


        const response = await request(app)
            .get(`/results/${resultId}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.id).toBe(resultId);


        if (createdTemporarily) {
            await pool.query(
                `DELETE FROM results WHERE id = $1`,
                [resultId]
            );
        }
    });


    test("should reject student from accessing another student's result", async () => {

        const token = await getStudentToken();

        let resultId;
        let createdTemporarily = false;

        // Find a result belonging to another student.
        const existingResult = await pool.query(
            `
            SELECT id
            FROM results
            WHERE student_id != $1
            LIMIT 1;
            `,
            [STUDENT_ID]
        );

        if (existingResult.rows.length > 0) {

            resultId = existingResult.rows[0].id;

        } else {

            // Find an available combination for another student.
            const combination = await pool.query(
                `
                SELECT
                    e.student_id,
                    ex.id AS exam_id
                FROM enrollments e
                INNER JOIN exams ex
                    ON ex.course_id = e.course_id
                WHERE e.student_id != $1
                AND NOT EXISTS (
                    SELECT 1
                    FROM results r
                    WHERE r.student_id = e.student_id
                    AND r.exam_id = ex.id
                )
                LIMIT 1;
                `,
                [STUDENT_ID]
            );

            expect(combination.rows.length).toBeGreaterThan(0);

            const row = combination.rows[0];

            const createResponse = await request(app)
                .post("/results")
                .set(
                    "Authorization",
                    `Bearer ${await getAdminToken()}`
                )
                .send({
                    studentId: Number(row.student_id),
                    examId: Number(row.exam_id),
                    marksObtained: 40
                });

            expect(createResponse.statusCode).toBe(201);

            resultId = createResponse.body.data.id;
            createdTemporarily = true;
        }


        const response = await request(app)
            .get(`/results/${resultId}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(false);


        if (createdTemporarily) {
            await pool.query(
                `DELETE FROM results WHERE id = $1`,
                [resultId]
            );
        }
    });


    test("should return 404 for non-existent result", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/results/999999")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);
    });



    test("should reject student from creating a result", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                studentId: STUDENT_ID,
                examId: 1,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated result creation", async () => {

        const response = await request(app)
            .post("/results")
            .send({
                studentId: STUDENT_ID,
                examId: 1,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });


    test("should allow admin to create a result", async () => {

        const token = await getAdminToken();

        const availableCombination =
            await findAvailableCombination();

        expect(availableCombination).not.toBeNull();

        const {
            student_id,
            exam_id
        } = availableCombination;


        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                studentId: Number(student_id),
                examId: Number(exam_id),
                marksObtained: 40
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);


        // Cleanup
        await pool.query(
            `DELETE FROM results WHERE id = $1`,
            [response.body.data.id]
        );
    });


    test("should reject invalid result data", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                studentId: STUDENT_ID,
                examId: 1,
                marksObtained: -10
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
    });


    test("should return 404 when creating result for non-existent student", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                studentId: 999999,
                examId: 1,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);
    });


    test("should return 404 when creating result for non-existent exam", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                studentId: STUDENT_ID,
                examId: 999999,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);
    });



    test("should allow admin to update an existing result", async () => {

        const token = await getAdminToken();

        const temporaryResult =
            await createTemporaryResult();

        const response = await request(app)
            .put(`/results/${temporaryResult.resultId}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                marksObtained: 45
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data.marks_obtained).toBe(45);



        await pool.query(
            `DELETE FROM results WHERE id = $1`,
            [temporaryResult.resultId]
        );
    });


    test("should reject student from updating a result", async () => {

        const token = await getStudentToken();

        const temporaryResult =
            await createTemporaryResult();


        const response = await request(app)
            .put(`/results/${temporaryResult.resultId}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                marksObtained: 45
            });

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(false);



        await pool.query(
            `DELETE FROM results WHERE id = $1`,
            [temporaryResult.resultId]
        );
    });


    test("should return 404 when updating a non-existent result", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .put("/results/999999")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                marksObtained: 45
            });

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);
    });




    test("should reject student from deleting a result", async () => {

        const token = await getStudentToken();

        const temporaryResult =
            await createTemporaryResult();


        const response = await request(app)
            .delete(`/results/${temporaryResult.resultId}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(403);

        expect(response.body.success).toBe(false);



        await pool.query(
            `DELETE FROM results WHERE id = $1`,
            [temporaryResult.resultId]
        );
    });


    test("should allow admin to delete an existing result", async () => {

        const token = await getAdminToken();

        const temporaryResult =
            await createTemporaryResult();


        const response = await request(app)
            .delete(`/results/${temporaryResult.resultId}`)
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);


        const deletedResult = await pool.query(
            `
            SELECT id
            FROM results
            WHERE id = $1;
            `,
            [temporaryResult.resultId]
        );

        expect(deletedResult.rows.length).toBe(0);
    });


    test("should return 404 when deleting a non-existent result", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .delete("/results/999999")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(404);

        expect(response.body.success).toBe(false);
    });




    test("should reject marks exceeding maximum marks", async () => {

        const token = await getAdminToken();

        const availableCombination =
            await findAvailableCombination();

        expect(availableCombination).not.toBeNull();

        const {
            student_id,
            exam_id,
            max_marks
        } = availableCombination;


        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                studentId: Number(student_id),
                examId: Number(exam_id),
                marksObtained: Number(max_marks) + 1
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
    });


    test("should reject duplicate result for same student and exam", async () => {

        const token = await getAdminToken();


        const temporaryResult =
            await createTemporaryResult();


        const response = await request(app)
            .post("/results")
            .set(
                "Authorization",
                `Bearer ${token}`
            )
            .send({
                studentId: temporaryResult.studentId,
                examId: temporaryResult.examId,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);



        await pool.query(
            `DELETE FROM results WHERE id = $1`,
            [temporaryResult.resultId]
        );
    });




    afterAll(async () => {
        await closeDB();
    });

});