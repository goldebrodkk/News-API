const express = require('express'); 

const { getTopics } = require('./controllers/topic-controller'); 
const { getUsers } = require('./controllers/user-controller')
const { getArticleByArticleID, updateArticleByArticleID, } = require('./controllers/article-controller')


const app = express(); 

app.use(express.json()); 

app.get('/api/topics', getTopics); 

app.get('/api/users', getUsers); 

app.get('/api/articles/:article_id', getArticleByArticleID); 

app.patch('/api/articles/:article_id', updateArticleByArticleID)

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg }); 
    } else {
        next(err); 
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: "Request contains invalid type"})
    }
})

app.use((req, res, next) => {
    res.status(404).send({ msg: "Invalid path"})
})

module.exports = app; 