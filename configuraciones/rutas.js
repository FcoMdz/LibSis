const express = require('express');

const router = express.Router();
const sql = require("./conection");

router.use(express.static(process.cwd()+'/AngularProyect/dist/lib-sis/'))
router.get('/', (req, res) => {
    link = process.cwd()+ '/AngularProyect/dist/lib-sis/';
    res.sendFile(link);
    console.log("Enviado: " + link);
});

module.exports = router;
