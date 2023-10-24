import crypto from "crypto";
import express from "express";
import passport from "passport";
import LocalStrategy from "passport-local";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { User } from "../models/user.model.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

passport.use(
  new LocalStrategy(async (username, password, cb) => {
    try {
      const foundUser = await User.findOne({ username: username }).exec();
      if (foundUser === null) {
        console.log("User not found");
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
            console.log("incorrect password");
            return cb(null, false, {
              message: "Incorrect username or password.",
            });
          }
          console.log("correct password");
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
        res.redirect("/");
      } catch (error) {
        res.status(500).send("Error registering user");
      }
    }
  );
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/account",
    failureRedirect: "/",
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

export default router;
