const express = require("express");
const router = express.Router();
// const CartModel = require("../models/carts.model"); // Importa el modelo de carritos
// const ProductModel = require("../models/products.model"); // Importa el modelo de productos
const cartManager = require("../dao/dbManagers/cartManager");

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Agregar un producto al carrito
router.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.addToCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

// Actualizar la cantidad de ejemplares de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { newQuantity } = req.body;
  try {
    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      newQuantity
    );
    res.status(200).json(updatedCart);
  } catch (error) {
    res.status(500).json({
      error: "Error al actualizar la cantidad del producto en el carrito",
    });
  }
});

// Eliminar un producto del carrito
router.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const updatedCart = await cartManager.removeProductFromCart(cid, pid);
    res.status(200).json(updatedCart);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar el producto del carrito" });
  }
});

// Eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    // Implementa la lógica para eliminar todos los productos del carrito
    // ...
    res.status(200).json({ message: "Carrito vaciado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al eliminar todos los productos del carrito" });
  }
});

// Obtener un carrito específico con productos completos (usando "populate")
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const cartWithProducts = await cartManager.getCartWithProducts(cid);
    res.status(200).json(cartWithProducts);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al obtener el carrito con productos" });
  }
});

module.exports = router;
