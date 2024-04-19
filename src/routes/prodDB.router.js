// productsRouter.js

const express = require("express");
const router = express.Router();
const ProductManagerdb = require("../dao/dbManagers/productManager");
const productManager = new ProductManagerdb();

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const filters = req.query; // pasar filtros como parámetros de consulta
    const products = await productManager.getAll(filters);
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto por ID
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    await productManager.deleteById(id);
    res.json({ message: "Producto eliminado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const prod = req.body;
    await productManager.addProduct(prod);
    res.json({ message: "Producto agregado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto por ID
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedProduct = req.body; // Suponiendo que envías los datos actualizados del producto en el cuerpo de la solicitud
    await productManager.updateProductById(id, updatedProduct);
    res.json({ message: "Producto actualizado exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productManager.getById(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
    } else {
      res.json(product);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
