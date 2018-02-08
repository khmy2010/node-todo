const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const users = [{
    _id: userOneId,
    email: 'kehan@kehan.com',
    password: 'userone',
    tokens: [{
        access: 'auth',
        token: jwt.sign({ id: userOneId, access: 'auth' }, 'SP123')
    }]
}, {
    _id: userTwoId,
    email: 'cat@cat.com',
    password: 'usertwo'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First to-do test'
}, {
    _id: new ObjectID(),
    text: 'Second to-do test',
    completed: true,
    completedAt: Date.now()
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();

        return Promise.all([userOne, userTwo]);
    }).then(() => done());
};

module.exports = {
    todos,
    populateTodos,
    users,
    populateUsers
}