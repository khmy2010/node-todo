// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) { console.log('Unable to connect to MongoDB server.'); }
    else { console.log('Connected to MongoDB server'); }

    const db = client.db('TodoApp');

    // client.close();
});