const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const authorize = require("../middlewares/AuthMiddleware");
const User = require("../models/user");
require("dotenv").config();
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Incorrect email try to signup" });
    const dosePasswordsMatch = await bcrypt.compare(password, user.password);
    user.password = undefined;
    if (dosePasswordsMatch) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
      return res.json({
        token,
        user,
        message: "User LoggedIn",
      });
    } else {
      return res.status(400).json({ message: "Incorrect password" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, password, email } = req.body;
    if (!firstname || !lastname || !password || !email)
      return res.status(400).json({ message: "missing credentials" });
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    return res.json({ user: newUser, message: "User Created" });
  } catch (error) {
    if (error.code == 11000) {
      return res
        .status(400)
        .json({ message: "This email is already used try diffrent one" });
    }
  }
});

router.delete("/", async (req, res) => {
  try {
    const { id: _id } = req.headers;
    const result = await User.deleteOne({ _id });
    if (result.deletedCount) {
      console.log(result);
      return res.json({ message: "User Deleted" });
    } else {
      return res.status(400).json({ message: "User Dose Not Exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.delete("/all", async (req, res) => {
  try {
    await User.deleteMany();
    return res.json({ message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

module.exports = router;
