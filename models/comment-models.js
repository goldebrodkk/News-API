const db = require('../db/connection'); 
const { checkArticleExists,
        checkUserExists,
        checkCommentExists } = require('../db/check-functions')

const fetchCommentsByArticleID = (article_id) => {
    return checkArticleExists(article_id).then(() => {
        return db.query(`SELECT comment_id, votes, created_at, author, body
                     FROM comments 
                     WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        const comments = rows; 
        return comments; 
    })
  })
}

const insertCommentByArticleID = (article_id, username, body) => {
    if(!body) {
        return Promise.reject({
            status: 400, 
            msg: 'Missing required fields'
        })
    } 
    return checkArticleExists(article_id).then(() => {
        return checkUserExists(username)
    }).then(() => {
        return db.query(`INSERT INTO comments (article_id, author, body) 
              VALUES ($1, $2, $3) RETURNING *`, [article_id, username, body])
    }).then(({ rows: [comment] }) => {
        return comment; 
    })
}; 

const patchCommentByCommentID = (comment_id, inc_votes) => {
    if (!inc_votes) {
        return Promise.reject({
            status: 400, 
            msg:"Missing required fields"
        })
    } else {
        return db.query(`UPDATE comments SET votes = votes + $1 WHERE comment_id = $2 RETURNING *`, [inc_votes, comment_id])
        .then(({ rows: [comment] }) => {
            if(!comment) {
                return Promise.reject({
                    status: 404, 
                    msg: `No comment found for comment_id: ${comment_id}`
                })
            }
            return comment; 
        })
    }
}

const deleteCommentByCommentID = (comment_id) => {
    return checkCommentExists(comment_id)
    .then(() => {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]) 
    })
}

module.exports = {
    fetchCommentsByArticleID,
    insertCommentByArticleID,
    deleteCommentByCommentID, 
    patchCommentByCommentID
}