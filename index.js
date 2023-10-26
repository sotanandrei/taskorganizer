import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import "dotenv/config";
import express from "express";
import session from "express-session";
import passport from "passport";
import { dirname } from "path";
import { fileURLToPath } from "url";
import "./helpers/init_mongodb.js";
import { isValidDateInput } from "./helpers/isdatevalid.js";
import { Task } from "./models/task.model.js";
import { User } from "./models/user.model.js";
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
  if (req.isAuthenticated()) {
    res.redirect("/account");
  } else {
    res.render(__dirname + "/views/index.ejs");
  }
});

// account page
app.get("/account", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    const today = new Date();
    const tomorrow = new Date(today);
    today.setHours(3, 0, 0, 0);
    tomorrow.setHours(26, 59, 59, 999); // Increment the day by 1
    const username = await User.findById(userId).exec();
    const tasks = await Task.find({
      user_id: userId,
      date: { $gte: today, $lte: tomorrow },
    }).exec();
    res.render(__dirname + "/views/account.ejs", {
      user: username.username,
      tasks: tasks,
    });
  } else {
    res.redirect("/");
  }
});

app.post("/createtask", async (req, res) => {
  const userId = req.user.id;
  try {
    var username = await User.findById(userId).exec();
    var tasks = await Task.find({ user_id: userId }).exec();
  } catch (error) {
    return res.status(500).send("Error searching for user.");
  }

  if (!req.body.title || !req.body.date || !req.body.description) {
    return res.render(__dirname + "/views/account.ejs", {
      message: "All inputs must be filled.",
      user: username.username,
      tasks: tasks,
    });
  }
  const dateString = req.body.date;
  if (!isValidDateInput(dateString)) {
    return res.render(__dirname + "/views/account.ejs", {
      message: "Invalid date format.",
      user: username.username,
      tasks: tasks,
    });
  }
  const [month, day, year] = dateString.split("/").map(Number);
  const newDate = new Date(year, month - 1, day);
  newDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

  // Save new task
  const newTask = new Task({
    title: req.body.title,
    date: newDate,
    description: req.body.description,
    user_id: req.user.id,
  });
  try {
    await newTask.save();
  } catch (error) {
    return res.render(__dirname + "/views/account.ejs", {
      message: "Task creation failed.",
      user: username.username,
      tasks: tasks,
    });
  }
  return res.redirect("/account");
});

// completed page
app.get("/completed", (req, res) => {
  if (req.isAuthenticated()) {
    res.render(__dirname + "/views/completed.ejs");
  } else {
    res.redirect("/");
  }
});

// pending page
app.get("/pending", (req, res) => {
  if (req.isAuthenticated()) {
    res.render(__dirname + "/views/pending.ejs");
  } else {
    res.redirect("/");
  }
});

// canceled page
app.get("/canceled", (req, res) => {
  if (req.isAuthenticated()) {
    res.render(__dirname + "/views/canceled.ejs");
  } else {
    res.redirect("/");
  }
});

// ongoing page
app.get("/ongoing", (req, res) => {
  if (req.isAuthenticated()) {
    res.render(__dirname + "/views/ongoing.ejs");
  } else {
    res.redirect("/");
  }
});

// port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
