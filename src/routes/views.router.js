const { Router } = require("express");
const ProductModel = require("../models/products.model");
const productManager = require("../dao/dbManagers/productManager");
const User = require("../models/user.model");

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

/// --- users -----//

router.get("/users", async (req, res) => {
  const userManager = req.app.get("userManager");
  const users = await userManager.getAll();
  console.log(users);
  res.render("index", {
    title: "Users Manager",
    users,
    scripts: ["index.js"],
  });
});

router.get("/users/create", async (req, res) => {
  res.render("create-user", {
    title: "Crear usuario",
    scripts: ["create-user.js"],
  });
});

// ---- sessions -------//

router.get("/", (req, res) => {
  const isLoggedIn = ![null, undefined].includes(req.session.user);

  res.render("index", {
    title: "Home",
    isLoggedIn,
    isNotLoggedIn: !isLoggedIn,
  });
});

router.get("/login", (_, res) => {
  // TODO: agregar middleware, sólo se puede acceder si no está logueado
  res.render("login", {
    title: "Login",
  });
});

router.get("/register", (_, res) => {
  // TODO: agregar middleware, sólo se puede acceder si no está logueado
  res.render("register", {
    title: "Register",
  });
});

router.get("/profile", async (req, res) => {
  // TODO: agregar middleware, sólo se puede acceder si está logueado

  const idFromSession = req.session.user._id;

  const user = await User.findOne({ _id: idFromSession });

  res.render("profile", {
    title: "My profile",
    user: {
      name: user.name,
      lastName: user.lastName,
      age: user.age,
      email: user.email,
    },
  });
});

module.exports = router;
