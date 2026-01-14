// middleware para manaejar errores

const {cleanUploadsFiles}=require ("../util/fileCleanpup");

const errorhandler=(err, req,res, next)=>{
    console.error('😜error:', err);

    // limpiar archivos subidos si hay error
    cleanUploadsFiles(req)

    //error de validacion de mongoose
    if(err.name === 'validationError'){
        const errors=Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            ok:false,
            message:'error de validacion',
            errors
        })
    }

    // error personalizado de multer(tipo de archivo)
    if(err.message && err.message.includes('solo se permiten imagenes')){
        return res.status(400).json({
            ok:false,
            message:err.message
        })
    }

    //error de multer(tamaño excedidio en los archivos)
    if(err.name ==='MulterError'){
        if(err.code ==='LIMIT_FILE_SIZE'){
            return res.status(400).json({
                ok:false,
                message:'el archivo excede el tamaño maximo de 2MB'
            })
        }
        // que pasa si hay un error en el cual se subieron mas archivos{{ de lo permitido {{}}}}
    }

    // error generico
    res.status(err.statusCode || 500).json({
        ok:false,
        message:err.message || 'error interno del servidor'
    })
}
module.exports= errorhandler;
