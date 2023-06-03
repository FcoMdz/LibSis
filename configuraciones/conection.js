const mysql = require('mysql');
const CONNECTION = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "libreria"
});
CONNECTION.connect((err) =>{
    if(err){
        console.log("Error en la conexion con la BD", err);
        return;
    }
    console.log("Conexión con la BD exitosa");
});
module.exports = CONNECTION;