const express = require('express')
const path = require('path')
const app = express()
const port = 8989

app.use('/public', express.static('./public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './src/index.html'))
})

app.listen(port, () => {
    console.log(`O site pode ser acessado em http://localhost:${port}`)
})