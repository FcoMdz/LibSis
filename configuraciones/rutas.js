const express = require('express');
const {body, validationResult} = require('express-validator');
const router = express.Router();
const sql = require("./conection");

router.get('/test', (req, res) => {
    res.send({"message":"test"});
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

/*router.post('/CrearNV', (req, res) => {

});

router.post('/ConsNV', (req, res) => {

});

router.post('/IniciarSesion', (req, res) => {

});*/

module.exports = router;
