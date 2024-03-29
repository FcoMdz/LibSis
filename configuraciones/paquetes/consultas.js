const express = require('express')
const {body, validationResult} = require('express-validator')
const router = express.Router()
const sql = require('../conection')


router.get('/consProds',(req, res) => {
    sql.query(`SELECT * FROM producto`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.post('/consProd',
[
    body('ISBN').not().isEmpty().isString()
],(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    /*sql.query('SELECT p.*, pe.editorialIdEditorial, pa.autorIdAutor FROM producto p, productoeditorial pe, productoautor pa WHERE pe.productoISBN = ? and pa.productoISBN = ? and p.ISBN = ?', [body.ISBN, body.ISBN, body.ISBN], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({seccess: false, err: sqlErr.message})
            return
        }
        res.send({
            sqlRes
        })

    })*/

    sql.query(`SELECT * FROM producto WHERE ISBN=?`, [body.ISBN], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        sql.query(`SELECT editorialIdEditorial "id_editorial", nombre, telefono FROM productoeditorial, editorial WHERE productoISBN=? and editorialIdEditorial = id_editorial`, [body.ISBN],(sqlErr1, sqlRes1) => {
            if(sqlErr1){
                res.send({success:false, err: sqlErr1.message})
                return
            }
            sql.query(`SELECT autorIdAutor "id_autor", nombre FROM productoautor, autor WHERE productoISBN=? and autorIdAutor = id_autor`, [body.ISBN],(sqlErr2, sqlRes2) => {
                if(sqlErr1){
                    res.send({success:false, err: sqlErr1.message})
                    return
                }
                res.send({
                    producto: sqlRes[0],
                    editoriales: sqlRes1,
                    autores: sqlRes2
                })
            })
        })
    })
})

router.get('/consAutores',(req, res) => {
    sql.query(`SELECT * FROM autor`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.post('/ConsDetalleNV', 
[
    body('idNV').not().isEmpty().isInt()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(`SELECT nv.*, p.nombre FROM detallenv nv, producto p WHERE nv.notaVentaFolioNV=? and nv.productoISBN = p.ISBN`, [body.idNV], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})


router.get('/consCte', (req, res) => {
    sql.query(`SELECT * FROM cliente`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.post('/consCte', [
    body('idCte').not().isEmpty().isInt()
], 
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(`SELECT * FROM cliente WHERE id_cte=?`, [body.idCte], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.get('/ConsNV', (req, res) => {
    sql.query(`SELECT nv.*, cte.nombre FROM notaventa nv, cliente cte WHERE cte.id_cte=nv.clienteId_cte`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.get('/ConsNA', (req, res) => {
    sql.query(`SELECT na.*, cte.nombre FROM notaapartado na, cliente cte WHERE cte.id_cte=na.clienteId_cte`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.get('/consProveedores',(req,res) => {
    sql.query(`SELECT * FROM proveedor`,(sqlErr,sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.post('/ConsProv', 
[
    body('idProv').not().isEmpty().isInt()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(`SELECT * FROM proveedor WHERE id_proveedor=?`, [body.idProv], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.get('/ConsEditoriales',(req, res) => {
    sql.query(`SELECT * FROM editorial`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})


router.post('/ConsEditorial', 
[
    body('idEdit').not().isEmpty().isInt()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(`SELECT * FROM editorial WHERE id_editorial=?`, [body.idEdit], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.get('/ConsAutores',(req, res) => {
    sql.query(`SELECT * FROM auotr`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.post('/ConsAutor', 
[
    body('idAutor').not().isEmpty().isInt()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(`SELECT * FROM autor WHERE id_autor=?`, [body.idAutor], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.get('/ConsEmpleados', (req, res) => {
    sql.query(`SELECT * FROM usuario`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.post('/ConsEmpleado', 
[
    body('idEmp').not().isEmpty().isString()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(`SELECT * FROM usuario WHERE usuario=?`, [body.idEmp], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

router.get('/consNC',(req, res) => {
    sql.query(`SELECT nc.*, p.nombre FROM notacompra nc, proveedor p WHERE nc.proveedorId_proveedor=p.id_proveedor ORDER BY nc.folioNC DESC`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})
router.get('/consDetalleNC',(req, res) => {
    sql.query(`SELECT dc.* FROM detallenc dc`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})
router.post('/consDetalleNC', 
[
    body('idNC').not().isEmpty().isInt()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(`SELECT dc.*, p.nombre FROM detallenc dc, producto p WHERE dc.productoISBN = p.ISBN and notaCompraFolioNC=?`, [body.idNC], (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})
router.post('/procedure',
[
    body('fechaInicio').not().isEmpty().isString(),
    body('fechaFinal').not().isEmpty().isString()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success:false, err:JSON.stringify(errors)})
        return
    }
    let body = req.body
    sql.query(
        'CALL calcular_totales(?, ?, @total_ventas, @total_compras)',
        [body.fechaInicio, body.fechaFinal],
        (error, results) => {
          if (error) {
            console.error('Error al llamar al procedimiento almacenado:', error);
            return;
          }
    
          // Obtener los resultados de las variables de sesión
          connection.query('SELECT @total_ventas, @total_compras', (err, rows) => {
            if (err) {
              console.error('Error al obtener los resultados:', err);
              return;
            }
    
            const totalVentas = rows[0][0]['@total_ventas'];
            const totalCompras = rows[0][0]['@total_compras'];
    
            console.log('Total de ventas:', totalVentas);
            console.log('Total de compras:', totalCompras);
    
          });
    });
})

module.exports = router