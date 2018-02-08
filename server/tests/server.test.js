const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

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
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        const id = todos[0]._id.toHexString();
        const new_text = 'updated test';

        request(app)
            .patch(`/todos/${id}`)
            .send({text: new_text, completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(new_text);
                expect(res.body.todo.completed).toBe(true);
                // expect(res.body.todo.completedAt).toBeA(Number);
            })
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {
        const id = todos[1]._id.toHexString();
        const obj = { text: 'updated text [delete]', completed: false }

        request(app)
            .patch(`/todos/${id}`)
            .send(obj)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false)
                // expect(res.body.todo.completedAt).toNotExist()
                expect(res.body.todo.text).toBe(obj.text)                
            })
            .end(done);
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if unauthenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
        });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        const email = 'kehan.test@gmail.com';
        const password = '123456789';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) { return done(err); }

                User.findOne({email}).then((user) => {
                    expect(user).toBeTruthy();
                    // expect(user.password).not.toBe(password);
                    done();
                });
            });
    });

    it('should return validation errors if request invalid', (done) => {
        const email = 'k@';
        const password = '12';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end((err) => {
                if (err) { return done(err); }

                User.findOne({email}).then((user) => {
                    expect(user).toBe(null);
                    done();
                });
            });
    });

    it('should not create user if email in use', (done) => {
        const email = users[0].email;
        const password = '1234567890';

        request(app)
            .post('/users')
            .send({ email, password })
            .expect(400)
            .end(done);
    });
});
