const mysql = require('mysql2');
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWD = process.env.DB_PASSWD || "FDelgadoG1209F";
const DB_NAME = process.env.DB_NAME || "libreria";
const DB_PORT = process.env.DB_PORT || "3306";

const CONNECTION = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWD,
    database: DB_NAME,
    port: DB_PORT,
    connectionLimit: 20,
    enableKeepAlive: true
});

/*CONNECTION.getConnection((err, conn) => {
    if(err){
        console.log("Error en la conexion con la BD", err);
        return;
    }
    console.log("Conexión con la BD exitosa: " + DB_HOST);
    CONNECTION.releaseConnection(conn);
});*/

module.exports = CONNECTION;