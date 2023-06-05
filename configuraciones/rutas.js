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
            console.log(sqlErr);
            res.send({success:false, err: sqlErr.message});
            return;
        }else if(sqlRes.length == 0){
            console.log(sqlRes);
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
    sql.query(`INSERT INTO producto VALUES ("${body.ISBN}", "${body.nombre}", ${body.precio}, ${body.existencias}, ${body.impuesto})`,(sqlErr, sqlRes) => {
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
            sql.query(`INSERT INTO productoautor VALUES (${autor}, "${body.ISBN}")`,(sqlErr2, sqlRes2) => {
                if(sqlErr2){
                    errores += sqlErr2.message;
                    return;
                }
            });
        });
        editoriales.forEach(editorial => {
            sql.query(`INSERT INTO productoeditorial VALUES (${editorial}, "${body.ISBN}")`,(sqlErr2, sqlRes2) => {
                if(sqlErr2){
                    errores += sqlErr2.message;
                    return;
                }
            });
        })
        if(errores.length != 0){
            res.send({ 
                success:false, 
                err: JSON.stringify(errores)
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
    sql.query(`UPDATE producto SET nombre="${body.nombre}", precio=${body.precio}, existencias=${body.existencias}, impuesto=${body.impuesto} WHERE ISBN="${body.ISBN}"`,(sqlErr, sqlRes) => {
        let autores = body.autores;
        let editoriales = body.editoriales;
        if(sqlErr){
            errores += sqlErr.message;
            return;
        }
        sql.query(`DELETE FROM productoautor WHERE productoISBN='${body.ISBN}'`, (sqlErr1, sqlRes1) => {
            if(sqlErr1){
                errores += sqlErr1.message;
                return;
            }
            autores.forEach(autor => {
                sql.query(`INSERT INTO productoautor VALUES (${autor}, "${body.ISBN}")`,(sqlErr2, sqlRes2) => {
                    if(sqlErr2){
                        errores += sqlErr2.message;
                        return;
                    }
                });
            });
        });
        sql.query(`DELETE FROM productoeditorial WHERE productoISBN="${body.ISBN}"`, (sqlErr1, sqlRes1) => {
            if(sqlErr1){
                errores += sqlErr1.message;
                return;
            }
            editoriales.forEach(editorial => {
                sql.query(`INSERT INTO productoeditorial VALUES (${editorial}, "${body.ISBN}")`,(sqlErr2, sqlRes2) => {
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
    res.send({
        success:true
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
            let productos = [];
            productosGeneral.forEach(producto => {
                let i = productosAgregar.map((e) => {return e.ISBN;}).indexOf(producto.ISBN);
                if(i!=-1){
                    let data = {
                        ISBN: producto.ISBN,
                        precio: (producto.precio/(1+(producto.impuesto/100))).toFixed(2),
                        cantidad: productosAgregar[i].cant,
                        impuesto: (producto.precio - (producto.precio/(1+(producto.impuesto/100)))).toFixed(2),
                        nuevaCantidad: (producto.existencias - productosAgregar[i].cant)
                    }
                    productos.push(data);
                }
            });
            var d = new Date();
            d.setTime(d.getTime() - (/* UTC-6 */ 6) * 60 * 60 * 1000);
            fecha = d.toISOString().split("T")[0];
            sql.query(`INSERT INTO notaventa (fechaVenta, clienteId_cte) VALUES ("${fecha}", ${body.idCte})`, (sqlErr, sqlRes) => {
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
                    sql.query(`INSERT INTO detallenv VALUES (${producto.precio}, ${producto.cantidad}, ${producto.impuesto}, "${producto.ISBN}", ${folioNV})`, (sqlErr1, sqlRes1) => {
                        if(sqlErr1){
                            errores.push(sqlErr1);
                            return;
                        }
                        sql.query(`UPDATE producto SET existencias=${producto.nuevaCantidad} WHERE ISBN='${producto.ISBN}'`,(sqlErr3, sqlRes3) => {
                            if(sqlErr3){
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
                res.send({success:true, err: sqlRes.insertId});
            });
        }
    });
});

router.get('/consProds',(req, res) => {
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

router.get('/consEditoriales',(req, res) => {
    sql.query(`SELECT * FROM editorial`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

router.get('/consAutores',(req, res) => {
    sql.query(`SELECT * FROM autor`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

router.post('/consProd',
[
    body('ISBN').not().isEmpty().isString()
],(req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)});
        return;
    }
    let body = req.body;
    sql.query(`SELECT * FROM producto WHERE ISBN="${body.ISBN}"`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        sql.query(`SELECT editorialIdEditorial FROM productoeditorial WHERE productoISBN="${body.ISBN}"`,(sqlErr1, sqlRes1) => {
            if(sqlErr1){
                res.send({success:false, err: sqlErr1.message});
                return;
            }
            sql.query(`SELECT autorIdAutor FROM productoautor WHERE productoISBN="${body.ISBN}"`,(sqlErr2, sqlRes2) => {
                if(sqlErr1){
                    res.send({success:false, err: sqlErr1.message});
                    return;
                }
                res.send({
                    producto: sqlRes[0],
                    editoriales: sqlRes1,
                    autores: sqlRes2
                })
            });
        });
    });
});

router.get('/consCte', (req, res) => {
    sql.query(`SELECT * FROM cliente`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message});
            return;
        }
        res.send(sqlRes);
    });
});

router.get('/ConsNV', (req, res) => {
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