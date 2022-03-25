const express = require("express");
const User = require("../models/user");
require("dotenv").config();
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const user = req.user;
    const { cart } = await user.populate("cart.items.item");

    return res.json(cart);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Something Went Wrong" });
  }
});

router.post("/modify", async (req, res) => {
  try {
    const { itemId, quantity } = req.body;
    let user = req.user;
    if (user.cart) {
      let modified = false;
      user.cart.items = user.cart.items.map((i) => {
        if (i.item == itemId) {
          i.quantity += quantity;
          modified = true;
        }
        return i;
      });
      if (!modified) {
        user.cart.items.push({
          item: itemId,
          quantity,
        });
      }
      user.cart.itemsQuantity += quantity;
      await user.save();
      return res.json(user.cart);
    } else {
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

module.exports = router;
