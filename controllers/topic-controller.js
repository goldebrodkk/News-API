const { fetchTopics } = require('../models/topic-models.js');

const getTopics = (req, res) => {
    return fetchTopics().then((topics) => {
        res.status(200).send(topics); 
    })
}

module.exports = { getTopics, }