const db = require('../db/connection'); 

const fetchArticleByArticleID = (id) => {
   return db.query('SELECT * FROM articles WHERE article_id = $1;', [id])
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
                    patchArticleByArticleID, }