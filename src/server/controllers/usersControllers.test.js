require("dotenv").config();
const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");
const { loginUser, registerUser } = require("./usersControllers");

jest.mock("../../db/models/User");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Given a loginUser controller", () => {
  describe("When it receives a request with username Rosa0 and the correct password, and the user exists in db ", () => {
    test("Then it should call method json with the user's token in the receive response", async () => {
      const req = {
        body: { username: "Laura0", password: "Laura1234" },
      };

      const user = {
        name: "Laura",
        username: "Laura0",
        password:
          "$2b$10$dMTNK.KOdxL0WAa5v57J4eaRc/1HUGSmr5KSPC4PT17z.HqIOtoHK",
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
        body: { username: "Laura0", password: "IncorrectPW" },
      };

      const res = {};
      const next = jest.fn();

      const user = {
        name: "Laura",
        username: "Laura0",
        password:
          "$2b$10$dMTNK.KOdxL0WAa5v57J4eaRc/1HUGSmr5KSPC4PT17z.HqIOtoHK",
      };

      User.findOne = jest.fn().mockResolvedValue(user);

      const errorWrongPwd = new Error(
        chalk.redBright("The password and/or username are not correct")
      );
      errorWrongPwd.code = 401;

      await loginUser(req, res, next);

      expect(next).toHaveBeenCalledWith(errorWrongPwd);
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

      const error = new Error(
        chalk.redBright("The password and/or username are not correct")
      );
      error.code = 401;

      await loginUser(req, res, next);

      expect(User.findOne).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given a Register controller", () => {
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

  describe("When it receives a request with a username that already exists", () => {
    test("Then it should call next method with a 400 status", async () => {
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
      const errorWPW = new Error(
        chalk.redBright(`Something went wrong or username Rosa0 already exists`)
      );
      errorWPW.code = 400;

      User.findOne = jest.fn().mockResolvedValue(user);
      await registerUser(req, res, next);

      expect(next).toHaveBeenCalledWith(errorWPW);
    });
  });
});
