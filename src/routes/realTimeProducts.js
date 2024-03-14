const express = require("express");
const router = express.Router();
const ProductManager = require("../deliveryIIMod"); // Asegúrate de que la ruta sea correcta
const { updateProduct, getProducts } = require("../deliveryIIMod");
const filename = `${__dirname}/../../assets/products.txt`;
const productmanager = new ProductManager(filename);

router.get("/", async (req, res) => {
  try {
    const products = await productmanager.getProducts();
    res.render("realTimeProducts", {
      products,
      style: ["landing.css"],
      useWS: true,
      scripts: ["landing.js"],
    }); // Renderiza la vista "home" con la lista de productos
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la lista de productos" });
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);

  await productmanager.addProduct(
    req.body.title,
    req.body.description,
    +req.body.price,
    req.body.thumbnail,
    req.body.code,
    +req.body.stock
  );

  //notification to all clients throught WS that new prod has been added
  req.app.get("ws").emit("newProduct", req.body);

  res.json(req.body);
});

module.exports = router;
