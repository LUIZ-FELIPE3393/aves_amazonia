const express = require('express')
const path = require('path')
const app = express()
const port = 8989

app.use(express.urlencoded({ extended: false }))
app.use('/', express.static(path.join(__dirname, 'node_modules', 'tinymce')))
app.use('/public', express.static('./public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './src/index.html'))
})

app.get('/add-bird-page', (req, res) => {
    res.sendFile(path.join(__dirname, './src/pages/add_bird.html'))
})

app.post('/add-bird', (req, res) => {
    console.log(req.body)
})

app.listen(port, () => {
    console.log(`O site pode ser acessado em http://localhost:${port}`)
})