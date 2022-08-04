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

module.exports = { fetchArticleByArticleID,
                    fetchArticles,
                    patchArticleByArticleID, }