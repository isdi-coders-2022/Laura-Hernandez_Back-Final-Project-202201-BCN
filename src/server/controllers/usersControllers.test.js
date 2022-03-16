const chalk = require("chalk");
const jwt = require("jsonwebtoken");
const User = require("../../db/models/User");
const { loginUser } = require("./usersControllers");

jest.mock("../../db/models/User");

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Given an loginUser controller", () => {
  describe("When it receives a request with username Rosa0 and the correct password, and the user exists ", () => {
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
