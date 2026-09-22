import request from "supertest";
import app from "../../app.js";

export const getAdminToken = async () => {

    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "admin@campus.com",
            password: "admin123"
        });

    if (response.statusCode !== 200) {
        throw new Error("Admin login failed during testing");
    }

    return response.body.data.token;
};

export const getStudentToken = async () => {

    const response = await request(app)
        .post("/auth/login")
        .send({
            email: "student@gmail.com",
            password: "student123"
        });

    if (response.statusCode !== 200) {
        throw new Error("Student login failed during testing");
    }

    return response.body.data.token;
};