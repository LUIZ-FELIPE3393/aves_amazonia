const BirdRoutes = require('express').Router()
const {queryDatabase, tranAddBird} = require('../db.js')
const multer = require('multer')

const upload = multer({dest: './uploads'})

const fileErrorHandler = async (err, res) => {
    await queryDatabase('ROLLBACK')
    res.status(500).send('File upload error: ' + JSON.stringify(err))   
}

BirdRoutes.post('/', upload.array('images'), async (req, res) => {
    tranAddBird(req, res).then(json => {
        console.log(json)
        res.redirect('/gerenciar-ave')
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

BirdRoutes.get('/like/:letter', (req, res) => {
    queryDatabase(`SELECT * FROM bird_data WHILE bdt_nome LIKE '${req.params.letter}'`)
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