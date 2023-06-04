const express = require('express');

const router = express.Router();
const sql = require("./conection");

router.post('/RegProd', (req, res) => {
    res.send({message:"test"});
});

router.post('/CrearNV', (req, res) => {

});

router.post('/ConsNV', (req, res) => {

});

router.post('/IniciarSesion', (req, res) => {

});

module.exports = router;
