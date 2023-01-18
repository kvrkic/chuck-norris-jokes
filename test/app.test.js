const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const settings = require("../src/settings");
const nodemailer = require("nodemailer");

jest.mock("nodemailer");

describe("Chuck Norris Joke App", () => {
    beforeAll(async () => {
        await mongoose.connect(`${settings.MONGODB_URL}`);
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    describe("GET unprotected routes", () => {
        test("GET /", async () => {
            const response = await request(app).get("/");
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
        });
        test("GET /register", async () => {
            const response = await request(app).get("/register");
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
        });
        test("GET /login", async () => {
            const response = await request(app).get("/login");
            expect(response.status).toBe(200);
            expect(response.headers["content-type"]).toEqual("text/html; charset=utf-8");
        });
    });
    describe("POST requests", () => {
        test("POST /register correct data", async () => {
            const response = await request(app)
                .post("/register")
                .send({
                    firstName: "test",
                    lastName: "testic",
                    email: "test@test.com",
                    password: "testpassword"
                })
                .set("Accept", "application/x-www-form-urlencoded")
                .set("Content-Type", "application/x-www-form-urlencoded")
                expect(response.headers["set-cookie"]).toBeDefined();
                expect(response.headers["set-cookie"][0]).toContain("token=");
        });
        test("POST /register email already in use", async () => {
            const response = await request(app)
                .post("/register")
                .send({
                    firstName: "test",
                    lastName: "testic",
                    email: "test@test.com",
                    password: "testpassword"
                })
                .set("Accept", "application/x-www-form-urlencoded")
                .set("Content-Type", "application/x-www-form-urlencoded")
                expect(response.headers["set-cookie"]).not.toBeDefined();
                expect(response.text).toContain("Email is already in use, please use a different email.");
        });
        test("POST /register error - missing property", async () => {
            const response = await request(app)
                .post("/register")
                .send({
                    //missing lastName
                    firstName: "test",
                    email: "test2@test.com",
                    password: "testpassword"
                })
                .set("Accept", "application/x-www-form-urlencoded")
                .set("Content-Type", "application/x-www-form-urlencoded")
                expect(response.headers["set-cookie"]).not.toBeDefined();
                expect(response.text).toContain("There was an error. Please try again.");
        });
        test("POST /login", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    email: "test@test.com",
                    password: "testpassword"
                })
                .set("Accept", "application/x-www-form-urlencoded")
                .set("Content-Type", "application/x-www-form-urlencoded")
                expect(response.headers["set-cookie"]).toBeDefined();
                expect(response.headers["set-cookie"][0]).toContain("token=");
        });
        test("POST /login wrong email/password", async () => {
            const response = await request(app)
                .post("/login")
                .send({
                    email: "test@test.com",
                    password: "wrongpassword"
                })
                .set("Accept", "application/x-www-form-urlencoded")
                .set("Content-Type", "application/x-www-form-urlencoded")
                expect(response.headers["set-cookie"]).not.toBeDefined();
                expect(response.text).toContain("Wrong email/password");
        });
    });
    describe("Dashboard", () => {
        test("GET /dashboard", async () => {
            nodemailer.createTransport.mockReturnValue({
                sendMail: jest.fn((options, callback) => {
                    callback(null, {response: 'success'});
                })
            });
            const loginRes = await request(app)
                .post("/login")
                .send({email: "test@test.com", password: "testpassword"})
                .set("Accept", "application/x-www-form-urlencoded")
                .set("Content-Type", "application/x-www-form-urlencoded");
            let token = loginRes.headers["set-cookie"][0];
            const res = await request(app)
                .get("/dashboard")
                .set("Cookie", `${token}`)
                .expect(200);
                expect(res.text).toContain("Email sent to: ");
                expect(nodemailer.createTransport().sendMail).toHaveBeenCalled();
        });
        test("GET /dashboard without authorization - redirect to login", async () => {
            const response = await request(app)
                .get("/dashboard")
                .expect(302); //statusCode = 302 - redirect
                expect(response.header.location).toContain("/login");
        });
    });
});