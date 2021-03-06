require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { notFoundError, generalError } = require("../middlewares/errors");
const buzzsRouter = require("./routers/buzzsRouter");
const usersRouters = require("./routers/usersRouter");

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(helmet());
app.use(express.json());
app.use("/users", usersRouters);
app.use("/buzzs", buzzsRouter);

app.use(notFoundError);
app.use(generalError);

module.exports = app;
