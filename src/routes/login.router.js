const { Router } = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const cookieParser = require("cookie-parser");
const { hashPassword } = require("../utils/hashing");
const User = require("../models/user.model");

const { generateToken } = require("../utils/jwt");
const { isValidPassword } = require("../utils/hashing");
const passportMiddleware = require("../utils/passportMiddleware");
const authMiddleware = require("../utils/authorizationMiddleware");

const router = Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "User not found!" });
  }

  if (!isValidPassword(password, user.password)) {
    return res.status(401).json({ error: "Invalid password" });
  }

  const credentials = {
    id: user._id.toString(),
    email: user.email,
    himessage: "Hi there!",
    role: user.role,
  };
  const accessToken = generateToken(credentials);
  res.cookie("accessToken", accessToken, { maxAge: 60 * 1000, httpOnly: true });

  res.status(200).json({ status: "success" });
});

// router.get(
//   "/users/current",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     return res.json(req.user);
//   }
// );

router.get(
  "/users/current",
  passportMiddleware("jwt"),
  authMiddleware("user"),
  async (req, res) => {
    return res.json(req.user);
  }
);

module.exports = router;
