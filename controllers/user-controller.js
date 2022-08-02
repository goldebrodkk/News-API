const { fetchUsers } = require('../models/user-model'); 

const getUsers = (req, res) => {
    fetchUsers().then((users) => {
        res.status(200).send(users); 
    }) 
}

module.exports = { getUsers, }