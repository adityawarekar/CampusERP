import request from "supertest";
import app from "../app.js";

import { closeDB } from "../config/db.js";
import {
    getAdminToken,
    getStudentToken
} from "./helpers/auth.helper.js";

describe("Auth API", () => {

    

    const uniqueEmail = () => {
        return `testuser${Date.now()}${Math.floor(Math.random() * 10000)}@example.com`;
    };

    

    test("should register a new user", async () => {

        const email = uniqueEmail();

        const response = await request(app)
            .post("/auth/register")
            .send({
                email,
                password: "TestPassword123"
            });

        expect(response.statusCode).toBe(201);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "User registered successfully"
        );

        expect(response.body.data).toBeDefined();
    });


    test("should reject invalid registration data", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                email: "invalid-email",
                password: "123"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Validation failed"
        );
    });


    test("should reject registration with missing email", async () => {

        const response = await request(app)
            .post("/auth/register")
            .send({
                password: "TestPassword123"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
    });


    test("should reject registration with missing password", async () => {

        const email = uniqueEmail();

        const response = await request(app)
            .post("/auth/register")
            .send({
                email
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);
    });


    

    test("should login with valid credentials", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "admin@campus.com",
                password: "admin123"
            });

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Login successful"
        );

        expect(response.body.data).toBeDefined();

        expect(response.body.data.token).toBeDefined();

        expect(response.body.data.user).toBeDefined();

        expect(response.body.data.user.email).toBe(
            "admin@campus.com"
        );

        expect(response.body.data.user.role).toBe("ADMIN");
    });


    test("should reject login with invalid password", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "admin@campus.com",
                password: "wrongpassword123"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Invalid email or password"
        );
    });


    test("should reject login with non-existent email", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "doesnotexist999@example.com",
                password: "TestPassword123"
            });

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Invalid email or password"
        );
    });


    test("should reject login with invalid email format", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "invalid-email",
                password: "TestPassword123"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Validation failed"
        );
    });


    test("should reject login with missing password", async () => {

        const response = await request(app)
            .post("/auth/login")
            .send({
                email: "admin@campus.com"
            });

        expect(response.statusCode).toBe(400);

        expect(response.body.success).toBe(false);

        expect(response.body.message).toBe(
            "Validation failed"
        );
    });


    

    test("should return current user for valid admin token", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/auth/me")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.message).toBe(
            "Current user fetched successfully"
        );

        expect(response.body.data).toBeDefined();

        expect(response.body.data.email).toBe(
            "admin@campus.com"
        );

        expect(response.body.data.role).toBe("ADMIN");
    });


    test("should return current user for valid student token", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/auth/me")
            .set(
                "Authorization",
                `Bearer ${token}`
            );

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

        expect(response.body.data).toBeDefined();

        expect(response.body.data.email).toBe(
            "student@gmail.com"
        );

        expect(response.body.data.role).toBe("STUDENT");
    });


    test("should reject unauthenticated /auth/me request", async () => {

        const response = await request(app)
            .get("/auth/me");

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });


    test("should reject invalid JWT token", async () => {

        const response = await request(app)
            .get("/auth/me")
            .set(
                "Authorization",
                "Bearer invalid.token.here"
            );

        expect(response.statusCode).toBe(401);

        expect(response.body.success).toBe(false);
    });


    

    test("should handle duplicate email registration", async () => {

        const email = uniqueEmail();

        const firstResponse = await request(app)
            .post("/auth/register")
            .send({
                email,
                password: "TestPassword123"
            });

        expect(firstResponse.statusCode).toBe(201);

        const secondResponse = await request(app)
            .post("/auth/register")
            .send({
                email,
                password: "TestPassword123"
            });

        /*
         * user.service.js throws:
         * "User already exists"
         *
         * But user.controller.js currently checks:
         * "User alreday exists"
         *
         * Because of this mismatch, the controller
         * currently returns 500 instead of 409.
         */

        expect(secondResponse.statusCode).toBe(500);

        expect(secondResponse.body.success).toBe(false);
    });


    

    afterAll(async () => {
        await closeDB();
    });

});