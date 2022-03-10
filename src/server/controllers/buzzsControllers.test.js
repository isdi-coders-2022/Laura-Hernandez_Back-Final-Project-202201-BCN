const Buzz = require("../../db/models/Buzz");
const { getAllBuzzs, deleteBuzz } = require("./buzzsControllers");

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
          category: "General",
          likes: 0,
          comments: [],
          author: "Madonna",
          text: "Madonna is writting a message",
          date: "2022-03-08T18:11:03.390Z",
        },
      ];

      Buzz.find = jest.fn().mockResolvedValue(buzzs);

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
        category: "General",
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
});
