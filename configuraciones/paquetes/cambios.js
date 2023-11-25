const express = require('express')
const {body, validationResult} = require('express-validator')
const router = express.Router()
const sql = require('../conection')

router.post('/ActProd', 
[
    body('ISBN').not().isEmpty().isString(),
    body('nombre').not().isEmpty().isString(),
    body('precio').not().isEmpty().isFloat(),
    body('existencias').not().isEmpty().isInt(),
    body('impuesto').not().isEmpty().isInt(),
    body('editoriales').not().isEmpty().isArray(),
    body('autores').not().isEmpty().isArray(),
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        return;
    }
    let body = req.body;
    let errores = [];
    sql.query(`UPDATE producto SET nombre=?, precio=?, existencias=?, impuesto=? WHERE ISBN=?`,
              [body.nombre, body.nombre, body.precio, body.existencias, body.impuesto, body.ISBN],(sqlErr, sqlRes) => {
        let autores = body.autores;
        let editoriales = body.editoriales;
        if(sqlErr){
            errores += sqlErr.message;
            return;
        }
        sql.query(`DELETE FROM productoautor WHERE productoISBN=?`, [body.ISBN], (sqlErr1, sqlRes1) => {
            if(sqlErr1){
                errores += sqlErr1.message;
                return;
            }
            autores.forEach(autor => {
                sql.query(`INSERT INTO productoautor VALUES (?, ?)`, [autor, body.ISBN],(sqlErr2, sqlRes2) => {
                    if(sqlErr2){
                        errores += sqlErr2.message;
                        return;
                    }
                });
            });
        });
        sql.query(`DELETE FROM productoeditorial WHERE productoISBN=?`, [body.ISBN], (sqlErr1, sqlRes1) => {
            if(sqlErr1){
                errores += sqlErr1.message;
                return;
            }
            editoriales.forEach(editorial => {
                sql.query(`INSERT INTO productoeditorial VALUES (?, ?)`, [editorial, body.ISBN],(sqlErr2, sqlRes2) => {
                    if(sqlErr2){
                        errores += sqlErr2.message;
                        return;
                    }
                });
            });
        });
    });
    if(errores.length != 0){
        res.send({ 
            success:false, 
            err: JSON.stringify(errores)
        });
        return;
    }
    res.send({success:true});
}
);

router.post('/ActNV', 
[
    body('idNV').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        console.log(errors);
        return;
    }
    let body = req.body;
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            console.log(sqlErr);
            return;
        }else{
            let productosGeneral = sqlRes;
            let productosAgregar = body.ISBNProds;
            productosAgregar = JSON.parse(productosAgregar)
            let productos = [];
            productosGeneral.forEach(producto => {
                let i = productosAgregar.map((e) => {return e.ISBN;}).indexOf(producto.ISBN);
                if(i!=-1){
                    let data = {
                        ISBN: producto.ISBN,
                        precio: (producto.precio/(1+(producto.impuesto/100))).toFixed(2),
                        cantidad: productosAgregar[i].cant,
                        impuesto: (producto.precio - (producto.precio/(1+(producto.impuesto/100)))).toFixed(2),
                    }
                    productos.push(data);
                }
            });
            var d = new Date();
            d.setTime(d.getTime() - (/* UTC-6 */ 6) * 60 * 60 * 1000);
            fecha = d.toISOString().split("T")[0];
            sql.query(`UPDATE notaventa SET fechaVenta = ? WHERE folioNV = ?`, [fecha, body.idNV], (sqlErr1, sqlRes) => {
                if(sqlErr){
                    res.send({ 
                            success:false, 
                            err: sqlErr1
                        });
                    return;
                }
                let errores = [];
                sql.query(`DELETE FROM detallenv WHERE notaVentaFolioNV = ?`, [body.idNV], (sqlErr2, sqlRes) => {
                    if(sqlErr2){
                        errores.push(sqlErr2)
                        return;
                    }
                    productos.forEach(producto => {
                        sql.query(`INSERT INTO detallenv VALUES (?, ?, ?, ?, ?)`, [producto.precio, producto.cantidad, producto.impuesto, producto.ISBN, body.idNV], (sqlErr3, sqlRes1) => {
                            if(sqlErr1){
                                errores.push(sqlErr3);
                                return;
                            }
                        });
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

router.post('/ActNC', 
[
    body('idNC').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        console.log(errors);
        return;
    }
    let body = req.body;
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            console.log(sqlErr);
            return;
        }else{
            let productosGeneral = sqlRes;
            let productosAgregar = body.ISBNProds;
            productosAgregar = JSON.parse(productosAgregar)
            let productos = [];
            productosGeneral.forEach(producto => {
                let i = productosAgregar.map((e) => {return e.ISBN;}).indexOf(producto.ISBN);
                if(i!=-1){
                    let data = {
                        ISBN: producto.ISBN,
                        costo: (productosAgregar[i].costo/(1+(productosAgregar[i].impuesto/100))).toFixed(2),
                        cantidad: productosAgregar[i].cant,
                        impuesto: (productosAgregar[i].costo - (productosAgregar[i].costo/(1+(productosAgregar[i].impuesto/100)))).toFixed(2)
                    }
                    productos.push(data);
                }
            });
            var d = new Date();
            d.setTime(d.getTime() - (/* UTC-6 */ 6) * 60 * 60 * 1000);
            fecha = d.toISOString().split("T")[0];
            sql.query(`UPDATE notacompra SET fechaVenta = ? WHERE folioNC = ?`, [fecha, body.idNC], (sqlErr1, sqlRes) => {
                if(sqlErr){
                    res.send({ 
                            success:false, 
                            err: sqlErr1
                        });
                    return;
                }
                let errores = [];
                sql.query(`DELETE FROM detallenc WHERE notaCompraFolioNC = ?`, [body.idNC], (sqlErr2, sqlRes) => {
                    if(sqlErr2){
                        errores.push(sqlErr2)
                        return;
                    }
                    productos.forEach(producto => {
                        sql.query(`INSERT INTO detallenc VALUES (?, ?, ?, ?, ?)`, [producto.ISBN, body.idNC, producto.costo, producto.cantidad, producto.impuesto], (sqlErr3, sqlRes1) => {
                            if(sqlErr1){
                                errores.push(sqlErr3);
                                return;
                            }
                        });
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

router.post('/ActNA', 
[
    body('idNA').not().isEmpty().isInt(),
    body('abono').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        console.log(errors);
        return;
    }
    let body = req.body;
    sql.query(`UPDATE notaapartado SET abono = abono + ? WHERE FolioNA = ?`, [body.abono, body.idNA], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            console.log(sqlErr);
            return;
        }
        res.send({success:true});
    });
});

router.post('/ActEnc', 
[
    body('idEnc').not().isEmpty().isInt(),
    body('abono').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        console.log(errors);
        return;
    }
    let body = req.body;
    sql.query(`UPDATE encargo SET abono = abono + ? WHERE FolioEncargo = ?`, [body.abono, body.idEnc], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            console.log(sqlErr);
            return;
        }
        res.send({success:true});
    });
});

module.exports = router