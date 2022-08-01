const topicRouter = require('express').Router(); 
const { fetchTopics } = require('../models/topic-models.js');

topicRouter
    .route('/')
    .get((req, res) => {
        return fetchTopics().then((topics) => {
            res.status(200).send(topics); 
        })
    }); 

module.exports = topicRouter;