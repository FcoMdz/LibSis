const express = require('express');

const router = express.Router();
const sql = require("./conection");

router.use(express.static(process.cwd()+'/AngularProyect/dist/lib-sis/'));
router.get('/', (req, res) => {
    res.send({mensaje: "Hola"})
});

router.post('/RegProd', (req, res) => {
    
});

router.post('/CrearNV', (req, res) => {

});

router.post('/ConsNV', (req, res) => {

});

router.post('/IniciarSesion', (req, res) => {

});

module.exports = router;
