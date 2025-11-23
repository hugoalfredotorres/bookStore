console.log("hola Mundo AHT")

const express=require ("express");
require ("dotenv").config(); // variable de entorno ..llamo

const app = express();  // creado el server

const port=process.env.PORT || 3000 ; // configuro el puerto desde el .env o 3000

app.listen(port, ()=>{ // pongo a escuchar el puerto
    console.log (`servidor corriendo en http://localhost: ${port}`) // aseguro que el puerto esta escuchando
})
