require("dotenv").config();
const debug = require("debug")("skybuzz:root");
const app = require("./server/index");

const port = process.env.PORT || 4000;

(async () => {
  try {
    await serverUp(port, app);
  } catch (error) {
    debug(`Error: ${error.message}`);
  }
})();
