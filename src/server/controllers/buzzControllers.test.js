const jwt = require("jsonwebtoken");
const Buzz = require("../../db/models/Buzz");
const { incrementLikes, addComment } = require("./buzzControllers");

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

describe("Given an addComment controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives an existing id to add a comment to", () => {
    test("Then it should call method json with updated buzz", async () => {
      const mockRequest = () => {
        const request = {};
        request.params = jest.fn().mockReturnValue({
          id: "12345",
        });
        request.body = jest
          .fn()
          .mockReturnValue({ text: "Test buzz comment", topic: "general" });
        request.header = jest.fn().mockReturnValue("Bearer token");
        return request;
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();
      const buzz = {
        comments: [],
        save: jest.fn(),
      };

      const author = { id: "623245decaa7d69f96f10a95" };
      const addedComment = { id: "623245decaa7d69f96f10a66" };
      Buzz.findById = jest.fn().mockResolvedValue(buzz);
      jwt.decode = jest.fn().mockResolvedValue(author);
      Buzz.create = jest.fn().mockResolvedValue(addedComment);

      await addComment(mockRequest(), res, next);

      expect(Buzz.findById).toHaveBeenCalled();
      expect(Buzz.create).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ buzz });
    });
  });

  describe("When it receives an non existing id to add a comment to", () => {
    test("Then it should return a 404", async () => {
      const mockRequest = () => {
        const request = {};
        request.params = jest.fn().mockReturnValue({
          id: "12345",
        });
        return request;
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      Buzz.findById = jest.fn().mockResolvedValue(null);
      await addComment(mockRequest(), res, next);

      const error = new Error("Buzz not found");
      error.code = 404;

      expect(Buzz.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe("When it receives an incorrect id to add a comment to", () => {
    test("Then it should return a 400", async () => {
      const mockRequest = () => {
        const request = {};
        request.params = jest.fn().mockReturnValue({
          id: "12345",
        });
        return request;
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      const invalidIdError = new Error("Invalid id");
      invalidIdError.code = 400;

      Buzz.findById = jest.fn().mockRejectedValue(invalidIdError);
      await addComment(mockRequest(), res, next);

      expect(Buzz.findById).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(invalidIdError);
    });
  });
});
