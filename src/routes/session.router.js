const { Router } = require("express");
const User = require("../models/user.model");
const { hashPassword } = require("../utils/hashing");
const passport = require("passport");

const router = Router();

//------  register con Passport - local -----//

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "api/session/failregister",
  }),
  async (req, res) => {
    console.log("New user is:", req.user);

    res.redirect("/");
  }
);

router.get("/failregister", (req, res) => {
  res.send("Error registering user!");
});

// --------Login con Passport - local-------//

router.post(
  "/login",
  passport.authenticate("login", {
    failureRedirect: "/api/session/faillogin",
  }),
  async (req, res) => {
    console.log(req.body);

    // 2. crear nueva sesión si el usuario existe
    req.session.user = { email: req.user.email, _id: req.user._id };
    res.redirect("/");
  }
);

router.get("/faillogin", (req, res) => {
  res.send("Error, login fail!");
});

//------------Logout----------------//

router.get("/logout", (req, res) => {
  console.log(req.body);
  req.session.destroy((_) => {
    res.redirect("/");
  });
});

//-------------------- register con Passport - Github

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req, res) => {
    req.session.user = { _id: req.user._id };
    res.redirect("/");
  }
);

// router.post("/register", async (req, res) => {
//   console.log(req.body);
//   try {
//     const { name, lastName, age, email, password } = req.body;

//     const user = await User.create({
//       name,
//       lastName,
//       age: +age,
//       email,
//       password: hashPassword(password),
//     });
//     req.session.user = { email, _id: user._id.toString() };
//     res.redirect("/");
//   } catch (err) {
//     return res.status(500).json({ error: err });
//   }
// });

//---

// router.post("/login", async (req, res) => {
//   console.log(req.body);
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: "invalid credentials " });
//   }
//   // 1. verificar que el usuario exista en la BD
//   const user = await User.findOne({ email });
//   if (!user) {
//     return res.status(401).json({ error: "User not found " });
//   }

//   // si encontramos al usuario validar su password
//   if (!isValidPassword(password, user.password)) {
//     return res.status(401).json({ error: "Invalid password " });
//   }

//   // 2. crear nueva sesión si el usuario existe
//   req.session.user = { email, _id: user._id.toString() };
//   res.redirect("/");
// });

//--------------------

module.exports = router;
