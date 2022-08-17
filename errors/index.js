const handleCustomErrors = (err, req, res, next) => {
    if (err.status && err.msg) {
        res.status(err.status).send({ msg: err.msg }); 
    } else {
        next(err); 
    }
}

const handlePsqlErrors = (err, req, res, next) => {
    if (err.code === '22P02' || err.code === '23503') {
        res.status(400).send({ msg: "Request contains invalid type"})
    } else {
        next(err); 
    }
}

const handlePathErrors = (req, res, next) => {
    res.status(404).send({ msg: "Invalid path"});
}

module.exports = { handlePsqlErrors,
                   handleCustomErrors,
                   handlePathErrors }