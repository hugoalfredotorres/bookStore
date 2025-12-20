// aqui se realiza el modelo del usuario. es una plantilla que le digo a mongo como va a ser--que tipo de campo y tipo de datos


// paso1 requerir mongoose
const mongoose=require ("mongoose");
// paso 2 creamos el esquema del usurai  tipo de dato y extrutura
const userSchema=new mongoose.Schema({
    name:{  // le digo tipo de datos
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },

    // guardo la referencia al nombre del archivo.. la foto la guardo en la pc
    profilePic:{
        type:String,
        default:"https://img.icons8.com/ios_filled/1200/user-male-circle.jpg"
    },
    password:{
        type:String,
        required:true,
    },
    role: {
        type: String,
        enum:['user', 'admin','superadmin'],
        default:'user',
    },
   
    // creo un objeto secundario de creacion de este usuario con timestamps
},{
    timestamps:true
});



// paso 3- exportar el modelo del usuario( con mongoose.model que requiere dos parametros: alia y esquema)

module.exports= mongoose.model("User", userSchema);