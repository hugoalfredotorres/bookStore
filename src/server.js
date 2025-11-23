console.log("hola Mundo AHT")

const express = require ("express");
require ("dotenv").config(); // variable de entorno ..llamo
const morgan = require("morgan");
const productRoutes = require("./routes/productRoutes"); //importar los endpoints (rutas)


const app = express();  // creado el server Y CORRIENDO

 // MIDDLEWARES
app.use(morgan("dev"))   // QUE PEDIDO ES,, CUANTO TARDO,, A QUE RUTA PIDIO,, NOS INDICA ESTO MORGAN
app.use(express.json()) // le digo que express va a trabajar con respuesta de tipo json
app.use(express.urlencoded({extended:true})); // le digo a express que sea capaz de leer los datos de formularios que envio o genero

//ROUTES
app.use("/api/v1/products", productRoutes)


// PUERTOS
const port=process.env.PORT || 3000 ; // configuro el puerto desde el .env o 3000
app.listen(port, ()=>{ // pongo a escuchar el puerto
    console.log (`servidor corriendo en http://localhost: ${port}`) // aseguro que el puerto esta escuchando
})

