const mysql = require('mysql')
const util = require('util')
const fs = require('fs')
const path = require('path')

const fileErrorHandler = async (conn, err, res) => {
    conn.rollback()
    console.error('FILE ERROR - ', err)
    res.status(500).send('File upload error: ' + JSON.stringify(err))   
}

async function tranAddBird(req, res) {
    /*
        ## transação adição de registro de pássaro junto de sua galeria
        @param: 
            Req: Dados sobre o pássaro
            Res: Parâmetro de resposta, retorna o estado da operação 
        @return: Sucesso: Resultset da procedure SQL | Erro: Nada
    */
    const normalName = req.body.name.normalize('NFD').replace(/[\u0300-\u036f]|\s/g, '').toLowerCase()
    const imageTargetPath = path.join(appRoot, '/public/images/birds/' + normalName)
    const articleTargetPath = path.join(appRoot, '/public/html/birds/' + normalName)
    var imagesStr = '';

    for (const file of req.files) {
        imagesStr += '/' + normalName + '/' + file.originalname + ';'
    }

    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'membro',
        password: '123456',
        database: 'aves_amazonia'
    })
    const connQuery = util.promisify(connection.query).bind(connection)
    connection.connect()
    try {
        connection.beginTransaction()

        const resultSet = await connQuery(`CALL sp_add_bird('${req.body['name']}', '${req.body['binomial']}', ${req.body['extinction']},`+
            ` '${imagesStr}', '${normalName + '.html'}')`)

        fs.writeFileSync(articleTargetPath + '.html', req.body['descricao']);
        
        var index = 1;
        if (!fs.existsSync(imageTargetPath)) {
            fs.mkdirSync(imageTargetPath);
        }
        for (const file of req.files) {
            //console.log('\n\n*File:', file)
            const fileExtension = path.extname(file.originalname).toLowerCase();
            const tempPath = appRoot + '\\' + file.path

            switch(fileExtension) {
                case '.jpg':
                case '.jpeg':
                    fs.rename(tempPath, imageTargetPath + '/' + file.originalname, 
                        err => { 
                            if (err) fileErrorHandler(connection, err, res);   
                        })
                    break;
                case '.png':
                    fs.rename(tempPath, imageTargetPath + '/' + file.originalname, 
                        err => { 
                            if (err) fileErrorHandler(connection, err, res);
                        })
                    break;
                case '.webp':   
                    fs.rename(tempPath, imageTargetPath + '/' + file.originalname, 
                        err => { 
                            if (err) fileErrorHandler(connection, err, res);
                        })
                    break;
                default: 
                    connection.rollback()   
                    res.status(500).send(`File upload error: File format (${fileExtension}) not supported`)   
                    break;
            }  
            index++
        }   
    
        connection.commit()
        return resultSet
    } catch (err) {
        for (const file of req.files) {
            fs.unlink(file.path, err => {
                if (err) fileErrorHandler(err, res) 
            })
        }
        connection.rollback()
        console.error('Query error: ', err)
        res.status(500).send(err)
    } finally {
        connection.end()
    }
}

module.exports = tranAddBird