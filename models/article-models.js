const db = require('../db/connection'); 
const { checkTopicExists, 
        checkArticleExists,
        checkUserExists, 
        checkCommentExists } = require('../db/check-functions')

const fetchArticles = (sortOn = 'created_at', order = 'DESC', term) => {
    let basicQuery = `SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_id, 
    (SELECT COUNT(comment_id) :: INT) AS comment_count 
     FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `

     if (!["title", "author", "article_id", "created_at", "votes", "comment_count", "topic"].includes(sortOn)) {
        return Promise.reject({
            status: 400, 
            msg: "Invalid sort query"
        }); 
    }
    if (!["ASC", "DESC"].includes(order)) {
        return Promise.reject({
            status: 400,
            msg: "Invalid order query"
        })
    }
    let basicQuery2 = `
     GROUP BY articles.article_id ORDER BY ${sortOn} ${order}`;

    if (term) {
       return checkTopicExists(term).then(() => {
            basicQuery += ` WHERE articles.topic = '${term}' `
            basicQuery += basicQuery2; 
        }).then(() => {
            return db.query(basicQuery)
        }).then(({ rows }) => {
            return rows; 
        })
    } else { 
        basicQuery += basicQuery2
        return db.query(basicQuery)
        .then(({ rows }) => {
        return rows;
    })
  }
}

const fetchArticleByArticleID = (id) => {
   return db.query(`SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.body, comments.article_id, 
                   (SELECT COUNT(comment_id) :: INT) AS comment_count 
                    FROM articles INNER JOIN comments ON articles.article_id = comments.article_id 
                    WHERE articles.article_id = $1 GROUP BY articles.article_id, comments.article_id`, [id])
    .then(({ rows }) => {
        const user = rows; 
        if (!user[0]) {
            return Promise.reject({
                status: 404, 
                msg: `No article found for article_id: ${id}`
            })
        } 
        return user[0]; 
    })
}

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


const patchArticleByArticleID = (article_id, inc_votes) => {
    if (!inc_votes) {
        return Promise.reject({
            status: 400, 
            msg: "Missing required fields"
        }); 
    } else {
    return db.query('UPDATE articles SET votes = votes + $1 WHERE article_id = $2 returning *;', [inc_votes, article_id])
    .then(({ rows }) => {
        const user = rows[0]; 
        if(!user) {
            return Promise.reject ({
                status: 404, 
                msg: `No article found for article_id: ${article_id}`
            });
        }; 
        return user; 
    });  
  }
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
}

const deleteCommentByCommentID = (comment_id) => {
    return checkCommentExists(comment_id)
    .then(() => {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id]) 
    })
}

module.exports = { fetchArticleByArticleID,
                    patchArticleByArticleID,
                    fetchArticles, 
                    fetchCommentsByArticleID, 
                    insertCommentByArticleID,
                    deleteCommentByCommentID, }