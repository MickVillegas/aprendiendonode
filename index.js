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

// RUTA: Ver un usuario específico por ID
// La URL será: http://localhost:3000/1/verUnUsuario
app.get('/:id/verUnUsuario', (req, res) => {
  // Capturamos el ID desde la URL
  const userId = req.params.id;

  const sql = 'SELECT * FROM personas WHERE id = ?';
  
  // Pasamos el userId como segundo parámetro para evitar inyecciones SQL
  connection.query(sql, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    // Devolvemos solo el primer resultado (el objeto, no el array)
    res.json(results[0]);
  });
});

// RUTA: Eliminar un usuario por ID
// La URL será: http://localhost:3000/eliminar/1
app.delete('/eliminar/:id', (req, res) => {
  const userId = req.params.id;
  const sql = 'DELETE FROM personas WHERE id = ?';

  connection.query(sql, [userId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    // result.affectedRows nos dice cuántas filas se borraron
    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "No se encontró el usuario para eliminar" });
    }

    res.json({ mensaje: `Usuario con ID ${userId} eliminado correctamente` });
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