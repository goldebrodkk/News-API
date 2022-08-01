const app = require('../app.js'); 
const request = require('supertest'); 
const seed = require('../db/seeds/seed.js');
const testData = require('../db/data/test-data/index.js');

beforeEach(() => seed(testData)); 

describe('GET /api/topics', () => {
    it('should return an array of objects', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true); 
        });
    });
});

describe('GET error', () => {
    it('should return a 404 error when a GET request is made to an invalid route', () => {
        return request(app)
        .get('/api/life')
        .expect(404)
    });
});