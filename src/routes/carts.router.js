// carts.router.js

const express = require("express");
const router = express.Router();

// Simularemos una base de datos de carritos en memoria
const carts = [];

// Ruta para crear un nuevo carrito
router.post("/", (req, res) => {
  const newCart = {
    id: generateUniqueCartId(), // Genera un ID único para el carrito
    products: [], // Inicializa el array de productos vacío
  };

  carts.push(newCart); // Agrega el carrito a la base de datos
  res.status(201).json(newCart); // Devuelve el carrito creado
});

// Ruta para listar productos en un carrito
router.get("/:cid", (req, res) => {
  const cartId = req.params.cid;
  console.log("Requested cart ID:", cartId); // Verifica si el ID se captura correctamente
  const cart = carts.find((c) => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  res.json(cart.products); // Devuelve los productos del carrito
});

// Ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const quantity = 1; // Por ahora, agregamos solo 1 producto por request

  const cart = carts.find((c) => c.id === cartId);

  if (!cart) {
    return res.status(404).json({ message: "Carrito no encontrado" });
  }

  // Verifica si el producto ya existe en el carrito
  const existingProduct = cart.products.find((p) => p.pid === productId);

  if (existingProduct) {
    existingProduct.quantity += quantity; // Incrementa la cantidad
  } else {
    cart.products.push({ pid: productId, quantity }); // Agrega el producto al carrito
  }

  res.status(200).json(cart.products); // Devuelve los productos actualizados
});

// Función para generar un ID único para el carrito
function generateUniqueCartId() {
  // Implementa tu lógica para generar un ID único (puede ser un número o cadena)
  // Por ejemplo, puedes usar un contador o una función hash
  return Math.random().toString(36).substr(2, 9); // Ejemplo: ID aleatorio
}

module.exports = router;
