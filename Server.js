const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
const PORT = 4000;

let Todos = require("./todo.model");

app.use(cors());
app.use(bodyParser.json());

// const uri = process.env.ATLAS_URI;

mongoose.connect("mongodb://127.0.0.1:27017/Todos", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB DataBase Conection established successfully!!");
});

todoRoutes.route("/").get(function(req, res) {
  Todos.find(function(err, todos) {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});

todoRoutes.route("/:id").get(function(req, res) {
  let id = req.params.id;
  Todos.findById(id, function(err, todo) {
    res.json(todo);
  });
});

todoRoutes.route("/add").post(function(req, res) {
  let todo = new Todos(req.body);
  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "todo added successfully !!" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});

todoRoutes.route("/update/:id").post(function(req, res) {
  Todos.findById(req.params.id, function(err, todo) {
    if (!todo) res.status(404).send("data is not found");
    else todo.todo_description = req.body.todo_description;
    todo.todo_responsible = req.body.todo_responsible;
    todo.todo_priority = req.body.todo_priority;
    todo.todo_competed = req.body.todo_competed;

    todo
      .save()
      .then(todo => {
        res.json("Todo Updated!!");
      })
      .catch(err => {
        res.status(400).send("Update not Possible");
      });
  });
});
app.use("/Todos", todoRoutes);

app.listen(PORT, function() {
  console.log("Server is running on Port: " + PORT);
});
