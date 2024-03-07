const express = require("express");
const bodyParser = require("body-parser");
const port = 3000 || process.env.PORT;
const mongoose = require("mongoose");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost:27017/todolistDB");
const TaskSchema = mongoose.Schema({
    name: { type: String, required: true }
});
const Task = mongoose.model("Task", TaskSchema);
app.get("/", (req, res) => {

    Task.find({})
        .then((data) => {
            res.render("list", { listTitle: "today", newTask: data });
        }).catch((err) => {
            console.log(err);
        });
});
app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const item = new Task({
        name: itemName
    });
    item.save();
    res.redirect("/");
});
app.post("/delete", (req, res) => {
    const checkedTaskId = req.body.checkbox;
    Task.deleteOne({ _id: checkedTaskId })
        .then(() => {
            res.redirect('/');
        }).catch((err) => {
            console.log(err);
        });
});
app.listen(port, (req, res) => {
    console.log("server started on port " + port);
});