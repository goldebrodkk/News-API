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

const fetchArticles = (sortOn = 'created_at', order = 'DESC', term) => {
    let basicQuery = `SELECT articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_id, 
    (SELECT COUNT(comment_id) :: INT) AS comment_count 
     FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id `
     let basicQuery2 = `
     GROUP BY articles.article_id`;

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
    
    switch (sortOn) {
        case "title":
            if (order === "DESC") {
                basicQuery2 += ' ORDER BY title DESC;'
            } else if (order === "ASC") {
                basicQuery2 += ' ORDER BY title ASC;'
            }
            break;
        case "author": 
            if (order == "DESC") {
                basicQuery2 += ' ORDER BY author DESC;'
            } else if (order === "ASC") {
                basicQuery2 += ' ORDER BY author ASC;'
            }
            break; 
        case "article_id": 
            if (order === "DESC") {
                basicQuery2 += ' ORDER BY article_id DESC;'
            } else if (order === "ASC") {
                basicQuery2 += ' ORDER BY article_id ASC;'
            }
            break; 
        case "created_at": 
            if (order === "DESC") {
                basicQuery2 += ' ORDER BY created_at DESC;'
            } else if (order === "ASC") {
                basicQuery2 += ' ORDER BY created_at ASC;'
            }
            break;
        case "votes": 
            if (order === "DESC") {
                basicQuery2 += ' ORDER BY votes DESC;'
            } else if (order === "ASC") {
                basicQuery2 += ' ORDER BY votes ASC;'
            }
            break; 
        case "comment_count": 
            if (order === "DESC") {
                basicQuery2 += ' ORDER BY comment_count DESC;'
            } else if (order === "ASC") {
                basicQuery2 += ' ORDER BY comment_count ASC;'
            }
            break; 
        case "topic": 
            if (order === "DESC") {
                basicQuery2 += ' ORDER BY topic DESC;'
            } else if (order === "ASC") {
                basicQuery2 += ' ORDER BY topic ASC;'
            }
    }

    if (term) {
       return checkTopicExists(term).then(() => {
            basicQuery += ` WHERE articles.topic = '${term}' `
            basicQuery += basicQuery2; 
            return db.query(basicQuery)
            .then(({ rows }) => {
                return rows; 
            })
        })
    }

    basicQuery += basicQuery2

    return db.query(basicQuery)
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