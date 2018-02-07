var { mongoose } = require('../server/db/mongoose');
var { User } = require('../server/models/user');
var { Todo } = require('../server/models/todo');

var id = '5a77eec34b6fe313848e8d73';
console.log(Todo);

//auto convert
// Todo.find({
//     _id: id
// }).then((todos) => {
//     console.log('Todos: ', todos);
// })


// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo: ', todo);
// });


// Todo.save().then((product) => {
//     console.log('Product: ', product);
// });