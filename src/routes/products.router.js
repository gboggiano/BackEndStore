// products.router.js

const express = require("express");
const router = express.Router();
const ProductManager = require("../deliveryIIMod"); // Asegúrate de que la ruta sea correcta

const filename = `${__dirname}/../../assets/products.txt`;
const productmanager = new ProductManager(filename);

// Ruta para obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    const prod = await productmanager.getProducts();

    if (limit) {
      const prodLimit = prod.slice(0, limit);
      res.json(prodLimit);
    } else {
      res.json(prod);
    }
  } catch (err) {
    res.status(500).json({ error: "Cannot get products" });
  }
});

// Ruta para obtener un producto por ID
router.get("/:uid", async (req, res) => {
  try {
    const produ = await productmanager.getProductsByID(req.params.uid);

    if (!produ) {
      console.log(`User with ID: ${req.params.uid} does not exist`);
    }

    res.json(produ);
  } catch (error) {
    console.log(`Error getting product with ID: ${req.params.uid}`);
    res.status(500).json({ error: "Cannot get product by ID" });
  }
});

// Ruta para agregar un producto por ID

router.post("/products", async (req, res) => {
  try {
    // El producto se enviará en el cuerpo de la solicitud
    const newProduct = req.body;
    const addedProduct = await productmanager.addProduct(newProduct);

    res.status(201).json(addedProduct); // 201 significa "Created"
  } catch (error) {
    res.status(500).json({ error: "No se pudo agregar el producto" });
  }
});

module.exports = router;
