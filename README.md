# aprendiendonode# NodeJS Tutorial



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

