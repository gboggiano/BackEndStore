const express = require("express");
const router = express.Router();
const ProductManager = require("../dao/fileManagers/deliveryIIMod"); // Asegúrate de que la ruta sea correcta
const {
  updateProduct,
  getProducts,
} = require("../dao/fileManagers/deliveryIIMod");
const filename = `${__dirname}/../../assets/products.txt`;
const productmanager = new ProductManager(filename);

router.get("/", async (req, res) => {
  try {
    const products = await productmanager.getProducts();
    res.render("realTimeProducts", {
      products,
      style: ["landing.css"],
      useWS: true,
      scripts: ["landing.js"],
    }); // Renderiza la vista "home" con la lista de productos
  } catch (error) {
    res.status(500).json({ error: "No se pudo obtener la lista de productos" });
  }
});

// router.post("/", async (req, res) => {
//   console.log(req.body);

//   await productmanager.addProduct(
//     req.body.title,
//     req.body.description,
//     +req.body.price,
//     req.body.thumbnail,
//     req.body.code,
//     +req.body.stock
//   );

//   //notification to all clients throught WS that new prod has been added
//   req.app.get("ws").emit("newProduct", req.body);

//   res.json(req.body);
// });

router.post("/", async (req, res) => {
  try {
    const newProduct = req.body; // El objeto product contiene todos los campos necesarios

    // Validación de campos obligatorios
    const { title, description, price, thumbnail, code, stock } = newProduct;
    if (
      !title ||
      !description ||
      !price ||
      !thumbnail ||
      !code ||
      stock === undefined
    ) {
      throw new Error("Campos obligatorios faltantes");
    }

    // Validación de código único
    const existingProduct = await productmanager.getProductsByID(code);
    if (existingProduct) {
      console.log("El código ya existe");
      return res.status(400).json({ error: "El código ya existe" });
    }

    // Asignar ID al producto (alternativa: usar un valor único como ID)
    newProduct.id = Date.now(); // Esto asigna un timestamp como ID único

    // Agregar el producto al final del archivo
    await productmanager.addProduct(newProduct);

    // Notificar a todos los clientes a través de WebSocket
    req.app.get("ws").emit("newProduct", newProduct);

    // Respuesta al cliente
    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error al agregar el producto:", error.message);
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

module.exports = router;
