const express = require('express');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// 1. Configurar la conexión a MySQL
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

connection.connect(err => {
  if (err) {
    console.error('Error conectando a MySQL:', err.message);
    return;
  }
  console.log('Base de datos conectada.');
});

// 2. RUTA: Ver personas en JSON
app.get('/verPersonas', (req, res) => {
  const sql = 'SELECT * FROM personas';
  
  connection.query(sql, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    // Enviamos el resultado directamente como JSON
    res.json(results);
  });
});

// 3. Ruta de bienvenida (opcional)
app.get('/', (req, res) => {
  res.send('<h1>Hola Mick, el servidor está funcionando.</h1><a href="/verPersonas">Ir a ver personas</a>');
});

// 4. Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});