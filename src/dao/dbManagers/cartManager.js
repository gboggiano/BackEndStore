const Cart = require("../../models/carts.model");

async function createCart() {
  try {
    const newCart = new Cart();
    await newCart.save();
    return newCart;
  } catch (error) {
    // Manejo de errores
    console.error("Error al crear el carrito:", error);
    throw error;
  }
}

async function addToCart(cartId, productId) {
  try {
    const cart = await Cart.findById(cartId);
    cart.products.push(productId);
    await cart.save();
    return cart;
  } catch (error) {
    // Manejo de errores
    console.error("Error al agregar el producto al carrito:", error);
    throw error;
  }
}

async function updateProductQuantity(cartId, productId, newQuantity) {
  try {
    const cart = await Cart.findById(cartId);
    const productIndex = cart.products.findIndex(
      (id) => id.toString() === productId
    );
    if (productIndex !== -1) {
      cart.products[productIndex].quantity = newQuantity; // Asume que hay una propiedad "quantity" en el modelo de productos
      await cart.save();
    }
    return cart;
  } catch (error) {
    // Manejo de errores
    console.error(
      "Error al actualizar la cantidad del producto en el carrito:",
      error
    );
    throw error;
  }
}

async function removeProductFromCart(cartId, productId) {
  try {
    const cart = await Cart.findById(cartId);
    cart.products = cart.products.filter((id) => id.toString() !== productId);
    await cart.save();
    return cart;
  } catch (error) {
    // Manejo de errores
    console.error("Error al eliminar el producto del carrito:", error);
    throw error;
  }
}

async function getCartWithProducts(cartId) {
  try {
    const cart = await Cart.findById(cartId).populate("products");
    return cart;
  } catch (error) {
    // Manejo de errores
    console.error("Error al obtener el carrito con productos:", error);
    throw error;
  }
}

module.exports = {
  createCart,
  addToCart,
  updateProductQuantity,
  removeProductFromCart,
  getCartWithProducts,
};
