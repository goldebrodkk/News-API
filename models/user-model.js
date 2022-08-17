const db = require('../db/connection'); 

const fetchUsers = () => {
    return db.query('SELECT * FROM users;')
    .then(({ rows }) => {
        return rows; 
    })
}

const fetchUsersByUsername = (username) => {
    return db.query('SELECT * FROM users WHERE username = $1', [username])
    .then(({ rows: [user] }) => {
        if (!user) {
            return Promise.reject({
                status: 404, 
                msg: `No user found with username ${username}`
            })
        }
        return user; 
    })
}

module.exports = { fetchUsers,
                   fetchUsersByUsername }