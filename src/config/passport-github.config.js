const passport = require("passport");
const { Strategy } = require("passport-github2");
const User = require("../models/user.model");
// const hashingUtils = require("../utils/hashing");
const { clientID, clientSecret, callbackURL } = require("./github.private");

const initializeStrategy = () => {
  passport.use(
    "github",
    new Strategy(
      {
        clientID,
        clientSecret,
        callbackURL,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          console.log("Profile, gitbub", profile, profile._json);
          const user = await User.findOne({ email: profile._json.email });
          if (user) {
            return done(null, user);
          }

          const fullName = profile._json.name;
          const name = fullName.substring(0, fullName.lastIndexOf(" "));
          const lastName = fullName.substring(fullName.lastIndexOf(" ") + 1);
          const newUser = {
            name,
            lastName,
            age: 30,
            email: profile._json.email,
            password: "",
          };

          const result = await User.create(newUser);
          done(null, result);
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
