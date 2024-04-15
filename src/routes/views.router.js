const { Router } = require("express");
const ProductModel = require("../models/products.model");

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

module.exports = router;

// router.get("/products", async (req, res) => {
//   const page = req.query.page || 1;
//   const products = await ProductModel.paginate(
//     {},
//     { limit: 10, page, lean: true }
//   );
//   console.log(products);

//   res.render("products", {
//     title: "Products",
//     products,
//   });
// });

module.exports = router;
