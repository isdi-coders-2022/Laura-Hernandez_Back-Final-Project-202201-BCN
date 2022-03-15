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
      const buzzToLike = {
        id: "12345",
        topic: "General",
        likes: 0,
        comments: [],
        author: "Jules",
        text: "Some message",
        date: "2022-03-08T18:11:03.390Z",
      };

      Buzz.updateOne = jest.fn().mockResolvedValue(buzzToLike);
      await incrementLikes(req, res, next);

      expect(Buzz.updateOne).toHaveBeenCalled();
    });
  });
});
