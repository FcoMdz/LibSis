const express = require('express')
const {body, validationResult} = require('express-validator')
const router = express.Router()
const sql = require('../conection')

router.post('/Prod',
[
    body('ISBN').not().isEmpty().isString()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success: false, err: errors})
        return
    }
    let body = req.body
    let productoEliminar = body.ISBN
    sql.query(`UPDATE producto SET existencias=0 WHERE ISBN=?`, 
        [productoEliminar], (sqlErr, sqrRes) => {
        if(sqlErr){
            res.send({
                success: false,
                err: sqlErr
            })
            return
        }
        res.send({
            success: true
        })
    })
})
router.post('/Prov',
[
    body('idProv').not().isEmpty().isInt()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success: false, err: errors})
        return
    }
    let body = req.body
    sql.query(`DELETE FROM proveedor WHERE id_proveedor=?`, 
        [body.idProv], (sqlErr, sqrRes) => {
        if(sqlErr){
            res.send({
                success: false,
                err: sqlErr
            })
            return
        }
        res.send({
            success: true
        })
    })
})
router.post('/NV',
[
    body('folioNV').not().isEmpty().isString()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success: false, err: errors})
        return
    }
    let body = req.body
    sql.query(`DELETE FROM detallenv WHERE notaVentaFolioNV = ?`, 
        [body.folioNV], (sqlErr, sqrRes) => {
        if(sqlErr){
            res.send({
                success: false,
                err: sqlErr
            })
            return
        }
        sql.query(`DELETE FROM notaventa WHERE folioNV = ?`, 
            [body.folioNV],(sqlErr1, sqlRes1) => {
            if(sqlErr1){
                res.send({
                    success: false,
                    err: sqlErr1
                })
                return
            }
            res.send({
                success: true
            })
        })
    })
})

router.post('/NC',
[
    body('folioNC').not().isEmpty().isString()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success: false, err: errors})
        return
    }
    let body = req.body
    sql.query(`DELETE FROM detallenc WHERE notaCompraFolioNC = ?`, 
        [body.folioNC], (sqlErr, sqrRes) => {
        if(sqlErr){
            res.send({
                success: false,
                err: sqlErr
            })
            return
        }
        sql.query(`DELETE FROM notacompra WHERE FolioNC = ?`, 
            [body.folioNC],(sqlErr1, sqlRes1) => {
            if(sqlErr1){
                res.send({
                    success: false,
                    err: sqlErr1
                })
                return
            }
            res.send({
                success: true
            })
        })
    })
})

router.post('/NA',
[
    body('folioNA').not().isEmpty().isString()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success: false, err: errors})
        return
    }
    let body = req.body
    sql.beginTransaction((err) => {
        sql.query(`DELETE FROM detallena WHERE notaApartadoFolioNA = ?`, 
            [body.folioNA], (sqlErr, sqrRes) => {
            if(sqlErr){
                sql.rollback()
                res.send({
                    success: false,
                    err: sqlErr
                })
                return
            }
            sql.query(`DELETE FROM notaapartado WHERE FolioNA = ?`, 
                [body.folioNA],(sqlErr1, sqlRes1) => {
                if(sqlErr1){
                    sql.rollback()
                    res.send({
                        success: false,
                        err: sqlErr1
                    })
                    return
                }
                res.send({
                    success: true
                })
                sql.commit()
            })
        })
    })
    
})

router.post('/Enc',
[
    body('folioEnc').not().isEmpty().isString()
],
(req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        res.json({success: false, err: errors})
        return
    }
    let body = req.body
    sql.beginTransaction((err) => {
        sql.query(`DELETE FROM detalleencargo WHERE encargoFolioEncargo = ?`, 
        [body.folioEnc], (sqlErr, sqrRes) => {
        if(sqlErr){
            sql.rollback()
            res.send({
                success: false,
                err: sqlErr
            })
            return
        }
        sql.query(`DELETE FROM encargo WHERE FolioEncargo = ?`, 
            [body.folioEnc],(sqlErr1, sqlRes1) => {
            if(sqlErr1){
                sql.rollback()
                res.send({
                    success: false,
                    err: sqlErr1
                })
                return
            }
            res.send({
                success: true
            })
            sql.commit()
        })
    })
    })
    
})

module.exports = router