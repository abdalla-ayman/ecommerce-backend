const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRoute = require("./routes/user");
const ProductRoute = require("./routes/product");
const CartRoute = require("./routes/cart");
const isAuthorized = require("./middlewares/AuthMiddleware");
const path = require("path");
const authorize = require("./middlewares/Authorize");
require("dotenv").config();

const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DATA_BASE_URL, (error) => {
  console.log(process.env.DATA_BASE_URL)
  if (error) console.log(error);
  else console.log("connected to the database");
});


app.use(isAuthorized);
app.use("/user", UserRoute);
app.use("/product", ProductRoute);
app.use("/cart", authorize, CartRoute);
app.get("/validate-token", authorize, (req, res) => {
  if (req.user) {
    req.user.password = undefined;
    res.json({ user: req.user });
  } else {
    res.status(401).json({ message: req.tokenStatus || "invalid" });
  }
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(PORT, () =>
  console.log(`-------server is running on port --> ${PORT} ------------`)
);
