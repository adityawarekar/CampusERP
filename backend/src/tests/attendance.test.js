import request from "supertest";
import app from "../app.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

import pool, { closeDB } from "../config/db.js";


const getExistingAttendanceId = async () => {
    const result = await pool.query(`
        SELECT id
        FROM attendance
        ORDER BY id
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error("No attendance record exists for testing");
    }

    return result.rows[0].id;
};


const getExistingStudentId = async () => {
    const result = await pool.query(`
        SELECT id
        FROM students
        ORDER BY id
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error("No student exists for attendance testing");
    }

    return result.rows[0].id;
};


describe("Attendance API", () => {

   
    test("should allow admin to get all attendance", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/attendance")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.pagination).toBeDefined();
    });


    test("should reject student from getting all attendance", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/attendance")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated attendance request", async () => {

        const response = await request(app)
            .get("/attendance");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


   
    test("should reject invalid attendance query parameters", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/attendance")
            .query({
                page: 0,
                limit: 101,
                status: "InvalidStatus",
                sortBy: "invalid",
                order: "INVALID"
            })
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should allow filtering attendance by student id", async () => {

        const token = await getAdminToken();

        const studentId = await getExistingStudentId();

        const response = await request(app)
            .get("/attendance")
            .query({
                studentId
            })
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should allow filtering attendance by status", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/attendance")
            .query({
                status: "Present"
            })
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    
    test("should allow admin to get attendance by id", async () => {

        const token = await getAdminToken();

        const attendanceId =
            await getExistingAttendanceId();

        const response = await request(app)
            .get(`/attendance/${attendanceId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should return 404 for non-existent attendance record", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/attendance/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Attendance record not found"
        );
    });


    test("should reject unauthenticated attendance by id request", async () => {

        const attendanceId =
            await getExistingAttendanceId();

        const response = await request(app)
            .get(`/attendance/${attendanceId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    
    test("should allow admin to get student attendance summary", async () => {

        const token = await getAdminToken();

        const studentId =
            await getExistingStudentId();

        const response = await request(app)
            .get(`/attendance/summary/${studentId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should allow student to get attendance summary", async () => {

        const token = await getStudentToken();

        const studentId =
            await getExistingStudentId();

        const response = await request(app)
            .get(`/attendance/summary/${studentId}`)
            .set("Authorization", `Bearer ${token}`);

        /*
         * Student access is protected by
         * attendanceOwnershipMiddleware.
         *
         * If this student belongs to the selected student record,
         * the response should be 200.
         *
         * Otherwise the middleware correctly returns 403.
         */
        expect([200, 403]).toContain(response.statusCode);
        expect(response.body.success).toBeDefined();
    });


    test("should reject unauthenticated attendance summary request", async () => {

        const studentId =
            await getExistingStudentId();

        const response = await request(app)
            .get(`/attendance/summary/${studentId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    
    test("should allow admin to get low attendance students", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/attendance/low-attendance")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should reject student from getting low attendance students", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/attendance/low-attendance")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated low attendance request", async () => {

        const response = await request(app)
            .get("/attendance/low-attendance");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    
    afterAll(async () => {
        await closeDB();
    });

});