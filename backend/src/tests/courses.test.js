import request from "supertest";
import app from "../app.js";
import { closeDB } from "../config/db.js";
import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

describe("Courses API", () => {

    test("should return all courses for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/courses")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test("should reject courses request without authentication", async () => {

        const response = await request(app)
            .get("/courses");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test("should return course by id for student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/courses/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test("should return 404 for non-existent course", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/courses/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });

    test("should reject student from creating a course", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .post("/courses")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Test Course",
                code: "TEST999",
                departmentId: 1
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });

    test("should reject course creation without authentication", async () => {

        const response = await request(app)
            .post("/courses")
            .send({
                name: "Test Course",
                code: "TEST999",
                departmentId: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test("should reject student from updating a course", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .put("/courses/1")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Course",
                code: "UPD999",
                departmentId: 1
            });

        

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });

    test("should reject student from deleting a course", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .delete("/courses/1")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });

    test("should reject course deletion without authentication", async () => {

        const response = await request(app)
            .delete("/courses/1");

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test("should reject invalid course data", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/courses")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "A",
                code: "",
                credits: 4
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);

    });

    test("should return 404 when updating a non-existent course", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .put("/courses/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Course",
                code: "UPD999",
                credits: 4
            });

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });

    test("should return 404 when deleting a non-existent course", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .delete("/courses/999999")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });

    test("should return 404 when updating a non-existent course", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .put("/courses/999999")
            .set("Authorization", `Bearer ${token}`)
            .send({
                name: "Updated Course",
                code: "UPD999",
                credits: 4
            });

        
        expect(response.statusCode).toBe(404);
        expect(response.body.success).toBe(false);

    });

    afterAll(async () => {

        await closeDB();

    });

});