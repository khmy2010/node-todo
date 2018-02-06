const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First to-do test'
}, {
    _id: new ObjectID(),
    text: 'Second to-do test'
}];

beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('POST / todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        //supertest will auto convert to JSON.
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) { done(err); }
                else {
                    Todo.find({text}).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch((e) => {
                        done(e);
                    });
                }
            });
    });

    it('should not create todo with invalid body data.', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) { done(err); }
                else {
                    Todo.find().then((todo) => {
                        expect(todo.length).toBe(2);
                        done();
                    }).catch((e) => done(e));
                }
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    });
});

describe('GET /todos:id', () => {
    //test for valid ID
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end((err, res) => {
                if (err) { return done(err); }

                Todo.findById(todos[0]._id.toHexString()).then((todo) => {
                    // expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e))
            })
    });

    it('should return 404 if todo not found', (done) => {
        const new_id = new ObjectID();

        request(app)
            .get(`/todos/${new_id.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for non-object ID', (done) => {
        const new_id = 12345678;

        request(app)
            .get(`/todos/${new_id}`)
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        const delete_id = todos[0]._id.toHexString();

        request(app)
            .delete(`/todos/${delete_id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
    });

    it('should return 404 if todo not found', (done) => {
        const new_id = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${new_id}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 if object ID is invalid', (done) => {
        const invalid_id = 12345678;

        request(app)
            .delete(`/todos/${invalid_id}`)
            .expect(404)
            .end(done)
    });
});
