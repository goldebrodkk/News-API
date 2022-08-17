const app = require('./app.js'); 

const {PORT = 9090} = process.ENV 

app.listen(PORT); 