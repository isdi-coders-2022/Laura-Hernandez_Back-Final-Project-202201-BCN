const bcrypt = require("bcrypt");

const salt = 10;
const encrypt = async (inputString) => bcrypt.hash(inputString, salt);

module.exports = encrypt;
