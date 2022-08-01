const express = require('express'); 
const topicRouter = require('./routes/topic-router'); 

const app = express(); 

app.use('/api/topics', topicRouter); 


module.exports = app; 