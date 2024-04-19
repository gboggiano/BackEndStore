// viewcart.router.js

const express = require("express");
const router = express.Router();
const cartManager = require("./../dao/dbManagers/cartManager"); // Asegúrate de que la ruta sea correcta

// Ruta para visualizar un carrito específico
router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    // Implementa la lógica para obtener los productos del carrito con el ID cid
    const cartProducts = await cartManager.getCartWithProducts(cid);

    // vista del carrito con los datos obtenidos
    res.render("carts", { cartId: cid, cartProducts });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

module.exports = router;
