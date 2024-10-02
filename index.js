const html = require('html')
const express = require('express')
const app = express()
const port = 8989

app.use(express.static('public'))
app.use('/bootstrap', express.static(__dirname, '/node_modules/'))

app.get('/', (req, res) => {
    res.send()
})

app.listen(port, () => {
    console.log("Servidor aberto na porta " + port)
})