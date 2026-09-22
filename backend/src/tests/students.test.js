import request from "supertest";
import app from "../app.js";
import { closeDB } from "../config/db.js";
import { getAdminToken, getStudentToken } from "./helpers/auth.helper.js";

describe("POST /students - Authorization", () => {

    test("should reject student from creating a student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .post("/students")
            .set("Authorization", `Bearer ${token}`)
            .send({
                rollNumber: 9999,
                firstName: "Test",
                lastName: "Student",
                email: "teststudent9999@gmail.com",
                phoneNumber: "9999999999",
                departmentId: 1
            });

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });


    test("should allow admin to create a student", async () => {

        const token = await getAdminToken();

        const uniqueRollNumber = Math.floor(Math.random() * 900000) + 100000;

        const response = await request(app)
            .post("/students")
            .set("Authorization", `Bearer ${token}`)
            .send({
                rollNumber: uniqueRollNumber,
                firstName: "Test",
                lastName: "Admin",
                email: `testadmin${uniqueRollNumber}@gmail.com`,
                phoneNumber: "9876543210",
                departmentId: 1
            });
        console.log("CREATE STUDENT RESPONSE:", response.body);
        expect(response.statusCode).toBe(201);
        expect(response.body.success).toBe(true);

    });


    test("should reject invalid student data", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .post("/students")
            .set("Authorization", `Bearer ${token}`)
            .send({
                rollNumber: 999999,
                firstName: "A",
                lastName: "",
                email: "invalid-email",
                phoneNumber: "123",
                departmentId: 1
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
    });

    test("should reject request without authentication", async () => {

        const response = await request(app)
            .post("/students")
            .send({
                rollNumber: 999999,
                firstName: "Test",
                lastName: "User",
                email: "unauth@test.com",
                phoneNumber: "9876543210",
                departmentId: 1
            });

        expect(response.statusCode).toBe(401);
        expect(response.body.success).toBe(false);

    });

    test("should reject student from viewing all students", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/students")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });

    test("should allow student to view their own student record", async () => {
        const token = await getStudentToken();

        const response = await request(app)
            .get("/students/2")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("should reject student from viewing another student's record", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .get("/students/4")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });

    test("should allow admin to view any student record", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/students/4")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });

    test("should reject student from deleting a student", async () => {

        const token = await getStudentToken();

        const response = await request(app)
            .delete("/students/4")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(403);
        expect(response.body.success).toBe(false);

    });
     
    test("should reject student from updating a student", async () => {

    const token = await getStudentToken();

    const response = await request(app)
        .put("/students/4")
        .set("Authorization", `Bearer ${token}`)
        .send({
            rollNumber: 102,
            firstName: "Rahul",
            lastName: "Sharma",
            email: "rahul@campuserp.com",
            phoneNumber: "9876543210",
            departmentId: 2
        });

    expect(response.statusCode).toBe(403);
    expect(response.body.success).toBe(false);

});
    test("should return 404 for non-existent student", async () => {

    const token = await getAdminToken();

    const response = await request(app)
        .get("/students/999999")
        .set("Authorization", `Bearer ${token}`);

    expect(response.statusCode).toBe(404);
    expect(response.body.success).toBe(false);

});



    afterAll(async () => {

        await closeDB();

    });

});