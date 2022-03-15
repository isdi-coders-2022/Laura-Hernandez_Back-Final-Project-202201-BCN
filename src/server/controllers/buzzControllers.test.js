const Buzz = require("../../db/models/Buzz");
const { incrementLikes } = require("./buzzControllers");

describe("Given an incrementLike controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives an existing id to increment the prop likes", () => {
    test("Then it should call method json with an empty buzz", async () => {
      const req = {
        params: {
          id: "12345",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const responseUpdateLikes = {
        modifiedCount: 1,
      };

      Buzz.updateOne = jest.fn().mockResolvedValue(responseUpdateLikes);
      await incrementLikes(req, res, next);

      expect(Buzz.updateOne).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("When it receives an nonexisting id to increment the prop likes", () => {
    test("Then it should not call json method", async () => {
      const req = {
        params: {
          id: "12345",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const responseUpdateNotFound = {
        modifiedCount: 0,
      };

      Buzz.updateOne = jest.fn().mockResolvedValue(responseUpdateNotFound);
      await incrementLikes(req, res, next);

      expect(Buzz.updateOne).toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe("When it receives an invalid id to increment the prop likes", () => {
    test("Then it should return an error", async () => {
      const req = {
        params: {
          id: "12345",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const error = new Error("Cast to ObjectId failed ...");

      Buzz.updateOne = jest.fn().mockRejectedValue(error);
      await incrementLikes(req, res, next);

      expect(Buzz.updateOne).toHaveBeenCalled();
    });
  });
});
