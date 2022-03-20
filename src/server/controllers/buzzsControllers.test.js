const Buzz = require("../../db/models/Buzz");
const { notFoundError } = require("../../middlewares/errors");
const {
  getAllBuzzs,
  deleteBuzz,
  addBuzz,
  detailBuzz,
} = require("./buzzsControllers");

describe("Given an getAllBuzzs controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a response", () => {
    test("Then it should call method json with a list of posted messages in the receive response", async () => {
      const res = {
        json: jest.fn(),
      };

      const buzzs = [
        {
          topic: "General",
          likes: 0,
          comments: [],
          author: "Madonna",
          text: "Madonna is writting a message",
          date: "2022-03-08T18:11:03.390Z",
        },
      ];

      Buzz.find = jest.fn().mockReturnThis();
      Buzz.populate = jest.fn().mockResolvedValue(buzzs);

      await getAllBuzzs(null, res);

      expect(Buzz.find).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ buzzs });
    });
  });
});

describe("Given an deleteBuzz controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives an existing id to delete", () => {
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
      const buzzToDelete = {
        id: "12345",
        topic: "General",
        likes: 0,
        comments: [],
        author: "Madonna",
        text: "Madonna is writting a message",
        date: "2022-03-08T18:11:03.390Z",
      };

      Buzz.findByIdAndRemove = jest.fn().mockResolvedValue(buzzToDelete);

      await deleteBuzz(req, res, next);

      expect(res.json).toHaveBeenCalledWith({});
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("When it receives an invalid id to delete", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        params: {
          id: "gehwwefw",
        },
      };

      const next = jest.fn();
      const error = new Error("Id not valid");

      Buzz.findByIdAndRemove = jest.fn().mockRejectedValue(error);

      await deleteBuzz(req, null, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});

describe("Given an addBuzz controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe("When it receives a bad request to create", () => {
    test("Then it should call next ", async () => {
      const next = jest.fn();

      await addBuzz(null, null, next);

      expect(next).toHaveBeenCalled();
    });
  });
});

describe("Given an detailBuzz controller", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("When it receives a request with an id", () => {
    test("Then it should call method json with the object buzz in the receive response", async () => {
      const req = {
        params: {
          id: "12345",
        },
      };
      const res = {
        json: jest.fn(),
      };
      const next = jest.fn();

      const buzzToGetDetail = {
        id: "12345",
        topic: "General",
        likes: 0,
        comments: [],
        author: "Madonna",
        text: "Madonna is writting a message",
        date: "2022-03-08T18:11:03.390Z",
      };

      Buzz.findById = jest.fn().mockResolvedValue(buzzToGetDetail);

      await detailBuzz(req, res, next);

      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("When it receives a request with an invalid id", () => {
    test("Then it should call next with an error", async () => {
      const req = {
        params: {
          id: "ABCDE",
        },
      };

      const next = jest.fn();
      const error = new Error("Id not valid");

      Buzz.findById = jest.fn().mockResolvedValue(error);
      await detailBuzz(req, null, next);

      expect(next).toHaveBeenCalled();
    });
  });

  describe("When it receives a request with an unexistant id", () => {
    test("Then it should call next with 404", async () => {
      const req = {
        params: {
          id: "622e7cefb077ebdf25a44af8",
        },
      };

      const next = jest.fn();

      Buzz.findById = jest.fn().mockResolvedValue(null);
      await detailBuzz(req, null, next);

      expect(next).toHaveBeenCalledWith(notFoundError);
    });
  });
});
