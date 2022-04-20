const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();

const isAuthorized = async (req, res, next) => {
  try {
    const { token } = req.headers;

    req.user = null;
    if (!token) {
      req.tokenStatus = "missing";
      return next();
    }
    const decodedToken = jwt.decode(token);

    if (!decodedToken) return next();
    const user = await User.findById(decodedToken._id);
    if (!user) {
      return next();
    } else {
      req.user = user;
      return next();
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json("something went wrong!");
  }
};

module.exports = isAuthorized;
