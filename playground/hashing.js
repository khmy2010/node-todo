const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';


// var data = {
//     id: 10
// }

// var token = jwt.sign(data, 'ROCK');
// console.log(token.toString());

// var decodedResult = jwt.verify(token, 'ROCK');
// console.log('decoded: ', decodedResult);

// var message = 'I AM GROOT!';
// var hash = SHA256(message).toString();

// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//     id: 4
// };

// var token = {
//     data,
//     hash: SHA256(JSON.stringify(data) + 'SECRET').toString()
// };

// var resultHash = SHA256(JSON.stringify(token.data) + 'SECRET').toString();

// if (resultHash === token.hash) {
//     console.log('Data was original.');
// }
// else {
//     console.log('Data was tampered.');
// }