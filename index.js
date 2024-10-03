const express = require('express')
const path = require('path')
const app = express()
const port = 8989

app.use(express.static('./public'))
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './index.html'))
})

app.listen(port, () => {
    console.log(`O site pode ser acessado em http://localhost:${port}`)
})