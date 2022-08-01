const app = require('./app.js'); 
const port = 9090; 

app.listen(port, () => {
    console.log(`Server listening on port ${port}`); 
})