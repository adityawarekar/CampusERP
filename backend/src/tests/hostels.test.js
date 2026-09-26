import request from "supertest";
import app from "../app.js";

import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

import { closeDB } from "../config/db.js";

describe("Hostels API", () => {

    test("should return all hostels for admin", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/hostels")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should allow student to get all hostels", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/hostels")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });


    test("should reject unauthenticated hostel request", async () => {
        const response = await request(app)
            .get("/hostels");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });


    test("should reject student from creating a hostel", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .post("/hostels")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Hostel",
                location: "North Campus",
                totalRooms: 20
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to create a hostel", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/hostels")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: `Test Hostel ${Date.now()}`,
                location: "North Campus",
                totalRooms: 20
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeDefined();
    });

    test("should reject student from creating a hostel", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .post("/hostels")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: `Student Hostel ${Date.now()}`,
                location: "North Campus",
                totalRooms: 20
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should reject invalid hostel data", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .post("/hostels")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A",
                location: "North Campus",
                totalRooms: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("should reject unauthenticated hostel creation", async () => {
        const response = await request(app)
            .post("/hostels")
            .send({
                name: `Unauthorized Hostel ${Date.now()}`,
                location: "North Campus",
                totalRooms: 20
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to get hostel by id", async () => {
        const token = await getAdminToken();

        const allResponse = await request(app)
            .get("/hostels")
            .set("Authorization", `Bearer ${token}`);

        expect(allResponse.statusCode).toBe(200);
        expect(allResponse.body.data.length).toBeGreaterThan(0);

        const hostelId = allResponse.body.data[0].id;

        const response = await request(app)
            .get(`/hostels/${hostelId}`)
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("should allow student to get hostel by id", async () => {
        const studentToken = await getStudentToken();

        const adminToken = await getAdminToken();

        const allResponse = await request(app)
            .get("/hostels")
            .set("Authorization", `Bearer ${adminToken}`);

        const hostelId = allResponse.body.data[0].id;

        const response = await request(app)
            .get(`/hostels/${hostelId}`)
            .set("Authorization", `Bearer ${studentToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("should return 404 for non-existent hostel", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .get("/hostels/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Hostel not found");
    });

    test("should reject unauthenticated hostel by id request", async () => {
        const response = await request(app)
            .get("/hostels/1");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);
    });

    test("should allow admin to update a hostel", async () => {
        const token = await getAdminToken();

        const allResponse = await request(app)
            .get("/hostels")
            .set("Authorization", `Bearer ${token}`);

        const hostelId = allResponse.body.data[0].id;

        const response = await request(app)
            .put(`/hostels/${hostelId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: `Updated Hostel ${Date.now()}`,
                location: "Updated Campus",
                totalRooms: 25
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("should reject student from updating a hostel", async () => {
        const studentToken = await getStudentToken();
        const adminToken = await getAdminToken();

        const allResponse = await request(app)
            .get("/hostels")
            .set("Authorization", `Bearer ${adminToken}`);

        const hostelId = allResponse.body.data[0].id;

        const response = await request(app)
            .put(`/hostels/${hostelId}`)
            .set("Authorization", `Bearer ${studentToken}`)
            .send({
                name: `Student Updated Hostel ${Date.now()}`,
                location: "Campus",
                totalRooms: 30
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);
    });

    test("should reject invalid hostel update", async () => {
        const token = await getAdminToken();

        const allResponse = await request(app)
            .get("/hostels")
            .set("Authorization", `Bearer ${token}`);

        const hostelId = allResponse.body.data[0].id;

        const response = await request(app)
            .put(`/hostels/${hostelId}`)
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A",
                location: "Campus",
                totalRooms: 0
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("should return 404 when updating non-existent hostel", async () => {
        const token = await getAdminToken();

        const response = await request(app)
            .put("/hostels/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Hostel",
                location: "Campus",
                totalRooms: 20
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe("Hostel not found");
    });
    test("should reject student from deleting a hostel", async () => {
    const studentToken = await getStudentToken();
    const adminToken = await getAdminToken();

    const allResponse = await request(app)
        .get("/hostels")
        .set("Authorization", `Bearer ${adminToken}`);

    const hostelId = allResponse.body.data[0].id;

    const response = await request(app)
        .delete(`/hostels/${hostelId}`)
        .set("Authorization", `Bearer ${studentToken}`);

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);
});

test("should reject unauthenticated hostel deletion", async () => {
    const response = await request(app)
        .delete("/hostels/1");

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
});

test("should return 404 when deleting non-existent hostel", async () => {
    const token = await getAdminToken();

    const response = await request(app)
        .delete("/hostels/999999")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Hostel not found");
});

test("should allow admin to delete a hostel", async () => {
    const token = await getAdminToken();

    const createResponse = await request(app)
        .post("/hostels")
        .set("Authorization", `Bearer ${token}`)
        .send({
            name: `Delete Test Hostel ${Date.now()}`,
            location: "Test Campus",
            totalRooms: 10
        });

    expect(createResponse.statusCode).toBe(201);

    const hostelId = createResponse.body.data.id;

    const response = await request(app)
        .delete(`/hostels/${hostelId}`)
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
});



    afterAll(async () => {
        await closeDB();
    });

});