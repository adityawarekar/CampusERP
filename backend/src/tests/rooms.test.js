import request from "supertest";
import app from "../app.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

import pool, { closeDB } from "../config/db.js";


const getExistingHostelId = async () => {
    const result = await pool.query(`
        SELECT id
        FROM hostels
        ORDER BY id
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error("No hostel exists for room testing");
    }

    return result.rows[0].id;
};


const getExistingRoomId = async () => {
    const result = await pool.query(`
        SELECT id
        FROM rooms
        ORDER BY id
        LIMIT 1;
    `);

    if (result.rows.length === 0) {
        throw new Error("No room exists for testing");
    }

    return result.rows[0].id;
};


const createTestRoom = async () => {
    const hostelId = await getExistingHostelId();

    const roomNumber = `T${Date.now()}${Math.floor(Math.random() * 1000)}`;

    const response = await request(app)
        .post("/rooms")
        .set(
            "Authorization",
            `Bearer ${await getAdminToken()}`
        )
        .send({
            hostelId,
            roomNumber,
            capacity: 4
        });

    if (response.statusCode !== 201) {
        throw new Error(
            `Test room creation failed: ${response.statusCode} ${JSON.stringify(response.body)}`
        );
    }

    return response.body.data;
};


describe("Rooms API", () => {


    test("should return all rooms for admin", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/rooms")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.pagination).toBeDefined();
    });


    test("should allow student to get all rooms", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/rooms")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject unauthenticated room request", async () => {

        const response = await request(app)
            .get("/rooms");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });




    test("should return room availability for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/rooms/availability")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should return room availability for admin", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/rooms/availability")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject unauthenticated room availability request", async () => {

        const response = await request(app)
            .get("/rooms/availability");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should allow admin to get room by id", async () => {

        const token = await getAdminToken();

        const roomId = await getExistingRoomId();

        const response = await request(app)
            .get(`/rooms/${roomId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should allow student to get room by id", async () => {

        const token = await getStudentToken();

        const roomId = await getExistingRoomId();

        const response = await request(app)
            .get(`/rooms/${roomId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should return 404 for non-existent room", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/rooms/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Room not found");
    });


    test("should reject unauthenticated room by id request", async () => {

        const roomId = await getExistingRoomId();

        const response = await request(app)
            .get(`/rooms/${roomId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });



    test("should allow admin to create a room", async () => {

        const token = await getAdminToken();

        const hostelId = await getExistingHostelId();

        const roomNumber =
            `A${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const response = await request(app)
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                hostelId,
                roomNumber,
                capacity: 4
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.room_number).toBe(roomNumber);
    });


    test("should reject student from creating a room", async () => {

        const token = await getStudentToken();

        const hostelId = await getExistingHostelId();

        const response = await request(app)
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                hostelId,
                roomNumber: `ST${Date.now()}`,
                capacity: 4
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated room creation", async () => {

        const hostelId = await getExistingHostelId();

        const response = await request(app)
            .post("/rooms")
            .send({
                hostelId,
                roomNumber: `UN${Date.now()}`,
                capacity: 4
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject invalid room data", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                hostelId: 0,
                roomNumber: "",
                capacity: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should reject room creation with non-existent hostel", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                hostelId: 999999,
                roomNumber: `NH${Date.now()}`,
                capacity: 4
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Hostel not found");
    });


    test("should reject duplicate room number in same hostel", async () => {

        const token = await getAdminToken();

        const hostelId = await getExistingHostelId();

        const roomNumber =
            `D${Date.now()}${Math.floor(Math.random() * 1000)}`;

        const firstResponse = await request(app)
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                hostelId,
                roomNumber,
                capacity: 4
            });

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/rooms")
            .set("Authorization", `Bearer ${token}`)
            .send({
                hostelId,
                roomNumber,
                capacity: 4
            });

        expect(secondResponse.statusCode).toBe(400);
        expect(secondResponse.body.success).toBe(false);
        expect(secondResponse.body.message).toBe(
            "Room already exists in this hostel"
        );
    });



    test("should allow admin to update a room", async () => {

        const token = await getAdminToken();

        const room = await createTestRoom();

        const response = await request(app)
            .put(`/rooms/${room.id}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                roomNumber: `U${Date.now()}`,
                capacity: 6
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });


    test("should reject student from updating a room", async () => {

        const studentToken = await getStudentToken();

        const roomId = await getExistingRoomId();

        const response = await request(app)
            .put(`/rooms/${roomId}`)
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                roomNumber: `S${Date.now()}`,
                capacity: 4
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject invalid room update", async () => {

        const token = await getAdminToken();

        const roomId = await getExistingRoomId();

        const response = await request(app)
            .put(`/rooms/${roomId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                roomNumber: "",
                capacity: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when updating non-existent room", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .put("/rooms/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                roomNumber: "999",
                capacity: 4
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Room not found");
    });




    test("should reject student from deleting a room", async () => {

        const studentToken = await getStudentToken();

        const roomId = await getExistingRoomId();

        const response = await request(app)
            .delete(`/rooms/${roomId}`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });


    test("should reject unauthenticated room deletion", async () => {

        const roomId = await getExistingRoomId();

        const response = await request(app)
            .delete(`/rooms/${roomId}`);

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should return 404 when deleting non-existent room", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .delete("/rooms/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Room not found");
    });


    test("should allow admin to delete a room", async () => {

        const token = await getAdminToken();

        const room = await createTestRoom();

        const response = await request(app)
            .delete(`/rooms/${room.id}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });



    afterAll(async () => {
        await closeDB();
    });

});