const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Permitimos que el Frontend (Svelte) nos pida datos
app.use(cors());

// Ruta de prueba para ver si el servidor vive
app.get('/', (req, res) => {
  res.send('¡El servidor del Ascensor Social está funcionando!');
});

// Aquí pondremos luego la lectura de CSV (Acceso a Datos)
app.get('/api/datos', (req, res) => {
  res.json({ mensaje: "Aquí irán los datos del CSV pronto" });
});

// Arrancar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});