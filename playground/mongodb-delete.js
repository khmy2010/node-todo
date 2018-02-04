// const MongoClient = require('mongodb').MongoClient;
const { MongoClient, ObjectID } = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
    if (err) { console.log('Unable to connect to MongoDB server.'); }
    else { console.log('Connected to MongoDB server'); }

    const db = client.db('TodoApp');

    //delete many
    // db.collection('Todos').deleteOne({text: 'Eat lunch'}).then((result) => {
    //     console.log('result: ', result);
    // });

    //delete one
    // db.collection('Todos').deleteMany({text: 'Eat lunch'}).then((result) => {
    //     console.log('result: ', result);
    // });

    //find one and delete
    db.collection('Todos').findOneAndDelete({completed: false}).then((result) => {
        console.log('result: ', result);
    });

    // client.close();
});