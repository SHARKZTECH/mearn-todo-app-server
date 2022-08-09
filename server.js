const express=require("express");
const bodyParser=require("body-parser");
const cors=require("cors");
const mongoose=require("mongoose");

const app=express();
const PORT=5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

let Todo = require('./todo.model');

const todoRoutes=express.Router();
app.use('/todos',todoRoutes);

mongoose.connect("mongodb://127.0.0.1:27017/todos",{
    useNewUrlParser:true
});
const connection=mongoose.connection;
connection.once("open",function(){
    console.log("MongoDB database connection established successfully")
})


todoRoutes.route('/').get(function(req,res){
    Todo.find(function(err,todos){
        if(err){
            console.log(err);
        }else{
            res.json(todos);
        }
    });
});

todoRoutes.route("/:id").get(function(req,res){
    let id=req.params.id;
    Todo.findById(id,function(err,todo){
        res.json(todo);
    });
});

todoRoutes.route("/update/:id").post(function(req,res){
    Todo.findById(req.params.id,function(err,todo){
        if(!todo){
            res.status(404).send("data is not found");
        }else{
            todo.description=req.body.description;
            todo.responsible=req.body.responsible;
            todo.priority=req.body.priority;
            todo.completed=req.body.completed;

            todo.save().then(todo=>{
                res.json('Todo update');
            })
            .catch(err=>{
                res.status(400).send("Update not possible");
            });
        }
    });
});

todoRoutes.route("/add").post(function(req,res){
    let todo=new Todo(req.body);
    todo.save()
    .then(todo=>{
        res.status(200).json({'todo':'todo added successfully'});
    })
    .catch(err=>{
        res.status(400).send("adding new todo failed")
    })
})

app.listen(PORT,function(){
    console.log("Server is running on Port :" + PORT);
});

