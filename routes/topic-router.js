const topicRouter = require('express').Router(); 
const { getTopics } = require('../controllers/topic-controller.js');

topicRouter
    .route('/')
    .get(getTopics); 

module.exports = topicRouter;