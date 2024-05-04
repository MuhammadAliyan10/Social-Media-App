const jwt = require("jsonwebtoken");
const User = require("../Models/User.js");
require("dotenv").config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    if (!token) {
      throw new Error("Authorization failed. No token found.");
    }

    //! Verify Token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return console.log("Authorization failed");
    }

    const user = await User.findOne({ _id: decoded.userID });
    if (!user) {
      throw new Error("Authorization failed. No user found.");
    }
    req.user = user;
    req.token = token;

    next();
  } catch (err) {
    console.error(err);
    res.status(401).send({ error: "Authorization failed. Server error." });
  }
};
module.exports = auth;
