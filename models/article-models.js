const db = require('../db/connection'); 



const fetchArticles = () => {
    return db.query(`SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_id, 
                    (SELECT COUNT(comment_id) :: INT) AS comment_count 
                     FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id 
                     GROUP BY articles.article_id
                     ORDER BY created_at DESC`)
    .then(({ rows }) => {
        return rows;
    })
}

const fetchArticleByArticleID = (id) => {
   return db.query(`SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, comments.article_id, 
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

const insertCommentByArticleID = (article_id, username, body) => {
    if(!body) {
        return Promise.reject({
            status: 400, 
            msg: 'Missing required fields'
        })
    } 
return checkArticleExists(article_id).then(() => {
    return checkUserExists(username).then(() => {
  return db.query(`INSERT INTO comments (article_id, author, body) 
              VALUES ($1, $2, $3) RETURNING *`, [article_id, username, body])
    .then(({ rows: [comment] }) => {
        return comment;
    })
  })
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

const deleteCommentByCommentID = (comment_id) => {
    return checkCommentExists(comment_id)
    .then(() => {
        return db.query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
        .then(({ rows }) => {
            return rows
        })  
    })
}


module.exports = { fetchArticleByArticleID,
                    patchArticleByArticleID,
                    fetchArticles, 
                    fetchCommentsByArticleID, 
                    insertCommentByArticleID,
                    deleteCommentByCommentID, }