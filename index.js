import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

// app configuration
const app = express();
const port = 3000;

// route to static files
app.use(express.static(__dirname + "/public"));

// index page
app.get("/", (req, res) => {
  res.render(__dirname + "/views/index.ejs");
});

// port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
