import request from "supertest";
import app from "../app.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

import { closeDB } from "../config/db.js";
import pool from "../config/db.js";

describe("Book Issues API", () => {

    

    const getAvailableBookId = async () => {
        const result = await pool.query(`
            SELECT id
            FROM books
            WHERE available_copies > 0
            ORDER BY id
            LIMIT 1;
        `);

        if (result.rows.length === 0) {
            throw new Error(
                "No available book exists for testing"
            );
        }

        return result.rows[0].id;
    };


    

    test("should return all book issues for admin", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/book-issues")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject student from getting all book issues", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/book-issues")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated book issues request", async () => {
        const response = await request(app)
            .get("/book-issues");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });



    test("should reject student from issuing a book", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .post("/book-issues")
            .set("Authorization", `Bearer ${token}`)
            .send({
                bookId: 1,
                studentId: 2,
                dueDate: "2026-10-10"
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated book issue creation", async () => {
        const response = await request(app)
            .post("/book-issues")
            .send({
                bookId: 1,
                studentId: 2,
                dueDate: "2026-10-10"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject invalid book issue data", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/book-issues")
            .set("Authorization", `Bearer ${token}`)
            .send({
                bookId: -1,
                studentId: 2
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when book does not exist", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/book-issues")
            .set("Authorization", `Bearer ${token}`)
            .send({
                bookId: 999999,
                studentId: 2,
                dueDate: "2026-10-10"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when student does not exist", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/book-issues")
            .set("Authorization", `Bearer ${token}`)
            .send({
                bookId: 999999,
                studentId: 999999,
                dueDate: "2026-10-10"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    

    test("should allow admin to get a book issue by ID", async () => {
        const token = await getAdminToken();

        const listResponse = await request(app)
            .get("/book-issues")
            .set("Authorization", `Bearer ${token}`);

        const issue = listResponse.body.data[0];

        if (!issue) {
            throw new Error(
                "No book issue exists in database for this test"
            );
        }

        const response = await request(app)
            .get(`/book-issues/${issue.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject student from getting a book issue by ID", async () => {
        const adminToken = await getAdminToken();

        const listResponse = await request(app)
            .get("/book-issues")
            .set("Authorization", `Bearer ${adminToken}`);

        const issue = listResponse.body.data[0];

        if (!issue) {
            throw new Error(
                "No book issue exists in database for this test"
            );
        }

        const studentToken = await getStudentToken();

        const response = await request(app)
            .get(`/book-issues/${issue.id}`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 for non-existent book issue", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/book-issues/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated book issue by ID request", async () => {
        const response = await request(app)
            .get("/book-issues/1");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    

    test("should allow admin to get book issues for any student", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/book-issues/student/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should allow student to get their own book issues", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/book-issues/student/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject student from getting another student's book issues", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/book-issues/student/4")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated student book issues request", async () => {
        const response = await request(app)
            .get("/book-issues/student/2");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    

    test("should reject student from returning a book", async () => {
        const adminToken = await getAdminToken();

        const bookId = await getAvailableBookId();

        const createResponse = await request(app)
            .post("/book-issues")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                bookId,
                studentId: 2,
                dueDate: "2026-10-10"
            });

        expect(createResponse.statusCode).toBe(201);

        const issueId = createResponse.body.data.id;

        const studentToken = await getStudentToken();

        const response = await request(app)
            .put(`/book-issues/${issueId}/return`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

        
        await request(app)
            .put(`/book-issues/${issueId}/return`)
            .set("Authorization", `Bearer ${adminToken}`);
    });


    test("should reject unauthenticated book return", async () => {
        const response = await request(app)
            .put("/book-issues/1/return");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when returning non-existent book issue", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .put("/book-issues/999999/return")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should allow admin to return an active book issue", async () => {
        const adminToken = await getAdminToken();

        const bookId = await getAvailableBookId();

        const createResponse = await request(app)
            .post("/book-issues")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                bookId,
                studentId: 2,
                dueDate: "2026-10-10"
            });

        expect(createResponse.statusCode).toBe(201);

        const issueId = createResponse.body.data.id;

        const response = await request(app)
            .put(`/book-issues/${issueId}/return`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.status).toBe("Returned");
    });


    test("should return 400 when returning an already returned book issue", async () => {
        const adminToken = await getAdminToken();

        const bookId = await getAvailableBookId();

        const createResponse = await request(app)
            .post("/book-issues")
            .set("Authorization", `Bearer ${adminToken}`)
            .send({
                bookId,
                studentId: 2,
                dueDate: "2026-10-10"
            });

        expect(createResponse.statusCode).toBe(201);

        const issueId = createResponse.body.data.id;

        
        const firstReturn = await request(app)
            .put(`/book-issues/${issueId}/return`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(firstReturn.statusCode).toBe(200);

        
        const secondReturn = await request(app)
            .put(`/book-issues/${issueId}/return`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(secondReturn.statusCode).toBe(400);
        expect(secondReturn.body.success).toBe(false);
    });


   
    afterAll(async () => {
        await closeDB();
    });

});