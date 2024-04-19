// products.router.js

const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/fileManagers/deliveryIIMod"); // Asegúrate de que la ruta sea correcta
const {
  updateProduct,
  getProducts,
} = require("../dao/fileManagers/deliveryIIMod");
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

router.post("/", async (req, res) => {
  try {
    // El producto se enviará en el cuerpo de la solicitud
    const newProduct = req.body;
    const addedProduct = await productmanager.addProduct(newProduct);

    res.status(201).json(addedProduct); // 201 significa "Created"
    console.log("producto agregado");
  } catch (error) {
    res.status(500).json({ error: "No se pudo agregar el producto" });
  }
});

// metodo PUT con restricción de ID dentro del mismo metodo

// Ruta para actualizar un producto por su ID
router.put("/:pid", async (req, res) => {
  const productId = req.params.pid; // Obtén el ID del producto desde la URL
  const updateData = req.body; // Datos para actualizar el producto

  try {
    // Actualiza el producto con el ID proporcionado
    const existingProduct = await getProducts(); // Obtén todos los productos
    const productToUpdate = existingProduct.find((p) => p.id === productId);

    if (!productToUpdate) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualiza las propiedades del producto sin modificar el ID
    Object.assign(productToUpdate, updateData);

    // Guarda los cambios en el archivo de productos
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(existingProduct, null, "\t"),
      "utf-8"
    );

    res.status(200).json(productToUpdate); // Devuelve el producto actualizado
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

// router.put("/:id", async (req, res) => {
//   const productId = req.params.id; // Obtén el ID del producto desde la URL
//   const updateData = req.body; // Datos para actualizar el producto

//   try {
//     // Actualiza el producto con el ID proporcionado
//     const updatedProduct = await updateProduct(productId, updateData);

//     if (updatedProduct) {
//       res.status(200).json(updatedProduct); // Devuelve el producto actualizado
//     } else {
//       res.status(404).json({ message: "Producto no encontrado" });
//     }
//   } catch (error) {
//     console.error("Error al actualizar el producto:", error);
//     res.status(500).json({ message: "Error interno del servidor" });
//   }
// });

module.exports = router;
