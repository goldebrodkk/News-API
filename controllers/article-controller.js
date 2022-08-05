const {
	fetchArticleByArticleID,
	patchArticleByArticleID,
	fetchArticles,
	fetchCommentsByArticleID,
	insertCommentByArticleID,
	deleteCommentByCommentID,
} = require("../models/article-models");

const getArticles = (req, res) => {
	fetchArticles().then((article) => {
		res.status(200).send(article);
	});
};

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

const getCommentsByArticleID = (req, res, next) => {
	const {article_id} = req.params;
	fetchCommentsByArticleID(article_id)
		.then((comments) => {
			res.status(200).send(comments);
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

const postCommentByArticleID = (req, res, next) => {
	const {article_id} = req.params;
	const {username} = req.body;
	const {body} = req.body;
	insertCommentByArticleID(article_id, username, body)
		.then((comment) => {
			res.status(201).send(comment);
		})
		.catch((err) => {
			next(err);
		});
};

const removeCommentByCommentID = (req, res, next) => {
	const { comment_id } = req.params;
	deleteCommentByCommentID(comment_id).then((content) => {
        res.status(204).send(content); 
    }).catch((err) => {
        next(err); 
    })
};

module.exports = {
	getArticleByArticleID,
	updateArticleByArticleID,
	getArticles,
	getCommentsByArticleID,
	postCommentByArticleID,
	removeCommentByCommentID,
};
