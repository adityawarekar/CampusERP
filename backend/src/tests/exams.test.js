import request from "supertest";
import app from "../app.js";
import { closeDB } from "../config/db.js";
import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

describe("Exams API", () => {

    test("should return all exams for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/exams")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });


    test("should reject exams request without authentication", async () => {

        const response = await request(app)
            .get("/exams");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });


    test("should reject student from creating an exam", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .post("/exams")
            .set("Authorization", `Bearer ${token}`)
            .send({
                examName: "Test Examination",
                examDate: "2026-12-01",
                maxMarks: 100,
                courseId: 1
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });


    test("should create exam for admin", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/exams")
            .set("Authorization", `Bearer ${token}`)
            .send({
                examName: "Test Examination",
                examDate: "2026-12-01",
                maxMarks: 100,
                courseId: 1
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

    });

    test("should return exam by id for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/exams/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });


    test("should return 404 for non-existent exam", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/exams/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });


    test("should reject student from updating an exam", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .put("/exams/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                examName: "Updated Examination",
                examDate: "2026-12-15",
                maxMarks: 100,
                courseId: 1
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });


    test("should reject student from deleting an exam", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .delete("/exams/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });

    test("should reject exam creation without authentication", async () => {

        const response = await request(app)
            .post("/exams")
            .send({
                examName: "Unauthenticated Examination",
                examDate: "2026-12-01",
                maxMarks: 100,
                courseId: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });


    test("should reject invalid exam data", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/exams")
            .set("Authorization", `Bearer ${token}`)
            .send({
                examName: "A",
                examDate: "invalid-date",
                maxMarks: -100,
                courseId: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

    });


    test("should return 404 when updating a non-existent exam", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .put("/exams/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                examName: "Updated Examination",
                examDate: "2026-12-15",
                maxMarks: 100,
                courseId: 1
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });


    test("should return 404 when deleting a non-existent exam", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .delete("/exams/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });


    afterAll(async () => {

        await closeDB();

    });

});