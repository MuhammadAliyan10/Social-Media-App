const express = require("express");
require("dotenv").config();
require("./DataBase/connect.js");
const app = express();
require("dotenv").config();
const port = 3000 || process.env.PORT;
const userRouter = require("./Routers/User.js");
const postRouter = require("./Routers/Post.js");
const reviewRouter = require("./Routers/Review.js");
const cors = require("cors");
const bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.options("*", cors());

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/review", reviewRouter);

app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
