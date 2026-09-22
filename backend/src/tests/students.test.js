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

    afterAll(async () => {

        await closeDB();

    });

});