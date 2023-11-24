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
    res.send({
        success:true
    });
}
);


module.exports = router