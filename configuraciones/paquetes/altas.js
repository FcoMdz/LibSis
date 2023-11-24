const express = require('express')
const {body, validationResult} = require('express-validator')
const router = express.Router()
const sql = require('../conection')

router.post('/RegProd', 
[
    body('ISBN').not().isEmpty().isString(),
    body('nombre').not().isEmpty().isString(),
    body('precio').not().isEmpty().isFloat(),
    body('existencias').not().isEmpty().isInt(),
    body('impuesto').not().isEmpty().isInt(),
    body('editoriales').not().isEmpty(),
    body('autores').not().isEmpty(),
],
(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        return;
    }
    let body = req.body;
    sql.query(`INSERT INTO producto VALUES (?, ?, ?, ?, ?)`, [body.ISBN, body.nombre, body.precio, body.existencias, body.impuesto],(sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({
                    success:false, 
                    err: JSON.stringify(sqlErr)
                });
            return;
        }
        let autres = body.autores;
        let editoriales = body.editoriales;
        let errores = [];
        autres.forEach(autor => {
            sql.query(`INSERT INTO productoautor VALUES (?, ?)`, [autor, body.ISBN],(sqlErr2, sqlRes2) => {
                if(sqlErr2){
                    errores += sqlErr2.message;
                    return;
                }
            });
        });
        editoriales.forEach(editorial => {
            sql.query(`INSERT INTO productoeditorial VALUES (?, ?)`, [editorial, body.ISBN],(sqlErr2, sqlRes2) => {
                if(sqlErr2){
                    errores += sqlErr2.message;
                    return;
                }
            });
        })
        if(errores.length != 0){
            res.send({ 
                success:false, 
                err: errores
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
            sql.query(`INSERT INTO notaventa (fechaVenta, clienteId_cte) VALUES (?, ?)`, [fecha, body.idCte], (sqlErr, sqlRes) => {
                if(sqlErr){
                    console.log(sqlErr);
                    res.send({ array:null, 
                            success:false, 
                            err: JSON.stringify(sqlErr)
                        });
                    return;
                }
                let folioNV = sqlRes.insertId;
                let errores = [];
                productos.forEach(producto => {
                    sql.query(`INSERT INTO detallenv VALUES (?, ?, ?, ?, ?)`, [producto.precio, producto.cantidad, producto.impuesto, producto.ISBN, folioNV], (sqlErr1, sqlRes1) => {
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
                res.send({success:true, err: sqlRes.insertId});
            });
        }
    });
});

router.post('/CrearNC', 
[
    body('idProv').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty(),
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
            let productosGeneral = sqlRes
            let productosAgregar = body.ISBNProds
            productosAgregar = JSON.parse(productosAgregar)
            let productos = []
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
            sql.query(`INSERT INTO notacompra (fecha, proveedorId_proveedor) VALUES (?, ?)`, [fecha, body.idProv], (sqlErr, sqlRes) => {
                if(sqlErr){
                    res.send({ array:null, 
                            success:false, 
                            err: JSON.stringify(sqlErr)
                        });
                    return;
                }
                let folioNC = sqlRes.insertId;
                let errores = [];
                productos.forEach(producto => {
                    sql.query(`INSERT INTO detallenc VALUES (?, ?, ?, ?, ?)`, [producto.ISBN, folioNC, producto.costo, producto.cantidad, producto.impuesto], (sqlErr1, sqlRes1) => {
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
                res.send({success:true, err: sqlRes.insertId});
            });
        }
    });
});

router.post('/CrearEnc', 
[
    body('idCte').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty(),
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
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            console.log(sqlErr);
            return;
        }else{
            let productosGeneral = sqlRes;
            let productosAgregar = body.ISBNProds;
            productosAgregar = JSON.parse(body.ISBNProds)
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
            sql.query(`INSERT INTO encargo (Abono, clienteId_cte) VALUES (?, ?)`, [body.abono, body.idCte], (sqlErr, sqlRes) => {
                if(sqlErr){
                    console.log(sqlErr);
                    res.send({ array:null, 
                            success:false, 
                            err: JSON.stringify(sqlErr)
                        });
                    return;
                }
                let folioEncargo = sqlRes.insertId;
                let errores = [];
                productos.forEach(producto => {
                    sql.query(`INSERT INTO detalleencargo VALUES (?, ?, ?, ?, ?)`, [producto.cantidad, producto.impuesto, producto.precio, producto.ISBN, folioEncargo], (sqlErr1, sqlRes1) => {
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
                res.send({success:true, err: sqlRes.insertId});
            });
        }
    });
});

router.post('/CrearNA', 
[
    body('idCte').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty(),
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
                        impuesto: (producto.precio - (producto.precio/(1+(producto.impuesto/100)))).toFixed(2)
                    }
                    productos.push(data);
                }
            });
            var d = new Date();
            d.setTime(d.getTime() - (/* UTC-6 */ 6) * 60 * 60 * 1000);
            fecha = d.toISOString().split("T")[0];
            sql.query(`INSERT INTO notaapartado (abono, fecha, clienteId_cte) VALUES (?, ?, ?)`, [body.abono, fecha, body.idCte], (sqlErr, sqlRes) => {
                if(sqlErr){
                    console.log(sqlErr);
                    res.send({ array:null, 
                            success:false, 
                            err: JSON.stringify(sqlErr)
                        });
                    return;
                }
                let folioNA = sqlRes.insertId;
                let errores = [];
                productos.forEach(producto => {
                    sql.query(`INSERT INTO detallena VALUES (?, ?, ?, ?, ?)`, [producto.precio, producto.cantidad, producto.impuesto, producto.ISBN, folioNA], (sqlErr1, sqlRes1) => {
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
                res.send({success:true, err: sqlRes.insertId});
            });
        }
    });
});

module.exports = router

