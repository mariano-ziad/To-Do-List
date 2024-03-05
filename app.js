const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js")
const port = 3000 || process.env.PORT;
const tasks = [];
const workTasks = [];
// ------------------------------------------------------
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
// ------------------------------------------------------
app.get("/", (req, res) => {
    const day = date.getDate();
    res.render("list", { listTitle: day, newTask: tasks });
});

app.post("/", (req, res) => {
    const task = req.body.newItem;
    if (req.body.list === "Work List") {
        workTasks.push(task);
        res.redirect("/work");
    } else {
        tasks.push(task);
        res.redirect("/");
    }
});
// ---------------------------------------------------------
app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newTask: workTasks });
});
// --------------------------------------------------------------
app.listen(port, (req, res) => {
    console.log("server started on port " + port);
});