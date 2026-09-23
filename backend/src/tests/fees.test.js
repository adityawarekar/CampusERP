import request from "supertest";
import app from "../app.js";
import pool, { closeDB } from "../config/db.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

describe("Fees API", () => {

    test("should return all fees for student", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/fees")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should return all fees for admin", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/fees")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject unauthenticated request for fees", async () => {
        const response = await request(app)
            .get("/fees");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from creating a fee record", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .post("/fees")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 2,
                totalAmount: 50000,
                dueDate: "2026-12-31"
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should allow student to access their own fee record", async () => {
        const token = await getStudentToken();

        const fee = await pool.query(`
        SELECT id
        FROM fee_records
        WHERE student_id = 2
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .get(`/fees/${feeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject student from accessing another student's fee record", async () => {
        const token = await getStudentToken();

        const fee = await pool.query(`
        SELECT id
        FROM fee_records
        WHERE student_id != 2
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .get(`/fees/${feeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 for non-existent fee record", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/fees/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated fee record request", async () => {
        const response = await request(app)
            .get("/fees/1");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to create a fee record", async () => {
        const token = await getAdminToken();

        const student = await pool.query(`
        SELECT s.id
        FROM students s
        WHERE NOT EXISTS (
            SELECT 1
            FROM fee_records f
            WHERE f.student_id = s.id
        )
        LIMIT 1;
    `);

        expect(student.rows.length).toBeGreaterThan(0);

        const studentId = student.rows[0].id;

        const response = await request(app)
            .post("/fees")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId,
                totalAmount: 50000,
                dueDate: "2026-12-31"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

        await pool.query(
            `DELETE FROM fee_records WHERE id = $1`,
            [response.body.data.id]
        );
    });


    test("should reject invalid fee data", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/fees")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 2,
                totalAmount: -5000,
                dueDate: "2026-12-31"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when creating fee for non-existent student", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/fees")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: 999999,
                totalAmount: 50000,
                dueDate: "2026-12-31"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated fee creation", async () => {
        const response = await request(app)
            .post("/fees")
            .send({
                studentId: 2,
                totalAmount: 50000,
                dueDate: "2026-12-31"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to create a payment", async () => {
        const token = await getAdminToken();

        const fee = await pool.query(`
        SELECT id
        FROM fee_records
        WHERE total_amount > amount_paid
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .post(`/fees/${feeId}/payments`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 100,
                paymentMethod: "UPI"
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

        // Cleanup payment and restore fee amount
        await pool.query(
            `DELETE FROM payments WHERE id = $1`,
            [response.body.data.id]
        );
    });


    test("should reject invalid payment amount", async () => {
        const token = await getAdminToken();

        const fee = await pool.query(`
        SELECT id
        FROM fee_records
        WHERE total_amount > amount_paid
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .post(`/fees/${feeId}/payments`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 0,
                paymentMethod: "UPI"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when creating payment for non-existent fee", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/fees/999999/payments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                amount: 100,
                paymentMethod: "UPI"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated payment creation", async () => {
        const response = await request(app)
            .post("/fees/1/payments")
            .send({
                amount: 100,
                paymentMethod: "UPI"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to get payments for a fee", async () => {
        const token = await getAdminToken();

        const fee = await pool.query(`
        SELECT id
        FROM fee_records
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .get(`/fees/${feeId}/payments`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });


    test("should return 404 when getting payments for non-existent fee", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/fees/999999/payments")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should allow admin to update an existing fee", async () => {
        const token = await getAdminToken();

        const fee = await pool.query(`
        SELECT id, total_amount, amount_paid
        FROM fee_records
        WHERE total_amount >= amount_paid
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;
        const amountPaid = Number(fee.rows[0].amount_paid);

        const response = await request(app)
            .put(`/fees/${feeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                totalAmount: amountPaid + 1000,
                dueDate: "2027-01-15"
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject student from updating a fee", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .put("/fees/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                totalAmount: 50000,
                dueDate: "2027-01-15"
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should return 404 when updating a non-existent fee", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .put("/fees/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                totalAmount: 50000,
                dueDate: "2027-01-15"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });


    test("should reject reducing fee below amount already paid", async () => {
        const token = await getAdminToken();

        const fee = await pool.query(`
        SELECT id, amount_paid
        FROM fee_records
        WHERE amount_paid > 0
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;
        const amountPaid = Number(fee.rows[0].amount_paid);

        const response = await request(app)
            .put(`/fees/${feeId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                totalAmount: Math.max(0, amountPaid - 1),
                dueDate: "2027-01-15"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should allow admin to delete a fee without payments", async () => {
        const token = await getAdminToken();

        const student = await pool.query(`
        SELECT s.id
        FROM students s
        WHERE NOT EXISTS (
            SELECT 1
            FROM fee_records f
            WHERE f.student_id = s.id
        )
        LIMIT 1;
    `);

        expect(student.rows.length).toBeGreaterThan(0);

        const createResponse = await request(app)
            .post("/fees")
            .set("Authorization", `Bearer ${token}`)
            .send({
                studentId: student.rows[0].id,
                totalAmount: 5000,
                dueDate: "2026-12-31"
            });

        expect(createResponse.statusCode).toBe(201);

        const feeId = createResponse.body.data.id;

        const deleteResponse = await request(app)
            .delete(`/fees/${feeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(deleteResponse.statusCode).toBe(200);
        expect(deleteResponse.body.success).toBe(true);
    });


    test("should return 404 when deleting a non-existent fee", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .delete("/fees/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
    });

    test("should allow student to get payments for their own fee", async () => {
        const token = await getStudentToken();

        const fee = await pool.query(`
        SELECT id
        FROM fee_records
        WHERE student_id = 2
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .get(`/fees/${feeId}/payments`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.data)).toBe(true);
    });


    test("should reject student from accessing another student's payments", async () => {
        const token = await getStudentToken();

        const fee = await pool.query(`
        SELECT id
        FROM fee_records
        WHERE student_id != 2
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .get(`/fees/${feeId}/payments`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject deleting a fee that has existing payments", async () => {
        const token = await getAdminToken();

        const fee = await pool.query(`
        SELECT f.id
        FROM fee_records f
        INNER JOIN payments p
            ON p.fee_id = f.id
        LIMIT 1;
    `);

        expect(fee.rows.length).toBeGreaterThan(0);

        const feeId = fee.rows[0].id;

        const response = await request(app)
            .delete(`/fees/${feeId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from deleting a fee", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .delete("/fees/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    afterAll(async () => {
        await closeDB();
    });

});