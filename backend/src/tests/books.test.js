import request from "supertest";
import app from "../app.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

import { closeDB } from "../config/db.js";

describe("Books API", () => {

    test("should return all books for student", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/books")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should return all books for admin", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/books")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject unauthenticated books request", async () => {
        const response = await request(app)
            .get("/books");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from creating a book", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .post("/books")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Book",
                author: "Test Author",
                isbn: "TEST-001",
                totalCopies: 5
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to create a book", async () => {
        const token = await getAdminToken();

        const uniqueIsbn = `TEST-${Date.now()}`;

        const response = await request(app)
            .post("/books")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Test Book",
                author: "Test Author",
                isbn: uniqueIsbn,
                totalCopies: 5
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

        // Cleanup
        const bookId = response.body.data.id;

        const pool = (await import("../config/db.js")).default;

        await pool.query(
            `DELETE FROM books WHERE id = $1`,
            [bookId]
        );
    });


    test("should reject invalid book data", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/books")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "A",
                author: "B",
                totalCopies: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should return 400 when creating a book with duplicate ISBN", async () => {
        const token = await getAdminToken();

        const existingBook = await (await import("../config/db.js"))
            .default.query(`
            SELECT isbn
            FROM books
            WHERE isbn IS NOT NULL
            LIMIT 1;
        `);

        expect(existingBook.rows.length).toBeGreaterThan(0);

        const isbn = existingBook.rows[0].isbn;

        const response = await request(app)
            .post("/books")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Duplicate ISBN Book",
                author: "Test Author",
                isbn,
                totalCopies: 5
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated book creation", async () => {
        const response = await request(app)
            .post("/books")
            .send({
                title: "Test Book",
                author: "Test Author",
                isbn: `TEST-${Date.now()}`,
                totalCopies: 5
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("should allow student to get a book by id", async () => {
        const token = await getStudentToken();

        const pool = (await import("../config/db.js")).default;

        const book = await pool.query(`
        SELECT id
        FROM books
        LIMIT 1;
    `);

        expect(book.rows.length).toBeGreaterThan(0);

        const response = await request(app)
            .get(`/books/${book.rows[0].id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should allow admin to get a book by id", async () => {
        const token = await getAdminToken();

        const pool = (await import("../config/db.js")).default;

        const book = await pool.query(`
        SELECT id
        FROM books
        LIMIT 1;
    `);

        expect(book.rows.length).toBeGreaterThan(0);

        const response = await request(app)
            .get(`/books/${book.rows[0].id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should return 404 for non-existent book", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/books/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from updating a book", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .put("/books/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Book",
                author: "Updated Author",
                isbn: "UPDATE-001",
                totalCopies: 10
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to update a book", async () => {
        const token = await getAdminToken();

        const pool = (await import("../config/db.js")).default;

        const book = await pool.query(`
        SELECT id, isbn
        FROM books
        LIMIT 1;
    `);

        expect(book.rows.length).toBeGreaterThan(0);

        const bookId = book.rows[0].id;

        const response = await request(app)
            .put(`/books/${bookId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Test Book",
                author: "Updated Author",
                isbn: book.rows[0].isbn,
                totalCopies: 10
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should return 404 when updating a non-existent book", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .put("/books/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Updated Test Book",
                author: "Updated Author",
                isbn: "UPDATE-999",
                totalCopies: 10
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject invalid book update data", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .put("/books/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "A",
                author: "B",
                totalCopies: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from deleting a book", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .delete("/books/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to delete a book without issued copies", async () => {
        const token = await getAdminToken();

        const pool = (await import("../config/db.js")).default;

        const student = await pool.query(`
        SELECT id
        FROM students
        LIMIT 1;
    `);

        expect(student.rows.length).toBeGreaterThan(0);

        const uniqueIsbn = `DELETE-${Date.now()}`;

        const createResponse = await request(app)
            .post("/books")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Book To Delete",
                author: "Test Author",
                isbn: uniqueIsbn,
                totalCopies: 2
            });

        expect(createResponse.statusCode).toBe(201);

        const bookId = createResponse.body.data.id;

        const deleteResponse = await request(app)
            .delete(`/books/${bookId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body.success).toBe(true);
    });


    test("should return 404 when deleting a non-existent book", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .delete("/books/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated book creation", async () => {
        const response = await request(app)
            .post("/books")
            .send({
                title: "Unauthorized Book",
                author: "Test Author",
                isbn: `AUTH-${Date.now()}`,
                totalCopies: 5
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated book deletion", async () => {
        const response = await request(app)
            .delete("/books/1");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    afterAll(async () => {
        await closeDB();
    });


});