var env = process.env.NODE_ENV || 'development';
console.log(`Running on ${env} environment.`);

if (env === 'development') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
}
else if (env === 'test') {
    process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
