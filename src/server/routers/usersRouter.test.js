const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");
const { loginUser, registerUser } = require("../controllers/usersControllers");

jest.mock("../../db/models/User");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Given an loginUser controller", () => {
  describe("When it receives a request with username Rosa0 and the correct password, and the user exists ", () => {
    test("Then it should call method json with the user's token in the receive response", async () => {
      const req = {
        body: { username: "Rosa0", password: "Rosa1234" },
      };

      const user = {
        name: "Rosa",
        username: "Rosa0",
        password:
          "$2b$10$ZZ7dKrL4q2zWFAN8CnCWEOnWPQKQAfjbqvg8yMHnaw4DUXxUQSvae",
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      const userToken = jwt.sign(user, process.env.JWT_SECRET);

      const res = {
        json: jest.fn().mockResolvedValue(userToken),
      };

      await loginUser(req, res);

      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with username Rosa0 and a incorrect password", () => {
    test("Then it should invoke next function with an error", async () => {
      const req = {
        body: { username: "Rosa0", password: "IncorrectPW" },
      };

      const res = {};
      const next = jest.fn();

      const user = {
        name: "Rosa",
        username: "Rosa0",
        password:
          "$2b$10$ZZ7dKrL4q2zWFAN8CnCWEOnWPQKQAfjbqvg8yMHnaw4DUXxUQSvae",
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      const errorWrongPwd = new Error(
        "The password and/or username are not correct"
      );
      errorWrongPwd.code = 401;

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with a non-existent user", () => {
    test("Then it should invoke next function with an error", async () => {
      const req = {
        body: { username: "Nobody", password: "NoPassword" },
      };
      const res = {};
      const next = jest.fn();

      User.findOne = jest.fn().mockResolvedValue(false);

      const error = new Error("The password and/or username are not correct");
      error.code = 401;

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given an registerUser controller", () => {
  describe("When it receives a request with a new username", () => {
    test("Then it should call method json and respond with a 201 status", async () => {
      const req = {
        body: { name: "Rosa", username: "Rosa0", password: "Rosa1234" },
      };
      const res = {
        json: jest.fn(),
        status: jest.fn(),
      };
      const next = jest.fn();
      const user = {
        name: "Rosa",
        username: "Rosa0",
        password:
          "$2b$10$ZZ7dKrL4q2zWFAN8CnCWEOnWPQKQAfjbqvg8yMHnaw4DUXxUQSvae",
      };

      User.findOne = jest.fn().mockResolvedValue(false);
      User.create = jest.fn().mockResolvedValue(user);
      await registerUser(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });
});
