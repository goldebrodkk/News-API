const { fetchUsers,
        fetchUsersByUsername } = require('../models/user-model'); 

const getUsers = (req, res) => {
    fetchUsers().then((users) => {
        res.status(200).send(users); 
    }) 
}

const getUserByUsername = (req, res, next) => {
    const { username } = req.params
    fetchUsersByUsername(username).then((user) => {
        res.status(200).send(user)
    }).catch((err) => {
        next(err); 
    })
}

module.exports = { getUsers, 
                   getUserByUsername}