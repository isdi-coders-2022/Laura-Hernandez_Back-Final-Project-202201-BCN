const User = require("../../db/models/User");
const { registerUser } = require("../controllers/usersControllers");

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
