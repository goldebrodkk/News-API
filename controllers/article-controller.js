const { fetchArticleByArticleID,
        patchArticleByArticleID, } = require('../models/article-models'); 

const getArticleByArticleID = (req, res, next) => {
    const id = req.params.article_id; 
    fetchArticleByArticleID(id)
    .then((article) => {
        res.status(200).send(article); 
    }).catch((err) => {
        next(err); 
    })

}

const updateArticleByArticleID = (req, res, next) => {
    const { article_id } = req.params; 
    const { inc_votes } = req.body; 
    patchArticleByArticleID(article_id, inc_votes)
    .then((article) => {
        res.status(200).send(article); 
    }).catch((err) => {
        console.log(err);
        next(err); 
    })
}

module.exports = { getArticleByArticleID,
                   updateArticleByArticleID, }