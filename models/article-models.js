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

module.exports = { fetchArticleByArticleID, }