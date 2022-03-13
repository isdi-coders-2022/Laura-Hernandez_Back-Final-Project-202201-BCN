require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectToDataBase = require("../../db/index");
const app = require("..");
const Buzz = require("../../db/models/Buzz");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectToDataBase(connectionString);
});

beforeEach(async () => {
  await Buzz.create({
    comments: [],
    author: "Madonna",
    text: "Madonna is writting a message",
  });
  await Buzz.create({
    comments: [],
    author: "Janis",
    text: "Janis is writting a message",
  });
});

afterEach(async () => {
  await Buzz.deleteMany({});
});

afterAll(() => {
  mongoose.connection.close();
  mongoServer.stop();
});

describe("Given an endpoint /buzzs/", () => {
  describe("When it receives a GET request", () => {
    test("Then it should respond with status 200 and a list of posts messages", async () => {
      const { body } = await request(app).get("/buzzs/").expect(200);

      expect(body).toHaveProperty("buzzs");
    });
  });
});

describe("Given a /buzzs/:id endpoint", () => {
  describe("When it receives a DELETE request with a buzz id", () => {
    test("Then it should respond with a 200 status code", async () => {
      const { body } = await request(app).get("/buzzs/ ").expect(200);

      await request(app).delete(`/buzzs/${body.buzzs[0].id}`).expect(200);
    });
  });

  describe("When it receives a DELETE request with a nonexistent id", () => {
    test("Then it should respond with a 400 status code", async () => {
      const noId = "12345";

      await request(app).delete(`/buzzs/${noId}`).expect(400);
    });
  });
});

describe("Given a /buzzs/new endpoint", () => {
  describe("When it receives a POST request with the buzz data", () => {
    test("Then it should respond with a 201 status code", async () => {
      const dataBuzz = {
        topic: "Pulp Fiction",
        author: "Mr.Wolf",
        text: "That's thirty minutes away. I'll be there in ten.",
      };

      await request(app).post("/buzzs/new ").send(dataBuzz).expect(201);
    });
  });
});
