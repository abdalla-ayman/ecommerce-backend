const express = require("express");
const Product = require("../models/product");
const fs = require("fs/promises");
const upload = require("../multer");
const path = require("path");
const OnlyAdmin = require("../middlewares/OnlyAdmin");
require("dotenv").config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const category = req.headers.category || null;
    const products = await Product.find({ category });
    return res.json(products);
  } catch (error) {
    console.log(error);
  }
});

router.post("/create", OnlyAdmin, upload, async (req, res) => {
  try {
    const { name, price, category } = req.body;
    const { filename: imgURL } = req.file;
    const product = await Product.create({
      name,
      price,
      category,
      imgURL,
    });
    if (product) {
      return res.json({ message: "Product Created" });
    } else {
      console.log("huh?");
      return res.status(500).json({ message: "Something Went Wrong" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.delete("/", OnlyAdmin, async (req, res) => {
  try {
    const { id: _id } = req.headers;
    const deletedProduct = await Product.findByIdAndDelete({ _id });
    if (deletedProduct) {
      await fs.unlink(
        path.join(__dirname, "..", "images", deletedProduct.imgURL)
      );
      return res.json({ message: "Product Deleted" });
    } else {
      return res.status(400).json({ message: "Product Dose Not Exist" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.delete("/all", OnlyAdmin, async (req, res) => {
  try {
    const products = await Product.find();
    await Product.deleteMany();
    products.map(async (product) => {
      await fs.unlink(path.join(__dirname, "..", "images", product.imgURL));
    });

    return res.json({ message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

module.exports = router;
