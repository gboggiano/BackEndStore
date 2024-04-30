const passport = require("passport");
const { Strategy } = require("passport-local");
const User = require("../models/user.model");
const hashingUtils = require("../utils/hashing");

const initializeStrategy = () => {
  passport.use(
    "register",
    new Strategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { name, lastName, age, email } = req.body;

        try {
          const user = await User.findOne({ email: username });
          if (user) {
            //error si usuario existe (mail)
            return done(null, false);
          }

          const newUser = {
            name,
            lastName,
            age: +age,
            email,
            password: hashingUtils.hashPassword(password),
          };
          //usuario nuevo creado exitosamente
          const result = await User.create(newUser);
          return done(null, result);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.use(
    "login",
    new Strategy(
      {
        usernameField: "email",
      },
      async (username, password, done) => {
        try {
          if (!username || !password) {
            return done(null, false);
          }
          // 1. verificar que el usuario exista en la BD
          const user = await User.findOne({ email: username });
          if (!user) {
            return done(null, false);
          }

          // si encontramos al usuario validar su password
          if (!hashingUtils.isValidPassword(password, user.password)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    console.log("serialized!", user);
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    done(null, user);
  });
};

module.exports = initializeStrategy;
