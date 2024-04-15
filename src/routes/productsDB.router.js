const { Router } = require("express");
const { Products } = require("../models");

const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await Products.find({});

    return res.json(products);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    const result = await Products.create({
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    });

    res.json(result);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

// Método DELETE para eliminar un producto por su ID
router.delete("/:productId", async (req, res) => {
  const productId = req.params.productId;

  try {
    // Buscar el producto por su ID y eliminarlo
    const deletedProduct = await Products.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json({ message: "Producto eliminado exitosamente" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Método PUT para actualizar un producto por su ID
router.put("/:productId", async (req, res) => {
  const productId = req.params.productId;
  const { title, description, price, thumbnail, code, stock } = req.body;

  try {
    // Buscar el producto por su ID y actualizar sus propiedades
    const updatedProduct = await Products.findByIdAndUpdate(
      productId,
      {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      },
      { new: true } // Devuelve el producto actualizado
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    return res.json(updatedProduct);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

module.exports = router;
