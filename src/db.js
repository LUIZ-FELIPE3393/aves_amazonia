const mysql = require('mysql')
const util = require('util')

async function queryDatabase(query) {
    const connection = mysql.createConnection({
        host: 'localhost',
        user: 'membro',
        password: '123456',
        database: 'aves_amazonia'
    })

    const connQuery = util.promisify(connection.query).bind(connection)
    
    connection.connect()

    try {
        const resultSet = await connQuery(query)
        return resultSet
    } finally {
        connection.end()
    }
}

module.exports = {queryDatabase}