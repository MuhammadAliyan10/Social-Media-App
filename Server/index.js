const express = require('express');
const cors = require('cors');
require('./DataBase/connect.js');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000; // prioritize process.env.PORT
const userRouter = require("./Routers/User.js");
const postRouter = require("./Routers/Post.js");
const reviewRouter = require("./Routers/Review.js");
const bodyParser = require('body-parser');

app.use(cors()); // call cors function
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/user", userRouter);
app.use("/post", postRouter);
app.use('/review', reviewRouter);

app.get("/", (req, res) => {
    res.json({ "message": "Port is working" });
});

app.listen(port, () => {
    console.log(`App is listening on ${port}`);
});
