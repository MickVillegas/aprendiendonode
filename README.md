# NodeJS Tutorial



## Inicializar el proyecto  
```npm init -y``` para crear un archivo json
Si sale un mensaje de error abrir PowerShell como administrador y escribir  
```Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser``` y decir "si" a todo y cerrar y abrir el entorno de desarollo otra vez (en mi caso Visual Studio Code)

## Crear el punto de entrada  
En linux ```touch index.js```  En windows ```ni index.js```  crea un archivo js  
Escribe en el nuevo archivo:
```
console.log("---------------------------------------");
console.log("¡Hola Mick! Tu entorno Node está listo.");
console.log("Esta es una prueba de ejecución.");
console.log("---------------------------------------");
```

## Ejecutar el proyecto 
Con ```node index.js``` Esto se puede cambiar en el json que hemos creado con npm, sobre escribe Scripts por:
```
"scripts": {
  "start": "node index.js",
  "test": "echo \"Error: no test specified\" && exit 1"
},
```
Entonces con solo escribir ```npm start``` ejecutarás el proyecto.

## Instalacion de un lenguaje de base de datos (MySql)
En mi caso instalé MySql y usé XAMPP
Escribe ```npm install mysql2``` 
Si aparece un error por culpa de los certificados SSL limpia el caché de npm con ```npm cache clean --force``` y vuelve a intentar instalar el lenguaje de MySql con el comando anterior

## Ejemplo uso de base de datos 
En mi caso yo estoy usando XAMPP, NodeJS ya tiene un servidor, asique solo inicié MySql en XAMPP
En el siguiente ejemplo he extablecido conxion con la base de datos, he creado la tabla personas con ID, nombre y edad, inserté datos nuevos e hice unz consulta a todos los datos y a un solo dato (solo mostrar los ombres)

```
//console.log("---------------------------------------");
//console.log("¡Hola Mick! Tu entorno Node está listo.");
//console.log("Esta es una prueba de ejecución.");
//console.log("---------------------------------------");

const mysql = require('mysql2');

// 1. Configurar la conexión
// Nota: XAMPP por defecto usa usuario 'root' y sin contraseña
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', 
  database: 'test' // Usamos 'test' porque ya viene creada en XAMPP
});

connection.connect(err => {
  if (err) {
    console.error('Error: ¿Encendiste MySQL en XAMPP? ' + err.message);
    return;
  }
  console.log('¡Conectado a MySQL!');

  // 2. Crear la tabla personas
  const sqlTable = `
    CREATE TABLE IF NOT EXISTS personas (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nombre VARCHAR(50),
      edad INT
    )`;

  connection.query(sqlTable, (err) => {
    if (err) throw err;
    console.log("Tabla 'personas' lista.");

    // 3. Insertar un registro para probar
    const sqlInsert = "INSERT INTO personas (nombre, edad) VALUES ('Mick', 24)";
    connection.query(sqlInsert, (err, result) => {
      if (err) throw err;
      console.log("Persona insertada. ID:", result.insertId);

      // 4. Ver los resultados en una tabla bonita
      connection.query('SELECT * FROM personas', (err, filas) => {
        if (err) throw err;
        console.table(filas);
        
        // este lo hice yo
        connection.query('SELECT nombre FROM personas', (err, filas) => {
            if(err) throw err;
            console.table(filas)

        // Cerramos la conexión al terminar
        connection.end();
        });
      });
    });
  });
});
```

## Controladores y rutas - Instalación de express

### Descarga de Express
Para instalar express usaremos el comando ```npm install express```

### Conexion a base de datos
Primero tenemos que establecer conexión a la base de datos, ademas tenemos que aclarar que servicios necesitamos y el puerto en el que trabajaremos
```
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
```

### Rutas y controladores 

#### Gets
Vamos a crear una ruta para mostrar todas las personas de la base de datos y que lo devuelva en JSON, vamos a crear la ruta "/verPersonas":

```
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
```

En el mismo archivo escribiremos el siguiente código para Iniciar el servidor en las ultima linea:
```
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
```
Entonces si iniciarmos con ```npm start``` y en el navegador buscamos ```http://localhost:3000/verPersonas``` y obtendremos todas las personas de nuestra tabla personas en JSON


Obtener una persona por id

```
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
```


#### Delete
Eliminamos una persona por ID

```
// La URL será: http://localhost:3000/eliminar/1
//Usamos delete porque vamos a eliminar una persona

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
```


#### Post 
Para ello necesitaremos escribir ```app.use(express.json());``` bajo ```const app = express();```  Esto permite que Express lea JSON en el body

Vamos a crear una persona

```
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
```


#### Put
Para actualizar a una persona, este ejemplo está hecho de forma si queremos solo cambiar un rejistro, por ejemplo, cambiar la edad de la persona pero mantener su nombre, para ello usaremos condicionales if

```
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
```
