const express = require('express'); 
const topicRouter = require('./routes/topic-router'); 

const app = express(); 

app.use('/api/topics', topicRouter); 

app.use((req, res, next) => {
    res.status(404).send({ msg: "Invalid path"})
})

module.exports = app; 