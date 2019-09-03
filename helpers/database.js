var mysql = require('mysql')
var db_name =  'Backend-'+ (process.env.NODE_ENV || 'dev'),
//process.env.NODE_ENV === 'production' && 'Backend' || 'Backend-dev',
    db_host = '13.68.196.225',
    //db_host = 'localhost',
    db_pass = 'ferios08',
    db_user = 'root'

var db = mysql.createPool({
    host: db_host,
    port: 3306,
    user: db_user,
    password: db_pass,
    database: db_name
})

db.getConnection((err) => {
    if (err) console.log('db error: ', err)
})

module.exports = db
