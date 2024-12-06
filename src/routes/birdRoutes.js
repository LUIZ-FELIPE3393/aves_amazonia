const BirdRoutes = require('express').Router()
const {queryDatabase} = require('../db.js')
const BirdDAO = require('../dao/birdDao.js')
const multer = require('multer')
const fs = require('fs')
const path = require('path')

const upload = multer({dest: './uploads'})

const fileErrorHandler = async (err, res) => {
    await queryDatabase('ROLLBACK')
    res.status(500).send('File upload error: ' + JSON.stringify(err))   
}

// Rota de adição/atualização de entrada
BirdRoutes.put('/', upload.array('images'), async (req, res) => {
    queryDatabase(`SELECT * FROM bird_data WHERE bdt_nome = '${req.body['name']}'`).then(result => {
        console.log(result, req.body)
        if (result.length === 0) {
            // Caso a entrada não exista, adicione
            console.log("🐦 Novo pássaro: transação de adição")
            BirdDAO.tranAddBird(req, res).then(json => {
                console.log("✅ Fim da transação:", json)
                res.status(200).send("Pássaro adicionado com sucesso")
            }).catch(err => {
                console.error("❌ Transação retornou com erro:", err)
                res.status(500).send("Erro ao adicionar pássaro");
            })
        } else {
            // Caso a entrada exista, atualize
            console.log("🐦 Pássaro existente: transação de atualização")
            BirdDAO.tranAddBird(req, res, result[0]['bdt_id']).then(json => {
                console.log("Fim da transação:", json)
                res.status(200).send("Pássaro atualizado com sucesso")
            }).catch(err => {
                console.error("❌ Transação retornou com erro:", err)
                res.status(500).send("Erro ao atualizar pássaro");
            })
        }
    }).catch(e => {
        console.error("ERRO - Falha em consultar informações sobre os pássaros: ", e);
        res.status(500).send(e);
    })
})

// Rota de pegar todas as entradas
BirdRoutes.get('/', (req, res) => {
    queryDatabase(`SELECT bdt_id, bdt_nome, bdt_nomecientifico, MIN(bim_image) AS thumbnail
                    FROM bird_data 
                    LEFT JOIN bird_image ON bim_bdt_id = bdt_id 
                    GROUP BY (bdt_id)`)
        .then(json => { 
            res.json(json)
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

// Rota para ler entrada específica
BirdRoutes.get('/:id', (req, res) => {
    queryDatabase(`SELECT bdt_nome, bdt_nomecientifico, bdt_descricao, bdt_escextincao
                    FROM bird_data
                    WHERE bdt_id = ${req.params['id']}
                    `)
        .then(birdJson => {
            const birdHTMLPath = path.join(appRoot, '/public/html/birds/', birdJson[0]['bdt_descricao'])
            queryDatabase('SELECT bim_image FROM bird_image WHERE bim_bdt_id = ' + req.params['id']).then(imageJson => {
                var imageArr = []
                for (const image of imageJson) {
                    imageArr.push(image['bim_image'])
                }
                
                if (birdJson[0] === undefined) {
                    console.error('BirdJson is undefined')
                    console.log(birdJson)
                    res.status(500).send('BirdJson is undefined')
                    return
                }

                birdJson[0]['imagens'] = imageArr;

                try {
                    birdJson[0]['descricao'] = fs.readFileSync(birdHTMLPath, {encoding: 'utf-8', flag: 'r'})
                    console.log(birdJson[0]['descricao'])
                } catch (error) {
                    console.error('Bird HTML File could not be opened:', error)
                }

                res.json(birdJson[0])
            })
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

// Rota para pegar as entradas conforme a letra inicial do nome da entrada
BirdRoutes.get('/like/:letter', (req, res) => {
    queryDatabase(`SELECT * FROM bird_data WHILE bdt_nome LIKE '${req.params['letter']}'`)
        .then(json => {
            res.json(json)
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

// Rota para pegar as letras que são iniciais do nome de alguma entrada
BirdRoutes.get('/letters', (req, res) => {
    queryDatabase('SELECT DISTINCT LEFT(bdt_nome, 1) AS letra FROM bird_data')
        .then(json => {
            res.json(json)
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

// Rota para pegar uma entrada pelo nome
BirdRoutes.get('/images/:birdName', (req, res) => {
    queryDatabase(`CALL sp_list_bird_images("${req.params['birdName']}")`)
        .then(json => {
            res.json(json)
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

// Rota de deleção por ID
BirdRoutes.delete('/:id', (req, res) => {
    queryDatabase(`CALL sp_delete_bird("${req.params['id']}")`)
        .then(json => {
            res.json(json)
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

module.exports = BirdRoutes