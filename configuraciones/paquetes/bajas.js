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
    sql.query(`DELETE FROM producto WHERE ISBN=?`, [productoEliminar], (sqlErr, sqrRes) => {
        if(sqlErr){
            res.send({
                success: false,
                err: sqlErr
            })
            return;
        }
        res.send({
            success: true
        })
    })
})

module.exports = router