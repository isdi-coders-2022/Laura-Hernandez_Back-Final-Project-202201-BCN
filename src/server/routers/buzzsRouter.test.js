require("dotenv").config();
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");
const request = require("supertest");
const connectToDataBase = require("../../db/index");
const app = require("..");
const Buzz = require("../../db/models/Buzz");
const User = require("../../db/models/User");

let mongoServer;
let userToken;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const connectionString = mongoServer.getUri();

  await connectToDataBase(connectionString);
});

beforeEach(async () => {
  const laura = await User.create({
    name: "Laura",
    username: "Laura0",
    password: "$2b$10$dMTNK.KOdxL0WAa5v57J4eaRc/1HUGSmr5KSPC4PT17z.HqIOtoHK",
  });

  await Buzz.create({
    comments: [],
    author: laura.id,
    text: "Madonna is writting a message",
  });

  await Buzz.create({
    comments: [],
    author: laura.id,
    text: "Janis is writting a message",
  });

  const { body } = await request(app).post("/users/login").send({
    username: "Laura0",
    password: "Laura1234",
  });
  userToken = body.token;
});

afterEach(async () => {
  await Buzz.deleteMany({});
  await User.deleteMany({});
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
  describe("When it receives a DELETE request with a buzz id, and a correct token", () => {
    test("Then it should respond with a 200 status code", async () => {
      const { body } = await request(app).get("/buzzs/").expect(200);

      await request(app)
        .delete(`/buzzs/${body.buzzs[0].id}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
    });
  });

  describe("When it receives a DELETE request with a incorrect id", () => {
    test("Then it should respond with a 400 status code", async () => {
      const noId = "12345";

      await request(app)
        .delete(`/buzzs/${noId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(400);
    });
  });

  describe("When it receives a DELETE request with a nonexistent id", () => {
    test("Then it should respond with a 404 status code", async () => {
      const noId = "622f3ee1fdb8a63d5055a402";

      await request(app)
        .delete(`/buzzs/${noId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(404);
    });
  });

  describe("When it receives a DELETE request with an invalid token", () => {
    test("Then it should respond with a 401 status code", async () => {
      const noId = "622f3ee1fdb8a63d5055a402";

      await request(app)
        .delete(`/buzzs/${noId}`)
        .set("Authorization", `Bearer invalidtoken`)
        .expect(401);
    });
  });

  describe("When it receives a DELETE request without token", () => {
    test("Then it should respond with a 401 status code", async () => {
      const noId = "622f3ee1fdb8a63d5055a402";

      await request(app).delete(`/buzzs/${noId}`).expect(401);
    });
  });
});

describe("Given a /buzzs/new endpoint", () => {
  describe("When it receives a POST request with the buzz data", () => {
    test("Then it should respond with a 201 status code", async () => {
      const dataBuzz = {
        topic: "Pulp Fiction",
        text: "That's thirty minutes away. I'll be there in ten.",
      };

      await request(app)
        .post("/buzzs/new ")
        .set("Authorization", `Bearer ${userToken}`)
        .send(dataBuzz)
        .expect(201);
    });
  });
});

describe("Given a /buzzs/:id/comment endpoint", () => {
  describe("When it receives a PUT request with the buzz data comment", () => {
    test("Then it should respond with a 200 status code", async () => {
      const dataBuzzComment = {
        topic: "Pulp Fiction",
        text: "That's thirty minutes away. I'll be there in ten.",
      };
      const { body } = await request(app).get("/buzzs/").expect(200);

      await request(app)
        .put(`/buzzs/${body.buzzs[0].id}/comment `)
        .set("Authorization", `Bearer ${userToken}`)
        .send(dataBuzzComment)
        .expect(200);
    });
  });
});

describe("Given a /users/all endpoint", () => {
  describe("When it receives a GET request with the ", () => {
    test("Then it should respond with a 200 status code", async () => {
      const { body } = await request(app)
        .get("/users/all")
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);

      expect(body).toHaveProperty("users");
    });
  });
});

describe("Given a /buzzs/:id/like endpoint", () => {
  describe("When it receives a PATCH request an id as params", () => {
    test("Then it should respond with a 200 status code", async () => {
      const { body } = await request(app).get("/buzzs/").expect(200);

      await request(app)
        .patch(`/buzzs/${body.buzzs[0].id}/like `)
        .set("Authorization", `Bearer ${userToken}`)
        .expect(200);
    });
  });
});
