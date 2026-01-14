
// aqui se realiza el modelo del usuario. es una plantilla que le digo a mongo como va a ser--que tipo de campo y tipo de datos


// paso1 requerir mongoose
const mongoose=require ("mongoose");
const bcrypt=require('bcryptjs');

// paso 2 creamos el esquema del usurai  tipo de dato y extrutura
const userSchema=new mongoose.Schema({
    name:{  // le digo tipo de datos
        type:String,
        required:true
    },
    surname:{  // le digo tipo de datos
        type:String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true,
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
    verifiedEmail:{
        type:Boolean,
        default:false
    },
    verificationCode:{
        type:String,
        default:null
    },
    codeExpiration:{
        type:Date,
        default:null,
    },
   
    // creo un objeto secundario de creacion de este usuario con timestamps
},{
    timestamps:true
});

// hash el password antes de guardar el 
// lo hago aqui y no en el controlador porque es mas limpiio estar aqui
// y mongoose me da la facilidad de sumr una funcion mas
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt);    
})
// metodo para comparar passwordssss
userSchema.methods.comparePasswords=async function (userPassword){
    return await bcrypt.compare(userPassword, this.password)  
}

// llamar al metodo del usuario que crea el codigo de verificacion (email)

userSchema.methods.generateVerificationCode=function(){
    const code=Math.floor(100000 + Math.random() *900000).toString();// genero codigo
    this.verificationCode=code; // el codigo que genere anteriormente lo guardo en verificationcode
    this.codeExpiration=new Date(Date.now() + 15 * 60 *1000);// aqui hago funcion para que expire el codigo. tipo fecha y a los 15min 
    return code;
}





// paso 3- exportar el modelo del usuario( con mongoose.model que requiere dos parametros: alia y esquema)

module.exports= mongoose.model("User", userSchema);