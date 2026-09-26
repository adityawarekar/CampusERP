import request from "supertest";
import app from "../app.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

import pool, { closeDB } from "../config/db.js";


const getExistingStudentId = async () => {
    const result = await pool.query(`
        SELECT id
        FROM students
        ORDER BY id
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error("No student exists for hostel allocation testing");
    }

    return result.rows[0].id;
};


const getExistingRoomId = async () => {
    const result = await pool.query(`
        SELECT id
        FROM rooms
        WHERE occupied_beds < capacity
        ORDER BY id
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error("No room with available beds exists");
    }

    return result.rows[0].id;
};


const getStudentWithoutActiveAllocation = async () => {
    const result = await pool.query(`
        SELECT s.id
        FROM students s
        WHERE NOT EXISTS (
            SELECT 1
            FROM hostel_allocations ha
            WHERE ha.student_id = s.id
              AND ha.status = 'Active'
        )
        ORDER BY s.id
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error(
            "No student without an active hostel allocation exists"
        );
    }

    return result.rows[0].id;
};


const getAvailableBedNumber = async (roomId) => {
    const roomResult = await pool.query(
        `
        SELECT capacity
        FROM rooms
        WHERE id = $1;
        `,
        [roomId]
    );

    if (roomResult.rows.length === 0) {
        throw new Error("Room not found");
    }

    const capacity = roomResult.rows[0].capacity;

    const allocationResult = await pool.query(
        `
        SELECT bed_number
        FROM hostel_allocations
        WHERE room_id = $1
          AND status = 'Active';
        `,
        [roomId]
    );

    const occupiedBeds = new Set(
        allocationResult.rows.map(row => Number(row.bed_number))
    );

    for (let bed = 1; bed <= capacity; bed++) {
        if (!occupiedBeds.has(bed)) {
            return bed;
        }
    }

    throw new Error("No available bed exists");
};


const createTestAllocation = async () => {

    const studentId =
        await getStudentWithoutActiveAllocation();

    const roomId =
        await getExistingRoomId();

    const bedNumber =
        await getAvailableBedNumber(roomId);

    const token =
        await getAdminToken();

    const response = await request(app)
        .post("/hostel-allocations")
        .set(
            "Authorization",
            `Bearer ${token}`
        )
        .send({
            studentId,
            roomId,
            bedNumber
        });

    if (response.statusCode !== 201) {
        throw new Error(
            `Test allocation creation failed: ${response.statusCode} ${JSON.stringify(response.body)}`
        );
    }

    return response.body.data;
};


describe("Hostel Allocations API", () => {

    
    test("should allow admin to get all hostel allocations", async () => {

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .get("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.pagination).toBeDefined();
    });


    test("should reject unauthenticated request for all allocations", async () => {

        const response =
            await request(app)
                .get("/hostel-allocations");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from getting all allocations", async () => {

        const token =
            await getStudentToken();

        const response =
            await request(app)
                .get("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    
    test("should allow admin to create a hostel allocation", async () => {

        const token =
            await getAdminToken();

        const studentId =
            await getStudentWithoutActiveAllocation();

        const roomId =
            await getExistingRoomId();

        const bedNumber =
            await getAvailableBedNumber(roomId);

        const response =
            await request(app)
                .post("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .send({
                    studentId,
                    roomId,
                    bedNumber
                });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should reject student from creating an allocation", async () => {

        const token =
            await getStudentToken();

        const studentId =
            await getStudentWithoutActiveAllocation();

        const roomId =
            await getExistingRoomId();

        const bedNumber =
            await getAvailableBedNumber(roomId);

        const response =
            await request(app)
                .post("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .send({
                    studentId,
                    roomId,
                    bedNumber
                });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated allocation creation", async () => {

        const response =
            await request(app)
                .post("/hostel-allocations")
                .send({
                    studentId: 1,
                    roomId: 1,
                    bedNumber: 1
                });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject invalid allocation data", async () => {

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .post("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .send({
                    studentId: 0,
                    roomId: 0,
                    bedNumber: 0
                });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when student does not exist", async () => {

        const token =
            await getAdminToken();

        const roomId =
            await getExistingRoomId();

        const bedNumber =
            await getAvailableBedNumber(roomId);

        const response =
            await request(app)
                .post("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .send({
                    studentId: 999999,
                    roomId,
                    bedNumber
                });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Student not found"
        );
    });


    test("should return 404 when room does not exist", async () => {

        const token =
            await getAdminToken();

        const studentId =
            await getStudentWithoutActiveAllocation();

        const response =
            await request(app)
                .post("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .send({
                    studentId,
                    roomId: 999999,
                    bedNumber: 1
                });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Room not found"
        );
    });


    test("should reject invalid bed number", async () => {

        const token =
            await getAdminToken();

        const studentId =
            await getStudentWithoutActiveAllocation();

        const roomId =
            await getExistingRoomId();

        const roomResult =
            await pool.query(
                `
                SELECT capacity
                FROM rooms
                WHERE id = $1;
                `,
                [roomId]
            );

        const invalidBedNumber =
            Number(roomResult.rows[0].capacity) + 1;

        const response =
            await request(app)
                .post("/hostel-allocations")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                )
                .send({
                    studentId,
                    roomId,
                    bedNumber: invalidBedNumber
                });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Invalid bed number"
        );
    });


    

    test("should allow admin to get allocation by id", async () => {

        const allocation =
            await createTestAllocation();

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .get(
                    `/hostel-allocations/${allocation.id}`
                )
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should return 404 for non-existent allocation", async () => {

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .get("/hostel-allocations/999999")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Hostel allocation not found"
        );
    });


    test("should reject unauthenticated allocation request", async () => {

        const response =
            await request(app)
                .get("/hostel-allocations/1");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    

    test("should allow admin to get active allocations", async () => {

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .get("/hostel-allocations/active")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should reject student from getting active allocations", async () => {

        const token =
            await getStudentToken();

        const response =
            await request(app)
                .get("/hostel-allocations/active")
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    
    test("should allow admin to get allocations by student id", async () => {

        const studentId =
            await getExistingStudentId();

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .get(
                    `/hostel-allocations/student/${studentId}`
                )
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should return 404 for non-existent student allocations", async () => {

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .get(
                    "/hostel-allocations/student/999999"
                )
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Student not found"
        );
    });


    test("should reject unauthenticated student allocation request", async () => {

        const studentId =
            await getExistingStudentId();

        const response =
            await request(app)
                .get(
                    `/hostel-allocations/student/${studentId}`
                );

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    
    test("should allow admin to vacate an allocation", async () => {

        const allocation =
            await createTestAllocation();

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .put(
                    `/hostel-allocations/${allocation.id}/vacate`
                )
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should reject student from vacating an allocation", async () => {

        const allocation =
            await createTestAllocation();

        const token =
            await getStudentToken();

        const response =
            await request(app)
                .put(
                    `/hostel-allocations/${allocation.id}/vacate`
                )
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

        // Cleanup
        const adminToken =
            await getAdminToken();

        await request(app)
            .put(
                `/hostel-allocations/${allocation.id}/vacate`
            )
            .set(
                "Authorization",
                `Bearer ${adminToken}`
            );
    });


    test("should return 404 when vacating non-existent allocation", async () => {

        const token =
            await getAdminToken();

        const response =
            await request(app)
                .put(
                    "/hostel-allocations/999999/vacate"
                )
                .set(
                    "Authorization",
                    `Bearer ${token}`
                );

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
            "Hostel allocation not found"
        );
    });


   

    afterAll(async () => {
        await closeDB();
    });

});