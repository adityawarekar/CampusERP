import request from "supertest";
import app from "../app.js";
import { closeDB } from "../config/db.js";
import { getAdminToken, getStudentToken } from "./helpers/auth.helper.js";

describe("Departments API", () => {

    test("should return all departments", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/departments")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test("should reject request without authentication", async () => {

        const response = await request(app)
            .get("/departments");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test("should allow student to view departments", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/departments")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test("should reject student from creating a department", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .post("/departments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Department",
                code: "TEST"
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });

    test("should reject department creation without authentication", async () => {

        const response = await request(app)
            .post("/departments")
            .send({
                name: "Test Department",
                code: "TEST"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test("should allow admin to create a department", async () => {

        const token = await getAdminToken();

        const uniqueCode = `T${Math.floor(Math.random() * 1000000)}`;

        const response = await request(app)
            .post("/departments")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Department",
                code: uniqueCode
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

    });

    test("should return department by id", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/departments/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test("should return 404 for non-existent department", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/departments/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });

    test("should reject student from updating a department", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .put("/departments/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Department",
                code: "UPDT"
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });
    test("should reject student from updating a department", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .put("/departments/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Department",
                code: "UPDT"
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });
    test("should reject department update without authentication", async () => {

        const response = await request(app)
            .put("/departments/1")
            .send({
                name: "Updated Department",
                code: "UPDT"
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });
    test("should reject student from deleting a department", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .delete("/departments/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });
    test("should reject department deletion without authentication", async () => {

        const response = await request(app)
            .delete("/departments/1");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });
    test("should return 404 when updating a non-existent department", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .put("/departments/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Department",
                code: "UPDT"
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });
    test("should return 404 when deleting a non-existent department", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .delete("/departments/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });
    test("should reject invalid department update data", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .put("/departments/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A",
                code: "X"
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

    });

    afterAll(async () => {

        await closeDB();

    });

});