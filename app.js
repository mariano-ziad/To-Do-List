const express = require("express");
const bodyParser = require("body-parser");
const port = 3000 || process.env.PORT;
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb+srv://Ziad:ytyyyuyi@my-first-cluster.hifjeup.mongodb.net/?retryWrites=true&w=majority&appName=my-first-cluster");
const TaskSchema = mongoose.Schema({
    name: { type: String, required: true }
});
const listSchema = {
    name: {type: String, required: true, unique: true},
    items: [TaskSchema]
};
const Task = mongoose.model("Task", TaskSchema);
const List = mongoose.model("List", listSchema);

app.get("/", (req, res) => {

    Task.find({})
        .then((data) => {
            res.render("list", { listTitle: "today", newTask: data });
        }).catch((err) => {
            console.log(err);
        });
});

app.get("/:newListName", (req, res)=>{
    const newListName = _.capitalize(req.params.newListName);
    List.findOne({name : newListName})
    .then((foundList) => {
        if (!foundList) {
            const list = new List({
                name: newListName,
            });
            list.save();
            res.redirect(`/${newListName}`);
        } else {
            res.render('list', {listTitle: foundList.name,newTask: foundList.items})
        }
    })
    .catch((err) => {
        console.log(err);
    });    
});

app.post("/", (req, res) => {
    const itemName = req.body.newItem;
    const listName = req.body.list;
    const item = new Task({
        name: itemName
    });
    if (listName === "today") {
        item.save();
        res.redirect("/");
    } else {
       List.findOne({name: listName})
       .then((foundList) => {
        foundList.items.push(item);
        foundList.save();
        res.redirect(`/${listName}`);
       }).catch((err) => {
        console.log(err);
       });
    }
    
});

app.post("/delete", (req, res) => {
    const checkedTaskId = req.body.checkbox;
    const listName = req.body.listTitle;
    if (listName === "today") {
        Task.deleteOne({ _id: checkedTaskId })
        .then(() => {
            res.redirect('/');
        }).catch((err) => {
            console.log(err);
        });    
    } else {
        List.findOneAndUpdate({name: listName},{$pull: {items: {_id: checkedTaskId}}})
        .then(() => {
            res.redirect(`/${listName}`);
        }).catch((err) => {
            console.log(err);
        });
    }
});
app.listen(port, (req, res) => {
    console.log("server started on port " + port);
});