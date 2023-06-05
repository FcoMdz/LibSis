const express = require('express');
const cors = require('cors');
const PORT = process.env.PORT || 3000;
const rutas = require('./configuraciones/rutas');
const app = express();
app.use(cors());
app.use(express.urlencoded({extended:false}));
app.use(express.json());


app.use('/', rutas);

app.listen(PORT, () => {
    console.log("Servidor escuchando en el puerto " + PORT);
})