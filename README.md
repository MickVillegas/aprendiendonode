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

