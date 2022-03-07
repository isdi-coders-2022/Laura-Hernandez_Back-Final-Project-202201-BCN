require("dotenv").config();
const debug = require("debug")("skybuzz:root");
const app = require("./server/index");
const serverUp = require("./server/serverUp");

const port = process.env.PORT || 6000;

(async () => {
  try {
    await serverUp(port, app);
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
})();
