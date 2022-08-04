const express = require('express'); 

const { getTopics } = require('./controllers/topic-controller'); 
const { getUsers } = require('./controllers/user-controller')
const { getArticleByArticleID, 
        updateArticleByArticleID, 
        getArticles, 
        getCommentsByArticleID, 
        postCommentByArticleID, } = require('./controllers/article-controller')


const app = express(); 

app.use(express.json()); 

app.get('/api/topics', getTopics); 

app.get('/api/users', getUsers); 

app.get('/api/articles', getArticles); 

app.get('/api/articles/:article_id', getArticleByArticleID); 

app.get('/api/articles/:article_id/comments', getCommentsByArticleID)

app.patch('/api/articles/:article_id', updateArticleByArticleID)

app.post('/api/articles/:article_id/comments', postCommentByArticleID) 

app.use((err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg }); 
    } else {
        next(err); 
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23503') {
        res.status(400).send({ msg: "Request contains invalid type"})
    } else {
        next(err); 
    }
})

app.use((req, res, next) => {
    res.status(404).send({ msg: "Invalid path"})
})

module.exports = app; 