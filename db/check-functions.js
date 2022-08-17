const db = require('../db/connection'); 

const checkTopicExists = (term) => {
    return db.query(`SELECT * FROM topics WHERE slug = $1`, [term])
    .then(({ rows: [topic] }) => {
        if (!topic) {
            return Promise.reject({
                status: 404, 
                msg: "Topic not found"
            })
        }
    })
}

const checkArticleExists = (article_id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404, 
                msg: `No article found for article_id: ${article_id}`
            })
        }
    })
}

const checkUserExists = (username) => {
    return db.query(`SELECT * from users WHERE username = $1`, [username])
    .then(({ rows }) => {
        if (rows.length === 0 ) {
            return Promise.reject({
                status: 404,
                msg: "User not found"
            })
        }
    })
}

const checkCommentExists = (comment_id) => {
    return db.query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({
                status: 404, 
                msg: `Comment not found`
            })
        }
    })
}

module.exports = {
    checkTopicExists, 
    checkArticleExists,
    checkUserExists,
    checkCommentExists
}