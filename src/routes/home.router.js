const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/fileManagers/deliveryIIMod"); // Asegúrate de que la ruta sea correcta
const {
  updateProduct,
  getProducts,
} = require("../dao/fileManagers/deliveryIIMod");
const filename = `${__dirname}/../../assets/products.txt`;
const productmanager = new ProductManager(filename);

router.get("/", async (req, res) => {
  try {
    const products = await productmanager.getProducts();
    res.render("home", {
      products,
      style: ["landing.css"],
      useWS: true,
      scripts: ["landing.js"],
    }); // Renderiza la vista "home" con la lista de productos
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la lista de productos" });
  }
});

module.exports = router;
