// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) { console.log('Unable to connect to MongoDB server.'); }
    else { console.log('Connected to MongoDB server'); }

    const db = client.db('TodoApp');

    // db.collection('Todos').findOneAndUpdate({
    //     _id: new ObjectID("5a77018ffdcee014c5221f35")
    // }, {
    //     $set: { completed: true }
    // }, {
    //     returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // })

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID("5a76d3ebef4d1dae4f9e9f3c")
    }, {
        $set: { name: 'see kehan' },
        $inc: { age: 1 }
    }, {
        returnOriginal: false
    }).then((result) => {
        console.log(result);
    });
});