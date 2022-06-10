const express = require("express");
const User = require("../models/user");
require("dotenv").config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = req.user;
    let { cart } = await user.populate("cart.items.item");

    return res.json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.post("/modify", async (req, res) => {
  try {
    const { itemId, quantity, action } = req.body;
    let resultQuantity = 0;
    let user = req.user;
    if (user.cart) {
      let modified = false;
      user.cart.items = user.cart.items.filter((i) => {
        if (i.item == itemId) {
          if (action == "replace") {
            resultQuantity = quantity - i.quantity;
            i.quantity = quantity;
          }
          if (action == "update") {
            i.quantity += quantity;
            resultQuantity = quantity;
          }
          modified = true;
          if (action == "delete") {
            user.cart.itemsQuantity -= i.quantity;
            if (user.cart.itemsQuantity < 0) user.cart = null;
          } else {
            user.cart.itemsQuantity += resultQuantity;
            return i;
          }
        } else return i;
      });
      if (!modified && action != "delete") {
        user.cart.items.push({
          item: itemId,
          quantity,
        });
        user.cart.itemsQuantity += quantity;
      }

      await user.save();
      return res.json(user.cart);
    } else if (action != "delete") {
      user.cart = {
        itemsQuantity: quantity,
        items: [
          {
            item: itemId,
            quantity: quantity,
          },
        ],
      };
      await user.save();
      return res.json(user.cart);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.delete("/", async (req, res) => {
  try {
    const user = req.user;
    user.cart = null;
    await user.save();
    return res.json({ message: "Done" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Worng" });
  }
});

router.get("/checkout", async (req, res) => {
  try {
    res.status(400).json({ message: "This service is not available Now" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something Went Worng" });
  }
});

module.exports = router;
