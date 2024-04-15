const express = require("express");
const router = express.Router();
const CartModel = require("../models/carts.model"); // Importa el modelo de carritos
const ProductModel = require("../models/products.model"); // Importa el modelo de productos

// Endpoint para obtener un carrito por su ID
router.get("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    // Buscar el carrito por su ID y traer los productos completos mediante "populate"
    const cart = await CartModel.findById(cartId).populate(
      "products.productId"
    );

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    return res.json(cart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Endpoint para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    // Crear un nuevo carrito vacío
    const newCart = await CartModel.create({ products: [] });

    return res.status(201).json(newCart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Endpoint para agregar un producto al carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    // Buscar el carrito por su ID
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Agregar el producto al carrito con la cantidad especificada
    cart.products.push({ productId, quantity });
    await cart.save();

    return res.json({ message: "Producto agregado al carrito exitosamente" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});
//-----------------------//

// Endpoint para eliminar un producto del carrito por su ID
router.delete("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;

  try {
    // Buscar el carrito por su ID
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Eliminar el producto del carrito por su ID
    cart.products = cart.products.filter(
      (product) => product.productId.toString() !== productId
    );
    await cart.save();

    return res.json({ message: "Producto eliminado del carrito exitosamente" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Endpoint para actualizar el carrito con un arreglo de productos
router.put("/:cid", async (req, res) => {
  const cartId = req.params.cid;
  const { products } = req.body;

  try {
    // Buscar el carrito por su ID y actualizar los productos
    const updatedCart = await CartModel.findByIdAndUpdate(
      cartId,
      { products },
      { new: true } // Devuelve el carrito actualizado
    );

    if (!updatedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    return res.json(updatedCart);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Endpoint para actualizar la cantidad de ejemplares de un producto en el carrito
router.put("/:cid/products/:pid", async (req, res) => {
  const cartId = req.params.cid;
  const productId = req.params.pid;
  const { quantity } = req.body;

  try {
    // Buscar el carrito por su ID
    const cart = await CartModel.findById(cartId);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    // Actualizar la cantidad de ejemplares del producto
    const productIndex = cart.products.findIndex(
      (product) => product.productId.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = quantity;
      await cart.save();
    }

    return res.json({
      message: "Cantidad de ejemplares actualizada exitosamente",
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Endpoint para eliminar todos los productos del carrito
router.delete("/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    // Buscar el carrito por su ID y eliminar todos los productos
    const deletedCart = await CartModel.findByIdAndDelete(cartId);

    if (!deletedCart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    return res.json({ message: "Carrito eliminado exitosamente" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
