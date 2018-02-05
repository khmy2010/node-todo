var express = require('express');
var bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Todo } = require('./models/todo');

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo({
        text: req.body.text
    });

    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    
    if (ObjectID.isValid(id)) {
        Todo.findById(id).then((todo) => {
            if (todo) {
                res.send({todo});
            }
            else { res.status(404).send(); }
        }).catch((e) => {
            res.status(400).send(e);
        });
    }
    else {
        res.status(404).send();
    }
});

app.listen(port, () => {
    let date = new Date();

    console.log(`${date.toTimeString()}: Server is listening at port ${port}.`);
});

module.exports = { app };

