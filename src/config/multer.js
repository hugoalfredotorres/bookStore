// config multer

// paso 1: ver la documentacion. interiorizarnos de la forma de almacenar la foto
// paso 2: instalar multer: npm i multer
// paso 3: crear el profile en User como nuevo campo para que mongo sepa que llegara un archivo
// paso 4: crear una crpeta dentro de config
// paso 5: crear un archivo multer.js
// 

const multer= require ('multer');
const path= require ('path') // traigo el modulo path para trabajar en donde guardarlo
const fs = require ('fs'); // modulo fs nos ayuda a trab con archivos leerlos,escribirlo, eliminarlo etc

// cpnfigura de almacenamiento para fotos de perfil
// armo 2 funciones : donde se guardar y el nombre 

const profileStorage=multer.diskStorage({     // donde loa gurado y el nombre de la imagen
    destination:(req, file, cb)=>{
        const  uploadPath=path.join(__dirname, '../../src/uploads/profile');// armo el camino a profile upload
        // valido si la carpeta no exite o no la he creado
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, {recursive:true} ) // si no exite el mkdirsync crea, y recursyn en true
        }
        cb(null, uploadPath)// el colback es donde se guarda la info


    },// aqui creamo la fecha, un id y el nombre del archivo
    filename:(req, file, cb)=>{
        // const uniqueSuffix=Date.now()+'-'+ Math.round(Math.random()*1E9) // armo la cadena de archivo que voy a almacenar, y para que no se repita el nombre ooooo
        //path.extname(file.originalname), indica la extension que voy a guardar o que trae el archivo original
        const uniqueSuffix=Date.now()+'-profile-'+ crypto.randomUUID()+ path.extname(file.originalname);
        cb(null, uniqueSuffix)
    }
}) ;


// armar filtros de archivos
const fileFilter= (req, file, cb)=>{
    const allowedTypes= /jpeg|jpg|png|webp/; // estas extesnsiones solo quiero recibir,, y nada mas
    const extname=allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase()); // comparo las extensiones
    const mimetype=allowedTypes.test(file.mimetype);// identifica el tipo de archivo cuando viaja por la url/http
    if(extname && mimetype){ // si ambos me dan true
        cb(null, true) // listo porcesamos
    }else{  // si ambos me da false
        cb(new Error ('solo se permite imagenes (jpeg, jpg, webp)'))// llamo al colback
    }
};

// configuuracion para fotos de perfil( 1 archivo, max 2mb)(lo mejor jpeg y webp)
const upLoadProfile= multer({
    storage:profileStorage,  // aqui le digo a multer donde guardar la fotos
limits:{fileSize: 2*1024*1024},  // tamaño de bit para que sea 2 mb
fileFilter:fileFilter  // aqui le digo a multer que hay un filefilter
// metodo para guardar una o varias fotos

}).single('profilePic'); // metodo para guardar una(single) o varias fotos

// exportar la funcion
module.exports={
    upLoadProfile,
}
