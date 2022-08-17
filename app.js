const express = require('express'); 
const { getTopics } = require('./controllers/topic-controller'); 
const { getUsers } = require('./controllers/user-controller')
const { getArticleByArticleID, 
        updateArticleByArticleID, 
        getArticles } = require('./controllers/article-controller')
const { getCommentsByArticleID,
        postCommentByArticleID,
        removeCommentByCommentID } = require('./controllers/comment-controller')
const endpoints = require('./endpoints.json')


const app = express(); 

app.use(express.json()); 

app.get('/api', (req, res, next) => {
    res.status(200).send(endpoints); 
})

app.get('/api/topics', getTopics); 

app.get('/api/users', getUsers); 

app.get('/api/articles', getArticles); 

app.get('/api/articles/:article_id', getArticleByArticleID); 

app.patch('/api/articles/:article_id', updateArticleByArticleID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

app.post('/api/articles/:article_id/comments', postCommentByArticleID);

app.delete('/api/comments/:comment_id', removeCommentByCommentID);

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
    res.status(404).send({ msg: "Invalid path"});
})

module.exports = app; 