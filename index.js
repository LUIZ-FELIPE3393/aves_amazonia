const express = require('express')
const path = require('path')
const fs = require('fs')
const BirdRoutes = require('./src/routes/birdRoutes')
const app = express()
const port = 8989

global.appRoot = path.resolve(__dirname);

app.use(express.urlencoded({ extended: false }))
app.use('/', express.static(path.join(__dirname, 'node_modules', 'tinymce')))
app.use('/axios', express.static(path.join(__dirname, 'node_modules', 'axios')))
app.use('/public', express.static('./public'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './src/index.html'))
})

app.get('/gerenciar-ave', (req, res) => {
    res.sendFile(path.join(__dirname, './src/pages/bird_manager.html'))
})

app.get('/adicionar-ave', (req, res) => {
    res.sendFile(path.join(__dirname, './src/pages/bird_add.html'))
})

app.get('/artigo-ave', (req, res) => {
    res.sendFile(path.join(__dirname, './src/pages/bird_page.html'))
})

//Rotas banco
app.use('/bird', BirdRoutes)

app.listen(port, () => {
    console.log(`O site pode ser acessado em http://localhost:${port}`)
})

app.get('/readFile/:name', (req, res) => {
    const file = fs.readFileSync(path.join(__dirname, '/public/html/birds/' + req.params['name']), {encoding: 'utf-8'});
    res.send(file)
})