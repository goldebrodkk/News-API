const express = require('express'); 
const { getTopics } = require('./controllers/topic-controller'); 
const { getUsers,
        getUserByUsername } = require('./controllers/user-controller')
const { getArticleByArticleID, 
        updateArticleByArticleID, 
        getArticles } = require('./controllers/article-controller')
const { getCommentsByArticleID,
        postCommentByArticleID,
        removeCommentByCommentID,
        updateCommentByCommentID } = require('./controllers/comment-controller');
const { handlePsqlErrors,
        handleCustomErrors,
        handlePathErrors } = require('./errors/index')
const endpoints = require('./endpoints.json'); 


const app = express(); 

app.use(express.json()); 

app.get('/api', (req, res, next) => {
    res.status(200).send(endpoints); 
})

app.get('/api/topics', getTopics); 

app.get('/api/users', getUsers); 

app.get('/api/users/:username', getUserByUsername);

app.get('/api/articles', getArticles); 

app.get('/api/articles/:article_id', getArticleByArticleID); 

app.patch('/api/articles/:article_id', updateArticleByArticleID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID);

app.patch('/api/comments/:comment_id', updateCommentByCommentID); 

app.post('/api/articles/:article_id/comments', postCommentByArticleID);

app.delete('/api/comments/:comment_id', removeCommentByCommentID);

app.use(handleCustomErrors)

app.use(handlePsqlErrors)

app.use(handlePathErrors)

module.exports = app; 