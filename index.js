const express = require('express');
const cors = require('cors');
const PORT = 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:false}));


app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto " + PORT);
})