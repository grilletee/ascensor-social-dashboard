const express = require('express');
const cors = require('cors');
const fs = require('fs'); 
const csv = require('csv-parser'); 
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('¡Servidor del Ascensor Social online!');
});

app.get('/api/ranking-ccaa', (req, res) => {
  const resultados = [];
  const rutaCSV = path.join(__dirname, '../data/ranking_ccaa_centil_padres_20.csv');

  fs.createReadStream(rutaCSV)
    .pipe(csv())
    .on('data', (data) => resultados.push(data)) // Guardamos en 'resultados'
    .on('end', () => {
      res.json(resultados); // Enviamos 'resultados'
    })
    .on('error', (error) => {
      console.error("Error al leer el CSV. ¿Está el archivo en la carpeta 'data'?", error);
      res.status(500).json({ error: "Error leyendo datos" });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});