import request from "supertest";
import app from "../app.js";
import { closeDB } from "../config/db.js";
import pool from "../config/db.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";


describe("Results API", () => {

    test("should return all results for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/results")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });


    test("should return all results for admin", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/results")
            .set("Authorization", `Bearer ${token}`);

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

        const response = await request(app)
            .get("/results/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(2);

    });

    test("should reject student from accessing another student's result", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/results/3")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 for non-existent result", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/results/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from creating a result", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .post("/results")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 2,
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
                studentId: 2,
                examId: 1,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should allow admin to create a result", async () => {
        const token = await getAdminToken();

        // Find a student + exam combination
        // where the student is already enrolled and has no result yet.
        const availableCombination = await pool.query(`
        SELECT
            e.student_id,
            e.course_id,
            ex.id AS exam_id
        FROM enrollments e
        INNER JOIN exams ex
            ON ex.course_id = e.course_id
        WHERE NOT EXISTS (
            SELECT 1
            FROM results r
            WHERE r.student_id = e.student_id
            AND r.exam_id = ex.id
        )
        LIMIT 1;
    `);

        expect(availableCombination.rows.length).toBeGreaterThan(0);

        const { student_id, exam_id } =
            availableCombination.rows[0];

        const response = await request(app)
            .post("/results")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: student_id,
                examId: exam_id,
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
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 2,
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
            .set("Authorization", `Bearer ${token}`)
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
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 2,
                examId: 999999,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to update an existing result", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .put("/results/2")
            .set("Authorization", `Bearer ${token}`)
            .send({
                marksObtained: 45
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.marks_obtained).toBe(45);
    });


    test("should reject student from updating a result", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .put("/results/2")
            .set("Authorization", `Bearer ${token}`)
            .send({
                marksObtained: 45
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when updating a non-existent result", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .put("/results/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                marksObtained: 45
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from deleting a result", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .delete("/results/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to delete an existing result", async () => {
        const token = await getAdminToken();

        // Find an existing result that can be safely deleted
        const result = await pool.query(`
        SELECT id
        FROM results
        LIMIT 1;
    `);

        expect(result.rows.length).toBeGreaterThan(0);

        const resultId = result.rows[0].id;

        const response = await request(app)
            .delete(`/results/${resultId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should return 404 when deleting a non-existent result", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .delete("/results/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject marks exceeding maximum marks", async () => {
        const token = await getAdminToken();

        const availableCombination = await pool.query(`
        SELECT
            e.student_id,
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
        LIMIT 1;
    `);

        expect(availableCombination.rows.length).toBeGreaterThan(0);

        const {
            student_id,
            exam_id,
            max_marks
        } = availableCombination.rows[0];

        const response = await request(app)
            .post("/results")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: student_id,
                examId: exam_id,
                marksObtained: Number(max_marks) + 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should reject duplicate result for same student and exam", async () => {
        const token = await getAdminToken();

        const existingResult = await pool.query(`
        SELECT student_id, exam_id
        FROM results
        LIMIT 1;
    `);

        expect(existingResult.rows.length).toBeGreaterThan(0);

        const {
            student_id,
            exam_id
        } = existingResult.rows[0];

        const response = await request(app)
            .post("/results")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: student_id,
                examId: exam_id,
                marksObtained: 40
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });




    afterAll(async () => {
        await closeDB();
    });

});