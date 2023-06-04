const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const sql = require("./conection");

router.post('/login',
[
    body('usuario').not().isEmpty().isString(),
    body('contrasena').not().isEmpty().isString(),
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        return;
    }
    let body = req.body;
    let q = `SELECT nombre, vendedor, almacenista, cajero, enccompras, administrador FROM usuario WHERE usuario="${body.usuario}" AND contrasena="${body.contrasena}"`;
    sql.query(q, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }else if(sqlRes.length == 0){
            res.send({success:false});
            return;
        }
        res.send(sqlRes[0]);
    });
});

router.post('/RegProd', 
[
    body('ISBN').not().isEmpty().isString(),
    body('nombre').not().isEmpty().isString(),
    body('precio').not().isEmpty().isFloat(),
    body('existencias').not().isEmpty().isInt(),
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        return;
    }
    let body = req.body;
    var msg;
    sql.query(`INSERT INTO producto VALUES ("${body.ISBN}", "${body.nombre}", ${body.precio}, ${body.existencias})`,(sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({ array:null, 
                    success:false, 
                    err: JSON.stringify(sqlErr)
                });
            return;
        }
        res.send({
            array: sqlRes.affectedRows,
            success:true
        });
    });
}
);

router.post('/CrearNV', 
[
    body('idCte').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        return;
    }
    let body = req.body;
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }else{
            let productosGeneral = sqlRes;
            let productosAgregar = JSON.parse(body.ISBNProds);
            let productos = [];
            productosGeneral.forEach(producto => {
                let i = productosAgregar.map((e) => {return e.ISBN;}).indexOf(producto.ISBN);
                if(i!=-1){
                    let data = {
                        ISBN: producto.ISBN,
                        precio: producto.precio,
                        cantidad: productosAgregar[i].cant,
                        impuesto: producto.impuesto
                    }
                    productos.push(data);
                }
            });
            let fecha = new Date();
            fecha = fecha.toISOString().split("T")[0];
            sql.query(`INSERT INTO notaVenta (fechaVenta, clienteId_cte) VALUES ("${fecha}", ${body.idCte})`, (sqlErr, sqlRes) => {
                if(sqlErr){
                    res.send({ array:null, 
                            success:false, 
                            err: JSON.stringify(sqlErr)
                        });
                    return;
                }
                let folioNV = sqlRes.insertId;
                let errores = [];
                productos.forEach(producto => {
                    sql.query(`INSERT INTO detallenv VALUES (${producto.precio}, ${producto.cantidad}, ${producto.impuesto}, "${producto.ISBN}", ${folioNV})`, (sqlErr1, sqlRes1) => {
                        if(sqlErr1){
                            errores.push(sqlErr1);
                            return;
                        }
                    });
                });
                if(errores.length!=0){
                    res.send({success: false, err: JSON.stringify(errores)});
                    return;
                }
                res.send({success:true});
            });
        }
    });
});

router.post('/consProd',(req, res) => {
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

router.post('/consCte', (req, res) => {
    sql.query(`SELECT * FROM cliente`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

router.post('/ConsNV', (req, res) => {
    sql.query(`SELECT * FROM notaventa`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

router.post('/ConsDetalleNV', 
[
    body('idNV').not().isEmpty().isInt()
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        return;
    }
    let body = req.body;
    sql.query(`SELECT * FROM detallenv WHERE notaVentaFolioNV=${body.idNV}`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

module.exports = router;