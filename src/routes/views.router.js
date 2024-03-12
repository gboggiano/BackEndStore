const { Router } = require("express");
const express = require("express");
const ProductManager = require("../deliveryIIMod"); // Asegúrate de que la ruta sea correcta
const { updateProduct, getProducts } = require("../deliveryIIMod");
const filename = `${__dirname}/../../assets/products.txt`;
const productmanager = new ProductManager(filename);

const router = Router();

//------------------------------------ testing handlebars---------------------
router.get("/handlebarstest", (req, res) => {
  res.render("index", {
    title: "pagina test routes",
    name: "tester",
  });
});

//--- testing endpoints---------------------

router.get("/", async (req, res) => {
  try {
    const products = await productmanager.getProducts();
    res.render("home", { products, style: ["landing.css"] }); // Renderiza la vista "home" con la lista de productos
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la lista de productos" });
  }
});

module.exports = router;
