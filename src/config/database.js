//CONEXION CON MI BASE DE DATOS


// 1- requerir mongoose
const mongoose = require('mongoose');
//2- CREAR FNCION QUE HACE LA CONEXION

const connectDB=async()=>{

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('🌎 MongoDB conectado conn exito!!! ')
    } catch (error) {
        console.error('💥 error al conectar con mongodb', error.message);
        process.exit(1);// temrina con los proceso y deja de intentar conectarse si viene un error
    }

}
//3- exportar la funcion
module.exports=connectDB
