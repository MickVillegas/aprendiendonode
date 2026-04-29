const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const app = express();
app.use(cors());
app.use(express.json()); // Esto permite que Express lea JSON en el body
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


// RUTA: Crear una persona
// Usamos POST porque estamos enviando información nueva
app.post('/crearPersona', (req, res) => {
  // Extraemos nombre y edad del body de la petición
  const { nombre, edad } = req.body;

  // Verificación básica
  if (!nombre || !edad) {
    return res.status(400).json({ error: "Faltan datos (nombre o edad)" });
  }

  const sql = 'INSERT INTO personas (nombre, edad) VALUES (?, ?)';
  
  connection.query(sql, [nombre, edad], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      mensaje: "Persona creada con éxito",
      id: result.insertId,
      datos: { nombre, edad }
    });
  });
});


// RUTA: Actualizar persona (Nombre, Edad o ambos)
// URL: http://localhost:3000/actualizarPersona/1
app.put('/actualizarPersona/:id', (req, res) => {
  const userId = req.params.id;
  const { nombre, edad } = req.body;

  // 1. Verificamos que al menos venga un dato para actualizar
  if (!nombre && !edad) {
    return res.status(400).json({ error: "Debes enviar al menos un campo (nombre o edad) para actualizar" });
  }

  // 2. Construcción dinámica de la consulta
  let campos = [];
  let valores = [];

  if (nombre) {
    campos.push("nombre = ?");
    valores.push(nombre);
  }

  if (edad) {
    campos.push("edad = ?");
    valores.push(edad);
  }

  // Agregamos el ID al final del array de valores para el WHERE
  valores.push(userId);

  // La magia: Unimos los campos con comas
  // Resultado final será algo como: "UPDATE personas SET nombre = ?, edad = ? WHERE id = ?"
  const sql = `UPDATE personas SET ${campos.join(", ")} WHERE id = ?`;

  connection.query(sql, valores, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario actualizado correctamente" });
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

app.listen(3000, () => {
    console.log("Servidor corriendo en http://localhost:3000");
});