console.log("hola Mundo AHT")

const express = require ("express");
require ("dotenv").config(); // variable de entorno ..llamo
const morgan = require("morgan");
const productRoutes = require("./routes/product.routes"); //importar los endpoints (rutas) productRoutes
const authRoutes=require("./routes/auth.routes");
const cartRoutes=require("./routes/cart.routes");
const favoritesRoutes=require("./routes/favorites.routes");
const usersRoutes=require("./routes/user.routes");
const connectDB = require("./config/database");
const path=require('path')


const app = express();  // creado el server Y CORRIENDO

// CONEXIO A LA BASE DE DATO MONGO
connectDB();

 // MIDDLEWARES
app.use(morgan("dev"))   // QUE PEDIDO ES,, CUANTO TARDO,, A QUE RUTA PIDIO,, NOS INDICA ESTO MORGAN
app.use(express.json()) // le digo que express va a trabajar con respuesta de tipo json
app.use(express.urlencoded({extended:true})); // le digo a express que sea capaz de leer los datos de formularios que envio o genero

// servir archivos estaticos.. imagenes u otros archivos
app.use('/uploads', express.static(path.join(__dirname,'../../uploads')))

//ROUTES
// Configurar los prefijos de enrutadores
// Todas las rutas dentro de / tendran el prefijo /api//v1/xxxx
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use("/api/v1/favorites", favoritesRoutes);
app.use("/api/v1/users", usersRoutes);


// PUERTOS
const port=process.env.PORT || 3000 ; // configuro el puerto desde el .env o 3000
app.listen(port, ()=>{ // pongo a escuchar el puerto
    console.log (`servidor corriendo en http://localhost: ${port}`) // aseguro que el puerto esta escuchando
})

