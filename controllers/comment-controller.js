const {
    fetchCommentsByArticleID,
    insertCommentByArticleID,
    deleteCommentByCommentID
} = require('../models/comment-models')

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
	deleteCommentByCommentID(comment_id).then(() => {
        res.status(204).send(); 
    }).catch((err) => {
        next(err); 
    })
};

module.exports = {
    getCommentsByArticleID, 
    postCommentByArticleID, 
    removeCommentByCommentID
}