const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Servidor backend funcionando');
});

// Ruta 1: Ranking de Comunidades
app.get('/api/ranking-ccaa', (req, res) => {
  const resultados = [];
  const rutaCSV = path.join(__dirname, '../data/ranking_ccaa_centil_padres_20.csv');

  fs.createReadStream(rutaCSV)
    .pipe(csv())
    .on('data', (data) => resultados.push(data))
    .on('end', () => {
      res.json(resultados);
    })
    .on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: "Error leyendo ranking" });
    });
});

// Ruta 2: Curva de Movilidad Nacional
app.get('/api/curva-nacional', (req, res) => {
  const resultados = [];
  const rutaCSV = path.join(__dirname, '../data/curva_movilidad_nacional.csv');

  fs.createReadStream(rutaCSV)
    .pipe(csv())
    .on('data', (data) => resultados.push(data))
    .on('end', () => {
      res.json(resultados);
    })
    .on('error', (error) => {
      console.error(error);
      res.status(500).json({ error: "Error leyendo curva" });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});