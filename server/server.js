require('./config/config');

var express = require('express');
var bodyParser = require('body-parser');
const _ = require('lodash');

const {ObjectID} = require('mongodb');

var { mongoose } = require('./db/mongoose');
var { User } = require('./models/user');
var { Todo } = require('./models/todo');
var { authenticate } = require('./middleware/authenticate');

var app = express();
app.use(express.static('public'));

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

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (ObjectID.isValid(id)) {
        Todo.findByIdAndRemove(id).then((todo) => {
            if (todo) { res.send({todo}) }
            else { res.status(404).send(); }
        }).catch((e) => res.status(404).send(e));

    }
    else { res.status(404).send(); }
});

app.patch('/todos/:id', (req, res) => {
    const id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) { return res.status(404).send(); }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = Date.now();
    }
    else {
        body.completed = false;
        body.completedAt = null;
    }

    Todo.findByIdAndUpdate(id, {
        $set: body
    }, { new: true }).then((todo) => {
        if (todo) { res.send({todo}); }
        else { res.status(404).send(); }
    }).catch((e) => {
        res.status(404).send();
    });
});

app.post('/users', (req, res) => {
    let body = _.pick(req.body, ['email', 'password']);
    let user = new User(body);

    // user.save().then(() => {
    //     return user.generateAuthToken();
    // }).then((token) => {
    //     console.log('token at the server: ', token);
    //     res.header('x-auth', token).send(user);
    // }).catch((e) => {
    //     res.status(400).send(e);
    // });
    user.save().then(() => {
        return user.generateAuthToken();
    }).then((token) => {
        console.log('token at the server: ', token);
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        res.status(400).send(e);
    })
});

app.get('/users/me', authenticate, (req, res) => {
    res.send(req.user);
})

app.listen(port, () => {
    let date = new Date();

    console.log(`${date.toTimeString()}: Server is listening at port ${port}.`);
});

module.exports = { app };

