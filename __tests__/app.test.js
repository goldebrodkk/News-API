const app = require('../app.js'); 
const request = require('supertest'); 
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');
const db = require('../db/connection.js')

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

describe('GET api/article/:article_id', () => {
    it('Status: 200 and an object with the relevant article id', () => {
        return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then(({ body }) => {
            expect(typeof body).toBe("object"); 
            expect(body.article_id).toBe(1); 
            expect(body.title).toEqual('Living in the shadow of a great man'); 
            expect(body.topic).toEqual('mitch');
            expect(body.author).toEqual('butter_bridge'); 
            expect(body.created_at).toEqual("2020-07-09T20:11:00.000Z"); 
            expect(body.votes).toEqual(100); 
        })
    });
    it('Status: 404 and an error message when given a valid Id that does not exist in the database', () => {
        return request(app)
        .get('/api/articles/1000')
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("No article found for article_id: 1000")
        })
    });
    it('Status: 400 and an error message when given an invalid id', () => {
        return request(app)
        .get('/api/articles/dogs')
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
        .send({ inc_votes: 100})
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
    it('Status: 400 and an error message if the patch request is missing the required fields', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: 0 })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Missing required fields")
        })
    });
    it('Status: 400 and an error message if the patch request is of the incorrect type', () => {
        return request(app)
        .patch('/api/articles/1')
        .send({ inc_votes: "dog" })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type"); 
        })
    });
    it('Status: 404 and an error message when given a valid Id that does not exist in the database', () => {
        return request(app)
        .patch('/api/articles/1000')
        .send({ inc_votes: 100 })
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe("No article found for article_id: 1000")
        })
    });
    it('Status: 400 and an error message when given an invalid id', () => {
        return request(app)
        .patch('/api/articles/dogs')
        .send({ inc_votes: 100 })
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe("Request contains invalid type"); 
        })
    });
});