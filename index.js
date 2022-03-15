const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserRoute = require("./routes/user");
const ProductRoute = require("./routes/product");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.DATA_BASE_URL, (error) => {
  if (error) console.log(error);
  else console.log("connected to the database");
});

app.use("/user", UserRoute);
app.use("/product", ProductRoute);

app.listen(PORT, () =>
  console.log(`-------server is running on port --> ${PORT} ------------`)
);
