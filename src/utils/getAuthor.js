const jwt = require("jsonwebtoken");
const debug = require("debug")("skybuzz:utils:getauthor");

const getAuthor = (headerAuth) => {
  debug(headerAuth);

  const userToken = headerAuth.replace("Bearer ", "");
  const payload = jwt.decode(userToken, process.env.JWT_SECRET);
  return payload.id;
};

module.exports = getAuthor;
