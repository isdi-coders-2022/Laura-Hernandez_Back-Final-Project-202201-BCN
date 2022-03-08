const Buzz = require("../../db/models/Buzz");
const { getAllBuzzs } = require("./buzzsControllers");

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
