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

  await Buzz.create({
    comments: [],
    author: "Madonna",
    text: "Madonna is writting a message",
  });
});

afterAll(async () => {
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
