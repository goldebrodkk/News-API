const {
	fetchArticleByArticleID,
	patchArticleByArticleID,
	fetchArticles,
} = require("../models/article-models");

const getArticles = (req, res, next) => {
    const { sortOn } = req.query; 
    const { order } = req.query; 
    const { term } = req.query; 
    fetchArticles(sortOn, order, term)
    .then((article) => {
        res.status(200).send(article); 
    }).catch((err) => {
        next(err); 
    })
}

const getArticleByArticleID = (req, res, next) => {
	const id = req.params.article_id;
	fetchArticleByArticleID(id)
		.then((article) => {
			res.status(200).send(article);
		})
		.catch((err) => {
			next(err);
		});
};

const updateArticleByArticleID = (req, res, next) => {
	const {article_id} = req.params;
	const {inc_votes} = req.body;
	patchArticleByArticleID(article_id, inc_votes)
		.then((article) => {
			res.status(200).send(article);
		})
		.catch((err) => {
			next(err);
		});
};

module.exports = {
	getArticleByArticleID,
	updateArticleByArticleID,
	getArticles
};
