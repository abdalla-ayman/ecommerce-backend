const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
require("dotenv").config();
const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    console.log(password, user);
    const dosePasswordsMatch = await bcrypt.compare(password, user.password);
    if (dosePasswordsMatch) {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_KEY);
      return res.json({ token, user, message: "User LoggedIn" });
    } else {
      return res.status(400).json({ message: "Incorrect Password" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/signup", async (req, res) => {
  try {
    const { firstname, lastname, password, email } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword);
    const newUser = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    return res.json({ user: newUser, message: "User Created" });
  } catch (error) {
    if (error.code == 11000) {
      return res.status(400).json({ message: "Used Email" });
    }
  }
});

module.exports = router;
