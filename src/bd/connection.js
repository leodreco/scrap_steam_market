const mysql = require('mysql2/promise');

const consult = async (sql, params = null) => {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '12345678',
        database: 'steam_market'
    });
    
    var [rows,fields] = await connection.execute(
        sql,
        params
    );
    connection.end();
    return Promise.resolve(rows);
}

module.exports = consult;

// (async () => {
//     var result = await consult('SELECT 1 + 2 as number');
//     console.log(result[0]);
// })();