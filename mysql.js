const {promisify} = require('util');
const mysql      = require('mysql');


const db = mysql.createConnection({
    host     : 'localhost',
    user     : process.env.DB_USER,
    password : process.env.DB_PW,
    database : 'steempress',
    charset: 'utf8mb4'
});

db.connect();
const db_promise = promisify(db.query).bind(db);

module.exports = {
    db_promise : db_promise,
};