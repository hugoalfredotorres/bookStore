const fs=require ('fs');
const path= require('path');

// eliminar un archivo que se subio a multer 
 const deleteOneFile=(filePath)=>{
    try {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
            console.log (`archivo eliminado :${filePath}`);
        }
        
    } catch (error) {
        console.error( `error al elimina el archivo ${filePath}:${error.message}`)
    }
 }
  // eliminar archivos subidos por multer ( re.file o req.files)
  const cleanUploadsFiles=(req)=>{
    if(req.file){
        deleteOneFile(req.file.path)
    }
    if(req.files && Array.isArray(req.files)){
        req.files.forEach(file=> deleteOneFile(file.path))
    }
  }

  // obtener ruta completa del archivo desde nombre
  const getCompleteRoute=(filename,type='profiles')=>{
    return path.join (__dirname, `../uploads/${type}`, filename)
  }

 module.exports={
    deleteOneFile,
    cleanUploadsFiles,
    getCompleteRoute,
 }