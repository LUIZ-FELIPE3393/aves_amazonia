const BirdRoutes = require('express').Router()
const {queryDatabase} = require('../db.js')
const tranAddBird = require('../dao/bird-dao.js')
const multer = require('multer')

const upload = multer({dest: './uploads'})

const fileErrorHandler = async (err, res) => {
    await queryDatabase('ROLLBACK')
    res.status(500).send('File upload error: ' + JSON.stringify(err))   
}

BirdRoutes.put('/', upload.array('images'), async (req, res) => {
    console.log('result')
    queryDatabase(`SELECT * FROM bird_data WHERE bdt_nome = '${req.body['name']}'`).then(result => {
        console.log(result)
        tranAddBird(req, res).then(json => {
            console.log(json)
            res.redirect('/gerenciar-ave')
        })
    })
})

BirdRoutes.get('/', (req, res) => {
    queryDatabase(`SELECT bdt_id, bdt_nome, bdt_nomecientifico, MIN(bim_image) AS thumbnail
                    FROM bird_data 
                    INNER JOIN bird_image ON bim_bdt_id = bdt_id 
                    GROUP BY (bdt_id)`)
        .then(json => {
            res.json(json)
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

BirdRoutes.get('/:id', (req, res) => {
    queryDatabase(`SELECT bdt_nome, bdt_nomecientifico, bdt_descricao, bdt_escextincao
                    FROM bird_data
                    WHERE bdt_id = ${req.params['id']}
                    `)
        .then(birdJson => {
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

                birdJson[0]['images'] = imageArr;

                res.json(birdJson[0])
            })
        })
        .catch(sql_err => {
            res.status(500).send(sql_err)
            return
        });
})

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