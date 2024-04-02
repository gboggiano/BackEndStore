const { Router } = require("express");
const { Products } = require("../models");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Products.find({});

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    const result = await Products.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = router;
