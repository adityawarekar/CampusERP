import request from "supertest";
import app from "../app.js";
import pool, { closeDB } from "../config/db.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";


describe("Enrollments API", () => {

    // --------------------------------------------------
    // GET ALL ENROLLMENTS
    // --------------------------------------------------

    test("should return all enrollments for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/enrollments")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });


    test("should return all enrollments for admin", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/enrollments")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });


    test("should reject enrollments request without authentication", async () => {

        const response = await request(app)
            .get("/enrollments");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });


    // --------------------------------------------------
    // CREATE ENROLLMENT
    // --------------------------------------------------

    test("should reject student from creating an enrollment", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .post("/enrollments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 2,
                courseId: 1
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });


    test("should reject enrollment creation without authentication", async () => {

        const response = await request(app)
            .post("/enrollments")
            .send({
                studentId: 2,
                courseId: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });


    test("should reject invalid enrollment data", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/enrollments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: -1,
                courseId: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

    });


    // --------------------------------------------------
    // GET ENROLLMENT BY ID
    // --------------------------------------------------

    test("should return 404 for non-existent enrollment", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/enrollments/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });


    test("should reject enrollment request without authentication", async () => {

        const response = await request(app)
            .get("/enrollments/999999");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });


    // --------------------------------------------------
    // DELETE ENROLLMENT
    // --------------------------------------------------

    test("should reject student from deleting an enrollment", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .delete("/enrollments/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });


    test("should reject enrollment deletion without authentication", async () => {

        const response = await request(app)
            .delete("/enrollments/999999");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });


    test("should return 404 when admin deletes non-existent enrollment", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .delete("/enrollments/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });

    test("should allow student to access their own enrollment", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/enrollments/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });


    test("should reject student from accessing another student's enrollment", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/enrollments/3")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });


    test("should allow admin to create an enrollment", async () => {

        const token = await getAdminToken();

        const availableCombination = await pool.query(`
        SELECT
            s.id AS student_id,
            c.id AS course_id
        FROM students s
        CROSS JOIN courses c
        WHERE NOT EXISTS (
            SELECT 1
            FROM enrollments e
            WHERE e.student_id = s.id
            AND e.course_id = c.id
        )
        LIMIT 1;
    `);

        expect(availableCombination.rows.length).toBeGreaterThan(0);

        const {
            student_id: studentId,
            course_id: courseId
        } = availableCombination.rows[0];

        const response = await request(app)
            .post("/enrollments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId,
                courseId
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty("id");
        expect(response.body.data.student_id).toBe(studentId);
        expect(response.body.data.course_id).toBe(courseId);

        await pool.query(
            `DELETE FROM enrollments WHERE id = $1`,
            [response.body.data.id]
        );

    });


    test("should allow admin to access another enrollment", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/enrollments/6")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });


    


    test("should return 404 when enrolling a non-existent student", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/enrollments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 999999,
                courseId: 1
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Student not found");

    });


    test("should return 404 when enrolling in a non-existent course", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/enrollments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 2,
                courseId: 999999
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Course not found");

    });


    test("should allow admin to view the newly created enrollment", async () => {

        const token = await getAdminToken();

        const availableCombination = await pool.query(`
        SELECT
            s.id AS student_id,
            c.id AS course_id
        FROM students s
        CROSS JOIN courses c
        WHERE NOT EXISTS (
            SELECT 1
            FROM enrollments e
            WHERE e.student_id = s.id
            AND e.course_id = c.id
        )
        LIMIT 1;
    `);

        expect(availableCombination.rows.length).toBeGreaterThan(0);

        const {
            student_id: studentId,
            course_id: courseId
        } = availableCombination.rows[0];

        const createResponse = await request(app)
            .post("/enrollments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId,
                courseId
            });

        expect(createResponse.statusCode).toBe(201);

        const enrollmentId =
            createResponse.body.data.id;

        const response = await request(app)
            .get(`/enrollments/${enrollmentId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.id).toBe(enrollmentId);

        await pool.query(
            `DELETE FROM enrollments WHERE id = $1`,
            [enrollmentId]
        );

    });


    // --------------------------------------------------
    // CLOSE DATABASE
    // --------------------------------------------------

    afterAll(async () => {

        await closeDB();

    });

});