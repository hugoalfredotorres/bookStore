const fs=require ('fs');
const path= require('path');

// eliminar un archivo
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
 module.exports={
    deleteOneFile,
 }