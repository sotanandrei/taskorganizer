import crypto from "crypto";
import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { User } from "../models/user.model.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const foundUser = await User.findOne({ username: username }).exec();
      if (foundUser === null) {
        return cb(null, false, { message: "Incorrect username or password." });
      }
      crypto.pbkdf2(
        password,
        foundUser.salt,
        310000,
        32,
        "sha256",
        (err, hashedPassword) => {
          if (err) {
            return cb(err);
          }
          if (
            !crypto.timingSafeEqual(foundUser.hashed_password, hashedPassword)
          ) {
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          return cb(null, foundUser);
        }
      );
    } catch (error) {
      return cb(error);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

router.post("/register", async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    return res.render(path.join(__dirname, "../views/index.ejs"), {
      message: "Invalid username and/or password.",
    });
  }
  try {
    // check if username already used
    const searchUser = await User.findOne({
      username: req.body.username,
    }).exec();

    // if username exists, redirect to main page
    if (searchUser !== null) {
      return res.render(path.join(__dirname, "../views/index.ejs"), {
        message: "Username is already in use.",
      });
    }

    // if username doesn't exist, hash password and register new user
    var salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        if (err) {
          return next(err);
        }
        try {
          const newUser = new User({
            username: req.body.username,
            hashed_password: hashedPassword,
            salt: salt,
          });

          await newUser.save();
          return res.render(path.join(__dirname, "../views/index.ejs"), {
            message: "The account has been created.",
          });
        } catch (error) {
          return res.status(500).send("Error registering user");
        }
      }
    );
  } catch (error) {
    return res.status(500).send("Error searching for user");
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed
      return res.render(path.join(__dirname, "../views/index.ejs"), {
        message: "Incorrect username and/or password.",
      });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful, redirect to the account page
      return res.redirect("/account");
    });
  })(req, res, next);
});

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
