import request from "supertest";
import app from "../../app.js";

let adminToken;
let studentToken;

export const getAdminToken = async () => {

    if (adminToken) {
        return adminToken;
    }

    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "admin@campus.com",
            password: "admin123"
        });

    if (response.statusCode !== 200) {
        throw new Error("Admin login failed during testing");
    }

    adminToken = response.body.data.token;

    return adminToken;
};

export const getStudentToken = async () => {

    if (studentToken) {
        return studentToken;
    }

    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "student@gmail.com",
            password: "student123"
        });

    if (response.statusCode !== 200) {
        throw new Error("Student login failed during testing");
    }

    studentToken = response.body.data.token;

    return studentToken;
};