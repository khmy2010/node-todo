var mongoose = require('mongoose');

const REMOTE_MONGO = 'mongodb://macbookpro:westerndigital12345@ds125048.mlab.com:25048/udemy-todoapi-mp145';
const MONGO_URI = process.env.PORT ? REMOTE_MONGO : process.env.MONGODB_URI;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI).then(() => {
    console.log('Connected to Mongo instance.')
}, (err) => {
    console.log('Error connecting to Mongo instance: ', err);
});

module.export = { mongoose };