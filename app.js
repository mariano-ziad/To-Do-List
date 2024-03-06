const express = require("express");
const bodyParser = require("body-parser");
const port = 3000 || process.env.PORT;
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/toDoListDB");
const TaskSchema = mongoose.Schema({name: { type: String, required: true}});
const Task = mongoose.model("Task", TaskSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/", (req, res) => {
    Task.find({}).then((tasks) => {
        res.render("list", { listTitle: "today", newTask: tasks});
    }).catch((err) => {
        console.log(err);
    });
});

app.post("/", (req, res) => {
    const taskName = req.body.newItem;
    const newTask = new Task ({name: taskName});
    newTask.save();
    res.redirect("/");
});

app.post("/delete", (req,res)=>{
    const checkedTaskId = req.body.checkbox;
    Task.deleteOne({_id :checkedTaskId}).then(() => {
        console.log(checkedTaskId + ' was deleted');
        res.redirect('/');
    }).catch((err) => {
        console.log(err);
    });
});

app.get("/:topicList", (req, res) => {
    let topic = req.params.topicList;
    Task.find({}).then((tasks) => {
        res.render("list", { listTitle: topic, newTask: tasks});
    }).catch((err) => {
        console.log(err);
    });
});

app.listen(port, (req, res) => {
    console.log("server started on port " + port);
});