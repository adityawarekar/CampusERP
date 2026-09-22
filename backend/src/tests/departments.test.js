import request from "supertest";
import app from "../app.js";
import { closeDB } from "../config/db.js";
import { getAdminToken } from "./helpers/auth.helper.js";

describe("GET /departments", () => {

    test("should return all departments", async () => {

        const token = await getAdminToken();

        const response = await request(app)
            .get("/departments")
            .set("Authorization", `Bearer ${token}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);

    });

    afterAll(async () => {

        await closeDB();

    });

});