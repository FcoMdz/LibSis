const express = require('express')
const {body, validationResult} = require('express-validator')
const router = express.Router()
const sql = require('../conection')

router.get('/consEditoriales',(req, res) => {
    sql.query(`SELECT * FROM editorial`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

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
        sql.query(`SELECT editorialIdEditorial, nombre FROM productoeditorial, editorial WHERE productoISBN=? and editorialIdEditorial = id_editorial`, [body.ISBN],(sqlErr1, sqlRes1) => {
            if(sqlErr1){
                res.send({success:false, err: sqlErr1.message})
                return
            }
            sql.query(`SELECT autorIdAutor, nombre FROM productoautor, autor WHERE productoISBN=? and autorIdAutor = id_autor`, [body.ISBN],(sqlErr2, sqlRes2) => {
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

router.get('/ConsNV', (req, res) => {
    sql.query(`SELECT nv.*, cte.nombre FROM notaventa nv, cliente cte WHERE cte.id_cte=nv.clienteId_cte`, (sqlErr, sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})
router.get('/consProv',(req,res) => {
    sql.query(`SELECT * FROM proveedor`,(sqlErr,sqlRes) => {
        if(sqlErr){
            res.send({success:false, err: sqlErr.message})
            return
        }
        res.send(sqlRes)
    })
})

module.exports = router