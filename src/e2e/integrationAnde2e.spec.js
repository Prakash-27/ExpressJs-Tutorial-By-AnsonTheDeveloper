import request from "supertest";
import mongoose from "mongoose";
import { createApp } from "../createApp.mjs";
// import express from "express";

// ---------------------------------------------------------------------------------------------------------------------------
// Demo: 
// const app = express();

// app.get("/hello", (req, res) => res.status(200).send({}));

// describe("hello endpoint", () => {
//     it("get /hello and expect 200", async () => {
//         const response = await request(app).get("/hello");
//         expect(response.statusCode).toBe(200);
//         expect(response.body).toStrictEqual({ msg: "invalid" });
//     });
// });
// ---------------------------------------------------------------------------------------------------------------------------

describe("/api/auth", () => {
    let app;
    beforeAll(() => {
       // connecting to MongoDB database.
       mongoose
         .connect("mongodb://localhost/express_tutorial_text") 
         .then(() => console.log("Connected to Test Database"))
         .catch((err) => console.log(`Error: ${err}`));  
         
        app = createApp();
    });

    it("should return 401 when not logged in", async () => {
        const response = await request(app).get("/api/auth/status");
        expect(response.statusCode).toBe(401);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });
});