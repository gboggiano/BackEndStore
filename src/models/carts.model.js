const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Referencia al modelo de usuarios (si hay uno)
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "products" }, // Referencia al modelo de productos
        quantity: { type: Number, required: true, min: 1 },
        // Otros detalles del producto si los necesitas
      },
    ],
    active: { type: Boolean, default: true }, // Indica si el carrito está activo
    modifiedOn: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
