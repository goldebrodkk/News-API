const app = require('../app.js'); 
const request = require('supertest'); 
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const db = require('../db/connection.js')
require('jest-sorted'); 

beforeEach(() => seed(testData)); 
afterAll(() => {db.end()}); 

describe('GET error all paths', () => {
    it('Status: 404 and an error message when a request is made to an invalid path', () => {
        return request(app)
        .get('/api/life')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid path")
        })
    });
});

describe('GET /api/topics', () => {
    it('Status: 200 and an array of objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true); 
            expect(body).toHaveLength(3); 
            body.forEach((topic) => {
                expect(topic.slug).toEqual(expect.any(String)); 
                expect(topic.description).toEqual(expect.any(String)); 
            })
        });
    });
});

describe('GET /api/users', () => {
    it('Status: 200 and an array of objects', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true); 
            expect(body).toHaveLength(4); 
            body.forEach((user) => {
                expect(user.username).toEqual(expect.any(String)); 
                expect(user.name).toEqual(expect.any(String)); 
                expect(user.avatar_url).toEqual(expect.any(String)); 
            })
        })
    });
});

describe('GET /api/articles', () => {
    it('Status: 200 and an array of objects sorted by date in descending order when request contains no queries', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true);
            expect(body).toHaveLength(12);
            expect(body).toBeSortedBy('created_at', {
                descending: true,
            })
            body.forEach((article) => {
                expect(article.author).toEqual(expect.any(String)); 
                expect(article.title).toEqual(expect.any(String)); 
                expect(article.article_id).toEqual(expect.any(Number));
                expect(article.topic).toEqual(expect.any(String));
                expect(article.created_at).toEqual(expect.any(String));
                expect(article.votes).toEqual(expect.any(Number));
                expect(article.comment_count).toEqual(expect.any(Number)); 
            })
        })
    });
    it('Status: 200 and an array of object sorted by title in ascending order when request contains relevant sorting queries', () => {
        return request(app)
        .get('/api/articles?sortOn=title&order=ASC')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true);
            expect(body).toHaveLength(12);
            expect(body).toBeSortedBy('title', {
                ascending: true, 
            })
        })
    });
    it('Status: 200 and an array of object sorted by comment_count in descending order when request contains relevant sorting queries ', () => {
        return request(app)
        .get('/api/articles?sortOn=comment_count&order=DESC')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true);
            expect(body).toHaveLength(12);
            expect(body).toBeSortedBy('comment_count', {
                descending: true,
            })
        })
    });
    it('Status: 200 and an array of objects filtered by the input topic when request contains relevant filtering queries', () => {
        return request(app)
        .get('/api/articles?term=mitch&sortOn=votes&order=ASC')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true);
            expect(body).toHaveLength(11);
            expect(body).toBeSortedBy('votes', {
                ascending: true, 
            })
            body.forEach((article) => {
                expect(article.topic).toEqual('mitch');
            })
        })
    });
    it('Status: 400 and an error message when request contains an invalid sort query ', () => {
        return request(app)
        .get('/api/articles?sortOn=life&order=ASC')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Invalid sort query")
        })
    });
    it('Status: 400 and an error message when request contains an invalid order query', () => {
        return request(app)
        .get('/api/articles?sortOn=comment_count&order=YES')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid order query')
        })
    });
    it('Status: 404 and an error message if given a topic that does not exist on the database ', () => {
        return request(app)
        .get('/api/articles?term=oranges')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Topic not found")
        })
    });
});


describe('GET api/article/:article_id', () => {
    it('Status: 200 and an object with the relevant article id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            expect(typeof body).toBe("object"); 
            expect(body.article_id).toBe(1); 
            expect(body.body).toBe("I find this existence challenging")
            expect(body.title).toEqual('Living in the shadow of a great man'); 
            expect(body.topic).toEqual('mitch');
            expect(body.author).toEqual('butter_bridge'); 
            expect(body.created_at).toEqual("2020-07-09T20:11:00.000Z"); 
            expect(body.votes).toEqual(100); 
            expect(body.comment_count).toEqual(11); 
        })
    });
    it('Status: 404 and an error message when request contains a valid ID that does not exist in the database', () => {
        return request(app)
        .get('/api/articles/1000')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("No article found for article_id: 1000")
        })
    });
    it('Status: 400 and an error message when request contains an invalid id', () => {
        return request(app)
        .get('/api/articles/dogs')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type"); 
        })
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    it('Status: 200 and an array of comment objects', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true);
            expect(body).toHaveLength(11);
            body.forEach((comment) => {
                expect(comment.comment_id).toEqual(expect.any(Number));
                expect(comment.votes).toEqual(expect.any(Number)); 
                expect(comment.created_at).toEqual(expect.any(String));
                expect(comment.author).toEqual(expect.any(String)); 
                expect(comment.body).toEqual(expect.any(String)); 
            })
        })
    });
    it('Status: 200 and an empty array when a valid article has no comments', () => {
        return request(app)
        .get('/api/articles/2/comments')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true); 
            expect(body).toHaveLength(0); 
        })
    });
    it('Status: 404 and an error message if request contains a valid ID that does not exist on the database', () => {
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("No article found for article_id: 9999")
        })
    });
    it('Status: 400 and an error message when request contains an invalid ID', () => {
        return request(app)
        .get('/api/articles/dogs/comments')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type"); 
        })
    });
});

describe('PATCH /api/articles/:article_id', () => {
    it('Status: 200 and a successfully updated article object', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 100 })
        .expect(200)
        .then(({ body }) => {
            expect(typeof body).toBe("object"); 
            expect(body.title).toBe("Living in the shadow of a great man"); 
            expect(body.topic).toBe("mitch");
            expect(body.author).toBe("butter_bridge");
            expect(body.body).toBe("I find this existence challenging"); 
            expect(body.created_at).toBe("2020-07-09T20:11:00.000Z");
            expect(body.votes).toBe(200);
        })
    });
    it('Status: 400 and an error message if the request is missing the required fields', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({other_things: "yes"})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Missing required fields")
        })
    });
    it('Status: 400 and an error message if the request is of the incorrect data type', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: "dog" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type"); 
        })
    });
    it('Status: 404 and an error message when request contains a valid Id that does not exist in the database', () => {
        return request(app)
        .patch('/api/articles/1000')
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("No article found for article_id: 1000")
        })
    });
    it('Status: 400 and an error message when request contains an invalid id', () => {
        return request(app)
        .patch('/api/articles/dogs')
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type"); 
        })
    });
});

describe('POST /api/articles/:article_id/comments', () => {
    it('Status: 204 and an object containing the posted comment', () => {
        return request(app)
        .post('/api/articles/4/comments')
        .send({ 
            username: "butter_bridge", 
            body: "This is a comment about how great this article is"
        })
        .expect(201)
        .then(({ body }) => {
            expect(typeof body).toBe("object");
            expect(body.body).toBe("This is a comment about how great this article is");
            expect(body.votes).toBe(0);
            expect(body.author).toBe("butter_bridge"); 
            expect(body.article_id).toBe(4);
            expect(body.created_at).toEqual(expect.any(String));
            expect(body.comment_id).toBe(19);
        })
    });
    it('Status: 404 and a error message when request contains a valid id that is not in the database', () => {
        return request(app)
        .post('/api/articles/9999/comments')
        .send({ 
            username: "butter_bridge", 
            body: "This is a comment about how great this article is"
        })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe(`No article found for article_id: 9999`); 
        })
    });
    it('Status: 400 and an error message when request contains an invalid id', () => {
        return request(app)
        .post('/api/articles/dogs/comments')
        .send({ 
            username: "butter_bridge", 
            body: "This is a comment about how great this article is"
        })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type"); 
        })
    });
    it('Status: 400 and an error message if the request is missing the required fields', () => {
        return request(app)
        .post('/api/articles/1/comments')
        .send({other_things: "yes"})
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Missing required fields")
        })
    });
    it('Status: 404 and error message if the user does not exist in the users database', () => {
        return request(app)
        .post('/api/articles/3/comments')
        .send({username: "Hello-friend",
                body: "I am not a real user"})
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("User not found")
        })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('Status: 204 and no content upon succesful deletion', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
    });
    it('Status: 404 and an error message when request contains a valid id that does not exist on the database', () => {
        return request(app)
        .delete('/api/comments/999')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("Comment not found"); 
        })
    });
    it('Status: 400 and an error message when request contains an invalid id', () => {
        return request(app)
        .delete('/api/comments/cats')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type")
        })
    });
});