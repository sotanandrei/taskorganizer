import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import { dirname } from "path";
import { fileURLToPath } from "url";
import "./helpers/init_mongodb.js";
import AuthRoute from "./routes/auth.route.js";
const __dirname = dirname(fileURLToPath(import.meta.url));

// app configuration
const app = express();
const port = 3000;

// Middleware

//bodyParser
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(__dirname + "/public"));

// Serve Bootstrap CSS from 'node_modules'
app.use(
  "/css/bootstrap",
  express.static(__dirname + "/node_modules/bootstrap/dist/css")
);

// Serve Bootstrap icons from 'node_modules'
app.use(
  "/bootstrap-icons",
  express.static(__dirname + "/node_modules/bootstrap-icons/font/")
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
);
app.use(passport.authenticate("session"));

// authentication route
app.use("/auth", AuthRoute);

// index page
app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

// account page
app.get("/account", (req, res) => {
  res.render(__dirname + "/views/account.ejs");
});

// completed page
app.get("/completed", (req, res) => {
  res.render(__dirname + "/views/completed.ejs");
});

// pending page
app.get("/pending", (req, res) => {
  res.render(__dirname + "/views/pending.ejs");
});

// canceled page
app.get("/canceled", (req, res) => {
  res.render(__dirname + "/views/canceled.ejs");
});

// ongoing page
app.get("/ongoing", (req, res) => {
  res.render(__dirname + "/views/ongoing.ejs");
});

// port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
