require("dotenv").config();
const debug = require("debug")("skybuzz:root");
const connectToDataBase = require("./db");
const app = require("./server/index");
const serverUp = require("./server/serverUp");

const dataBaseString = process.env.MONGODB_URI;
const port = process.env.PORT || 4005;

(async () => {
  try {
    await connectToDataBase(dataBaseString);
    await serverUp(port, app);
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
})();
