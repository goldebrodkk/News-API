const { fetchArticleByArticleID } = require('../models/article-models'); 

const getArticleByArticleID = (req, res, next) => {
    const id = req.params.article_id; 
    fetchArticleByArticleID(id)
    .then((article) => {
        res.status(200).send(article); 
    }).catch((err) => {
        next(err); 
    })

}

module.exports = { getArticleByArticleID, }