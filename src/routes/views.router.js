const { Router } = require("express");
const ProductModel = require("../models/products.model");
const productManager = require("../dao/dbManagers/productManager");

const router = Router();

router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort, query } = req.query;

  // objeto para almacenar las opciones de búsqueda
  const searchOptions = {};

  // límite de elementos solicitados
  const options = { limit: parseInt(limit), page: parseInt(page), lean: true };

  // filtro de búsqueda general (si se proporciona)
  if (query) {
    searchOptions.$text = { $search: query };
  }

  // ordenamiento por precio
  if (sort === "asc" || sort === "desc") {
    options.sort = { price: sort === "asc" ? 1 : -1 };
  }

  try {
    const products = await ProductModel.paginate(searchOptions, options);
    console.log(products);

    res.render("products", {
      title: "Products",
      products,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

/// --- renderizado del metodo 1

router.get("/products/deta/:id", async (req, res) => {
  try {
    const id = req.params.id;
    console.log(id);
    const product = await productManager.getById(id);
    if (!product) {
      res.status(404).json({ message: "Producto no encontrado" });
    } else {
      res.render("products", {
        title: "Detalles del Producto",
        products: [product], // Renderiza solo el producto específico
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
