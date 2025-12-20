const{body, param, validationResult}=require ('express-validator');
const User= require('../models/User');
const { deleteOneFile } = require('../util/fileCleanpup');



//middlware para manejar cualquier error de validaciones
const handleValidationsError=(req, res, next)=>{
    const errors= validationResult(req) // guardo en errors ls validationResult

    if(!errors.isEmpty()){  // si no esta vacio mando todos los errores
        return res.status(400).json({
            ok:false,
            message:'error de validacion',
            errors:errors.mapped()// envio los erroes con formato que nos da mapped
        })
    }
    next();// si llega vacio xq no hay errores que continue
}

// validciones registro de un usuario
const validateRegister=[
    // valido el name
    body('name')
    .notEmpty().withMessage('el nombre es requerid')
    .isString().withMessage('el nombre debe ser un text')
    .trim()  // quito espacio al texto  entre medio
    .isLength({min:2}).withMessage('debe tener al menos 2 caracteres'),

    //validemos el email
     body('email')
     .notEmpty().withMessage('el email es requerid')
     .isEmail().withMessage('el mail no es formato valido')
     .normalizeEmail()//normaliza email
     // personalizo mi validacion( throw:arroja un new...)
     .custom(async( email, {req})=>{
        const user=await User.findOne({email})
        if(user){
            
            // ysi ademas ese usuario tien una foto de perfil cargada '
            // aqui elimino la foto si el usuario exite asi no me llene el profile
            if(req.file){ // aqui pregunto si vino el archivo con req.file
                deleteOneFile(req.file.path)
            }
            throw new Error(' el usuario ya exite')
        }
     }),

     // validamos el password
     body('password')
     .notEmpty().withMessage('la contraseña es requerida')
     .isLength({min:6}).withMessage('la contraseña debe tener al menos 6 caracteres'),
     
     handleValidationsError // se usa este handleV.. por cada validacion
]

// Validamos el login
const validateLogin=[
    //validemos el email
    body('email')
    .notEmpty().withMessage('el mail es requerida')
    .isEmail().withMessage('el email no es formato valido')
    .normalizeEmail()//normaliza email
    .custom (async(email)=>{
        const user=await User.findOne({email})
        if(!user){
       throw new Error(' credenciales incorrectas')
    }
    }),

     // validamos el password
     body('password')
     .notEmpty().withMessage('la contraseña es requerida')
     .isLength({min:6}).withMessage('la contraseña debe tener al menos 6 caracteres')
     .custom (async(password)=>{
        const user=await User.findOne({password})
        if(!user){
       throw new Error(' credenciales incorrectas')
    }
     }),  

     handleValidationsError // se usa este handleV.. por cada validacion
]

// validamos el delete
const validaUserId=[
    param('id')
    .isMongoId().withMessage('el ID proporcionado no es valvido')
    .custom(async(id)=>{
        const user=await User.findById(id);
        if(!user)
            {
                throw new Error(' el ususario no existe o no fue encontrado')
            } 
        
    }),
    handleValidationsError
]

// validacion del role
const validaUpdateRole=[
    param('id')
    .isMongoId().withMessage('el ID proporcionado no es valvido'),

    body('role')
    .notEmpty().withMessage('debe proporcionar el rol'),
    // .isIn(['user ',' admin','superadmin']).withMessage(' el rol debe ser: user admin o superadmin'), ver que no funciona

    handleValidationsError
];

const validateSuperAdmin=[
    param('id')
    .isMongoId().withMessage('el ID proporcionado no es valvido')
    .custom(async(id)=>{
        const user=await User.findById(id);
        if(user.role () != "superadmin")
            {
                throw new Error(' el ususario no tiene permisos para esta accion')
            } 
        
    }),
    handleValidationsError

]

module.exports={
    validateRegister,
    validateLogin,
    validaUserId,
    validaUpdateRole,
    validateSuperAdmin,

};