import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// app configuration
const app = express();
const port = 3000;

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

// index page
app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

// account page
app.get("/account", (req, res) => {
  res.render(__dirname + "/views/account.ejs");
});

// port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
