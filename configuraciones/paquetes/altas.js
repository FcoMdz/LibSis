const express = require('express')
const {body, validationResult} = require('express-validator')
const router = express.Router()
const sql = require('../conection')

router.post('/Prod', 
[
    body('ISBN').not().isEmpty().isString(),
    body('nombre').not().isEmpty().isString(),
    body('precio').not().isEmpty().isFloat(),
    body('impuesto').not().isEmpty().isInt(),
    body('editoriales').not().isEmpty(),
    body('autores').not().isEmpty(),
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        return
    }
    let body = req.body
    sql.query(`INSERT INTO producto (ISBN, nombre, precio, impuesto, existencias) VALUES (?, ?, ?, ?, 0)`, [body.ISBN, body.nombre, body.precio, body.impuesto],(sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({
                    success:false, 
                    err: sqlErr.message
                })
            return
        }
        let autres = body.autores
        let editoriales = body.editoriales
        let errores = []
        autres.forEach(autor => {
            sql.query(`INSERT INTO productoautor VALUES (?, ?)`, [autor.id_autor, body.ISBN],(sqlErr2, sqlRes2) => {
                if(sqlErr2){
                    errores += sqlErr2.message
                    return
                }
            })
        })
        editoriales.forEach(editorial => {
            sql.query(`INSERT INTO productoeditorial VALUES (?, ?)`, [editorial.id_editorial, body.ISBN],(sqlErr2, sqlRes2) => {
                if(sqlErr2){
                    errores += sqlErr2.message
                    return
                }
            })
        })
        if(errores.length != 0){
            res.send({ 
                success:false, 
                err: errores
            })
            return
        }
        res.send({
            array: sqlRes.affectedRows,
            success:true
        })
    })
}
)

router.post('/NV', 
[
    body('idCte').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        console.log(errors)
        return
    }
    let body = req.body
    sql.beginTransaction((err)=> {
        sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
            if(sqlErr){
                sql.rollback()
                res.send({success:false, err: sqlErr.message})
                console.log(sqlErr)
                return
            }else{
                let productosGeneral = sqlRes
                let productosAgregar = body.ISBNProds
                productosAgregar = JSON.parse(productosAgregar)
                let productos = []
                productosGeneral.forEach(producto => {
                    let i = productosAgregar.map((e) => {return e.ISBN}).indexOf(producto.ISBN)
                    if(i!=-1){
                        let data = {
                            ISBN: producto.ISBN,
                            precio: (producto.precio/(1+(producto.impuesto/100))).toFixed(2),
                            cantidad: productosAgregar[i].cant,
                            impuesto: (producto.precio - (producto.precio/(1+(producto.impuesto/100)))).toFixed(2),
                        }
                        productos.push(data)
                    }
                })
                var d = new Date()
                d.setTime(d.getTime() - (/* UTC-6 */ 6) * 60 * 60 * 1000)
                fecha = d.toISOString().split("T")[0]
                sql.query(`INSERT INTO notaventa (fechaVenta, clienteId_cte) VALUES (?, ?)`, [fecha, body.idCte], (sqlErr1, sqlRes1) => {
                    if(sqlErr){
                        sql.rollback()
                        res.send({
                                success:false, 
                                err: sqlErr1.message
                            })
                        return
                    }
                    let folioNV = sqlRes1.insertId
                    productos.forEach(producto => {
                        sql.query(`INSERT INTO detallenv VALUES (?, ?, ?, ?, ?)`, [producto.precio, producto.cantidad, producto.impuesto, producto.ISBN, folioNV], (sqlErr2, sqlRes2) => {
                            if(sqlErr2){
                                sql.rollback()
                                res.send({
                                    success: false, 
                                    err: sqlErr2.message
                                })
                                return
                            }
                            res.send({
                                success:true, 
                                id: sqlRes1.insertId
                            })
                            sql.commit()
                        })
                    })
                })
            }
        })
    })
})

router.post('/NC', 
[
    body('idProv').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty(),
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        console.log(errors)
        return
    }
    let body = req.body
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            console.log(sqlErr)
            return
        }else{
            let productosGeneral = sqlRes
            let productosAgregar = body.ISBNProds
            productosAgregar = JSON.parse(productosAgregar)
            let productos = []
            productosAgregar.forEach(producto => {
                let data = {
                    ISBN: producto.ISBN,
                    costo: producto.costo,
                    cantidad: producto.cant,
                    impuesto: producto.impuesto
                }
                productos.push(data)
            })
            var d = new Date()
            d.setTime(d.getTime() - (/* UTC-6 */ 6) * 60 * 60 * 1000)
            fecha = d.toISOString().split("T")[0]
            sql.query(`INSERT INTO notacompra (fecha, proveedorId_proveedor) VALUES (?, ?)`, [fecha, body.idProv], (sqlErr1, sqlRes1) => {
                if(sqlErr1){
                    res.send({ array:null, 
                            success:false, 
                            err: sqlErr1.message
                        })
                    return
                }else{
                    let folioNC = sqlRes1.insertId
                    productos.forEach(producto => {
                        sql.query(`INSERT INTO detallenc VALUES (?, ?, ?, ?, ?)`, [producto.ISBN, folioNC, producto.costo, producto.cantidad, producto.impuesto], (sqlErr2, sqlRes2) => {
                            if(sqlErr2){
                                res.send({
                                    success: false,
                                    err: sqlErr2.message
                                })
                                return
                            }else{
                                sql.commit()
                                
                            }
                        })
                    })
                    res.send({success:true, id: sqlRes1.insertId})
                }
            })
        }
    })
})

router.post('/Enc', 
[
    body('idCte').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty(),
    body('estatus').not().isEmpty(),
    body('abono').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        console.log(errors)
        return
    }
    let body = req.body
    sql.beginTransaction((err) => {
        sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
            if(sqlErr){
                sql.rollback()
                res.send({success:false, err: sqlErr.message})
                console.log(sqlErr)
                return
            }else{
                let productosGeneral = sqlRes
                let productosAgregar = body.ISBNProds
                productosAgregar = JSON.parse(body.ISBNProds)
                let productos = []
                productosGeneral.forEach(producto => {
                    let i = productosAgregar.map((e) => {return e.ISBN}).indexOf(producto.ISBN)
                    if(i!=-1){
                        let data = {
                            ISBN: producto.ISBN,
                            precio: (producto.precio/(1+(producto.impuesto/100))).toFixed(2),
                            cantidad: productosAgregar[i].cant,
                            impuesto: (producto.precio - (producto.precio/(1+(producto.impuesto/100)))).toFixed(2),
                        }
                        productos.push(data)
                    }
                })
                sql.query(`INSERT INTO encargo (Abono, clienteId_cte, estatus) VALUES (?, ?, ?)`, [body.abono, body.idCte, body.estatus], (sqlErr1, sqlRes1) => {
                    if(sqlErr){
                        sql.rollback()
                        res.send({ array:null, 
                                success:false, 
                                err: sqlErr1.message
                            })
                        return
                    }
                    let folioEncargo = sqlRes1.insertId
                    productos.forEach(producto => {
                        sql.query(`INSERT INTO detalleencargo VALUES (?, ?, ?, ?, ?)`, [producto.cantidad, producto.impuesto, producto.precio, producto.ISBN, folioEncargo], (sqlErr2, sqlRes2) => {
                            if(sqlErr2){
                                sql.rollback()
                                res.send({
                                    success: false,
                                    err: sqlErr2.message
                                })
                                return
                            }
                            res.send({success:true, id: sqlRes1.insertId})
                            sql.commit()
                        })
                    })
                    
                })
            }
        })
    })
})

router.post('/NA', 
[
    body('idCte').not().isEmpty().isInt(),
    body('ISBNProds').not().isEmpty(),
    body('estatus').not().isEmpty(),
    body('abono').not().isEmpty()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        console.log(errors)
        return
    }
    let body = req.body
    sql.beginTransaction((err) => {
        sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
            if(sqlErr){
                sql.rollback()
                res.send({success:false, err: sqlErr.message})
                console.log(sqlErr)
                return
            }else{
                let productosGeneral = sqlRes
                let productosAgregar = body.ISBNProds
                productosAgregar = JSON.parse(productosAgregar)
                let productos = []
                productosGeneral.forEach(producto => {
                    let i = productosAgregar.map((e) => {return e.ISBN}).indexOf(producto.ISBN)
                    if(i!=-1){
                        let data = {
                            ISBN: producto.ISBN,
                            precio: (producto.precio/(1+(producto.impuesto/100))).toFixed(2),
                            cantidad: productosAgregar[i].cant,
                            impuesto: (producto.precio - (producto.precio/(1+(producto.impuesto/100)))).toFixed(2)
                        }
                        productos.push(data)
                    }
                })
                var d = new Date()
                d.setTime(d.getTime() - (/* UTC-6 */ 6) * 60 * 60 * 1000)
                fecha = d.toISOString().split("T")[0]
                sql.query(`INSERT INTO notaapartado (abono, fecha, clienteId_cte, estatus) VALUES (?, ?, ?, ?)`, [body.abono, fecha, body.idCte, body.estatus], (sqlErr1, sqlRes1) => {
                    if(sqlErr1){
                        sql.rollback()
                        res.send({
                                success:false, 
                                err: sqlErr1.message
                            })
                        return
                    }
                    let folioNA = sqlRes1.insertId
                    productos.forEach(producto => {
                        sql.query(`INSERT INTO detallena VALUES (?, ?, ?, ?, ?)`, [producto.precio, producto.cantidad, producto.impuesto, producto.ISBN, folioNA], (sqlErr2, sqlRes2) => {
                            if(sqlErr2){
                                sql.rollback()
                                res.send({
                                    success: false,
                                    err: sqlErr2.message
                                })
                                return
                            }
                            res.send({success:true, id: sqlRes1.insertId})
                            sql.commit()
                        })
                    })
                })
            }
        })
    })
    
})

router.post("/Prov",
[
    body('nombre').not().isEmpty().isString(),
    body('telefono').not().isEmpty().isString(),
    body('rfc').not().isEmpty().isString()
],
(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        return
    }
    let body = req.body
    sql.query(`INSERT INTO proveedor (nombre,telefono,RFC) VALUES (?,?,?)`, [body.nombre,body.telefono,body.rfc],(sqlErr,sqlRes) => {
        if(sqlErr){
            res.send({
                    success:false, 
                    err: sqlErr.message
                })
            return
        }
        res.send({
            array: sqlRes.affectedRows,
            success:true
        })
    })
}
)

router.post("/Edit",
[
    body('nombre').not().isEmpty().isString(),
    body('telefono').not().isEmpty().isString()
],
(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        return
    }
    let body = req.body
    sql.query(`INSERT INTO editorial (nombre,telefono) VALUES (?,?)`, [body.nombre,body.telefono],(sqlErr,sqlRes) => {
        if(sqlErr){
            res.send({
                    success:false, 
                    err: sqlErr.message
                })
            return
        }
        res.send({
            array: sqlRes.affectedRows,
            success:true
        })
    })
}
)

router.post("/Autor",
[
    body('nombre').not().isEmpty().isString(),
],
(req,res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:errors})
        return
    }
    let body = req.body
    sql.query(`INSERT INTO autor (nombre) VALUES (?)`, [body.nombre],(sqlErr,sqlRes) => {
        if(sqlErr){
            res.send({
                    success:false, 
                    err: sqlErr.message
                })
            return
        }
        res.send({
            array: sqlRes.affectedRows,
            success:true
        })
    })
}
)

module.exports = router

