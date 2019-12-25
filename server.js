const express = require('express')
const app = express()
const path = require('path');
const port = 8080

app.get('/', (req, res) => res.sendFile(path.join(__dirname+'/GA.html')))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))