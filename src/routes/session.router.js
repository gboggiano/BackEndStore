const { Router } = require("express");
const User = require("../models/user.model");

const router = Router();

router.post("/login", async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "invalid credentials " });
  }
  // 1. verificar que el usuario exista en la BD
  const user = await User.findOne({ email, password });
  if (!user) {
    return res.status(400).json({ error: "User not found " });
  }
  // 2. crear nueva sesión si el usuario existe
  req.session.user = { email, _id: user._id.toString() };
  res.redirect("/");
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  try {
    const { name, lastName, age, email, password } = req.body;

    const user = await User.create({
      name,
      lastName,
      age: +age,
      email,
      password,
    });
    req.session.user = { email, _id: user._id.toString() };
    res.redirect("/");
  } catch (err) {
    return res.status(500).json({ error: err });
  }
});

router.get("/logout", (req, res) => {
  console.log(req.body);
  req.session.destroy((_) => {
    res.redirect("/");
  });
});

module.exports = router;
