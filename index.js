import bodyParser from "body-parser";
import MongoStore from "connect-mongo";
import "dotenv/config";
import express from "express";
import session from "express-session";
import methodOverride from "method-override";
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

app.use(methodOverride("_method"));

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
    const todayTasks = await Task.find({
      user_id: userId,
      date: { $gte: today, $lte: tomorrow },
      completed: false,
    }).exec();
    const ongoingTasks = await Task.find({
      user_id: userId,
      ongoing: true,
    }).exec();
    const canceledTasks = await Task.find({
      user_id: userId,
      canceled: true,
    }).exec();
    const pendingTasks = await Task.find({
      user_id: userId,
      pending: true,
    }).exec();
    const completedTasks = await Task.find({
      user_id: userId,
      completed: true,
    }).exec();
    res.render(__dirname + "/views/account.ejs", {
      user: username.username,
      tasks: todayTasks,
      ongoing: ongoingTasks,
      completed: completedTasks,
      pending: pendingTasks,
      canceled: canceledTasks,
    });
  } else {
    res.redirect("/");
  }
});

app.post("/createtask", async (req, res) => {
  const userId = req.user.id;
  const today = new Date();
  const tomorrow = new Date(today);
  today.setHours(3, 0, 0, 0);
  tomorrow.setHours(26, 59, 59, 999); // Increment the day by 1
  try {
    var username = await User.findById(userId).exec();
    var todayTasks = await Task.find({
      user_id: userId,
      date: { $gte: today, $lte: tomorrow },
    }).exec();
    var ongoingTasks = await Task.find({
      user_id: userId,
      ongoing: true,
    }).exec();
    var canceledTasks = await Task.find({
      user_id: userId,
      canceled: true,
    }).exec();
    var pendingTasks = await Task.find({
      user_id: userId,
      pending: true,
    }).exec();
    var completedTasks = await Task.find({
      user_id: userId,
      completed: true,
    }).exec();
  } catch {
    return res.status(500).send("Error searching for user.");
  }

  if (!req.body.title || !req.body.date || !req.body.description) {
    return res.render(__dirname + "/views/account.ejs", {
      message: "All inputs must be filled.",
      user: username.username,
      tasks: todayTasks,
      ongoing: ongoingTasks,
      completed: completedTasks,
      pending: pendingTasks,
      canceled: canceledTasks,
    });
  }
  const dateString = req.body.date;
  if (!isValidDateInput(dateString)) {
    return res.render(__dirname + "/views/account.ejs", {
      message: "Invalid date format.",
      user: username.username,
      tasks: todayTasks,
      ongoing: ongoingTasks,
      completed: completedTasks,
      pending: pendingTasks,
      canceled: canceledTasks,
    });
  }
  const [month, day, year] = dateString.split("/").map(Number);
  const newDate = new Date(year, month - 1, day);
  newDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999

  const tags = [];
  if (req.body.taghigh === "on") {
    tags.push("High");
  }
  if (req.body.tagmedium === "on") {
    tags.push("Medium");
  }
  if (req.body.taglow === "on") {
    tags.push("Low");
  }

  // Save new task
  const newTask = new Task({
    title: req.body.title,
    date: newDate,
    description: req.body.description,
    user_id: req.user.id,
    tags: tags,
    ongoing: true,
  });
  try {
    await newTask.save();
  } catch {
    return res.render(__dirname + "/views/account.ejs", {
      message: "Task creation failed.",
      user: username.username,
      tasks: todayTasks,
      ongoing: ongoingTasks,
      completed: completedTasks,
      pending: pendingTasks,
      canceled: canceledTasks,
    });
  }
  return res.redirect("/account");
});

// DELETE a specific post by providing the post id
app.delete("/deletetask/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    var task = await Task.findByIdAndDelete(taskId);
  } catch {
    return res.status(500).send("Error deleting task.");
  }
  if (task.ongoing) {
    return res.redirect("/ongoing");
  } else if (task.completed) {
    return res.redirect("/completed");
  } else if (task.pending) {
    return res.redirect("/pending");
  }
});

// Complete a specific post by providing the post id
app.patch("/complete/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    await Task.findByIdAndUpdate(taskId, { ongoing: false, completed: true });
  } catch {
    return res.status(500).send("Error completing task.");
  }
  res.redirect("/ongoing");
});

// Restore a specific post by providing the post id
app.patch("/restore/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    await Task.findByIdAndUpdate(taskId, { completed: false, ongoing: true });
  } catch {
    return res.status(500).send("Error completing task.");
  }
  res.redirect("/completed");
});

// Disable a specific post by providing the post id
app.patch("/disabletask/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    await Task.findByIdAndUpdate(taskId, { ongoing: false, pending: true });
  } catch {
    return res.status(500).send("Error disabling task.");
  }
  res.redirect("/ongoing");
});

// Enable a specific post by providing the post id
app.patch("/enabletask/:id", async (req, res) => {
  const taskId = req.params.id;
  try {
    await Task.findByIdAndUpdate(taskId, { ongoing: true, pending: false });
  } catch {
    return res.status(500).send("Error enabling task.");
  }
  res.redirect("/pending");
});

// Edit a specific post by providing the post id
app.patch("/edit/:id", async (req, res) => {
  const taskId = req.params.id;

  // check if there are updates to be made
  let update = {};
  if (req.body.title) update.title = req.body.title;
  if (req.body.date) {
    const dateString = req.body.date;
    if (!isValidDateInput(dateString)) {
      return res.status(500).send("Invalid date format.");
    }
    const [month, day, year] = dateString.split("/").map(Number);
    const newDate = new Date(year, month - 1, day);
    newDate.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
    update.date = newDate;
  }
  if (req.body.description) update.description = req.body.description;
  const tags = [];
  if (req.body.taghigh === "on") {
    tags.push("High");
    update.tags = tags;
  }
  if (req.body.tagmedium === "on") {
    tags.push("Medium");
    update.tags = tags;
  }
  if (req.body.taglow === "on") {
    tags.push("Low");
    update.tags = tags;
  }

  // update task in database
  try {
    var task = await Task.findByIdAndUpdate(taskId, update);
  } catch {
    return res.status(500).send("Error editing task.");
  }

  //redirect depending on where user was before
  if (task.ongoing) {
    res.redirect("/ongoing");
  } else {
    res.redirect("/pending");
  }
});

// completed page
app.get("/completed", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    try {
      var tasks = await Task.find({
        user_id: userId,
        completed: true,
      }).exec();
    } catch {
      return res.redirect("/");
    }

    return res.render(__dirname + "/views/completed.ejs", { tasks: tasks });
  } else {
    res.redirect("/");
  }
});

// pending page
app.get("/pending", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    try {
      var tasks = await Task.find({
        user_id: userId,
        pending: true,
      }).exec();
    } catch {
      return res.redirect("/");
    }

    return res.render(__dirname + "/views/pending.ejs", { tasks: tasks });
  } else {
    res.redirect("/");
  }
});

// canceled page
app.get("/canceled", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    try {
      var tasks = await Task.find({
        user_id: userId,
        canceled: true,
      }).exec();
    } catch {
      return res.redirect("/");
    }

    return res.render(__dirname + "/views/canceled.ejs", { tasks: tasks });
  } else {
    res.redirect("/");
  }
});

// ongoing page
app.get("/ongoing", async (req, res) => {
  if (req.isAuthenticated()) {
    const userId = req.user.id;
    try {
      var tasks = await Task.find({
        user_id: userId,
        ongoing: true,
      }).exec();
    } catch {
      return res.redirect("/");
    }

    return res.render(__dirname + "/views/ongoing.ejs", { tasks: tasks });
  } else {
    return res.redirect("/");
  }
});

// port
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
