const express = require('express');

const router = express.Router();
const sql = require("./conection");

router.get('/test', (req, res) => {
    res.send({message:"test"});
})

router.post('/RegProd', (req, res) => {
   
});

router.post('/CrearNV', (req, res) => {

});

router.post('/ConsNV', (req, res) => {

});

router.post('/IniciarSesion', (req, res) => {

});

module.exports = router;
