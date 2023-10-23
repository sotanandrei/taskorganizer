import express from "express";
import path from "path";
import { User } from "../models/user.model.js";
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password,
    });
    await newUser.save();
    // Redirect or render a response upon successful user creation
    res.render(path.join(__dirname, "../views/index.ejs"));
    console.log("Succesfully created user.");
  } catch (error) {
    // Handle any errors that occur during the user creation process
    // For example, you can send an error response or render an error page.
    console.error("Error creating user:", error);
    res.status(500).send("An error occurred while registering the user.");
  }
});

router.post("/login", async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const foundUser = await User.findOne({ username: username }).exec();
  console.log(foundUser);
  if (foundUser !== null) {
    if (foundUser.password === password) {
      res.render(path.join(__dirname, "../views/account.ejs"));
    }
  } else {
    res.render(path.join(__dirname, "../views/index.ejs"));
  }
});

export default router;
