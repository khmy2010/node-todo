// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) { console.log('Unable to connect to MongoDB server.'); }
    else { console.log('Connected to MongoDB server'); }

    const db = client.db('TodoApp');

    // db.collection('Todos').insertOne({
    //     text: 'Something has to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) { console.log(`Something went wrong. ${err}`); }

    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    // db.collection('Users').insertOne({
    //     name: 'Ke Han',
    //     age: 21,
    //     location: 'Malaysia'
    // }, (err, result) => {
    //     if (err) { console.log(`Something went wrong. ${err}`); }
        
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    //     console.log(result.ops[0]._id.getTimestamp());
    // });
    client.close();
});