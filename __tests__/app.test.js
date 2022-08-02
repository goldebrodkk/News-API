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
