// mini crud de usuarios auth
// traigo el modelo de user.js
const express = require('express');
const User= require('../models/User.js');
const { sendVerificationEmail } = require('../util/emailService');
const { deleteOneFile } = require('../util/fileCleanpup');
const jwt=require('jsonwebtoken');
const path= require('path');



//funcion auxiliar para generar el token
const generateToken=(id)=>{
  return jwt.sign({id}, process.env.JWT_SECRET,{
    expiresIn:'1h'  // para login el jwt dure 1 hora
  });
};


// funcion para registrar los usuarios y validar que NO este vacio
const register = async (req, res, next) => {

  try {
    const{ name, surname, email, password}=req.body;
    //validar que llegue la info basica. lo hace auth.validator.js
    // valido el email no este en uso. lo hace auth.validator.js
    
     // crear el usuario con mongoose
    const newUser=await User.create({// creamos el usuario en mongoose
        name,                         // le decimos los campos en el orden correcto
        surname,
        email,
        password,
         profilePic : req.file ? req.file.filename: null
    });

    // llamar al metodo del usuario que crea el codigo de verificacion
    const code=newUser.generateVerificationCode();
    await newUser.save();
    console.log(code);

    // enviar el codigo via mail con la funcion de nodemailer, si atrapo algun error debemos borrar el registro y las fotos o la foto. se borrara nombre, apelliido etc

    
     try {
      await sendVerificationEmail (email, name, code);
    
      
    } catch (emailError) {
      console.log(email);console.log(name);console.log(code);console.log(emailError)
      // si falla el envio del email eliminar usuario y foto
      await User.findByIdAndDelete(newUser._id);
      if(req.file){
        (req.file.path)
      }
      return res.status(500).json({
        ok:false,
        message:"error al enviar el mail d verificacion, intenta nuevamnete"
      })
    }

    return res.status(201).json({
      ok:true,
      message:'usuario registrado corectamente 🙋‍♂️',
      user:{
        id:newUser._id,  // guion bajo es porque ya viene de mongodb
        name:newUser.name,
        surname:newUser.surname,
        email:newUser.email,
        role:newUser.role,
        foto:newUser.profilePic
      },
    })
    
  } catch (error) {
    next (error)  // middleware que maneja los errores
    
  }
}
    const verifyEmail= async (req, res, next)=>{
       console.log(email); console.log(code);
      try {
        const {email, code}=req.body;
       
        // si el email ya esta verificado{{}}
        const user=await User.findOne({email});
        if(user.verifiedEmail){
          return res.status(400).json({
            success:false,
            message:"el email ya esta verificado"
          })
        }
        // verificar el codigo y su espiracion
        if (user.verificationCode !== code){
          return res.status(400).json({
            success:false,
            message:'codigo de verifcaion incorrecto'
          })
        }

        // verificar si el codigo expiro
        if(new Date() > user.codeExpiration){
          return res.status(400).json({
            success:false,
            message:'el codigo de verificacion expiro'
          })
        }

        // Marcar el email del ususario como verificao
        user.verifiedEmail=true;
        user.verificationCode=null;
        user.codeExpiration=null;
        await user.save();// se salva todo antes de salir

        return res. status(200).json({
          success:true,
          message:'email verifcado exitosamente, podes iniciar la sesion'
        })
        
      } catch (error) {
        next(error)
      }

    }

   // funcion para Login de los usuarios
   const login =async(req,res)=>{
    try {

      const{ email, password}=req.body;

      //validar que tenga la informacion basica-lo hace el middlewares auth.validators
      //validar que llegue la info basica-lo hace el middlewares auth.validators
    
    // verificar si el email y password estan correcto
    const user=await User.findOne({email}); //buscame que me encuentre un usario con el email  iguales
    
    // verificar la password
     
    const validPassword= await user.comparePasswords(password);
    if(!validPassword){
      return res. status(401).json({
        ok:false,
        message:' credenciales incorrectas✖️✖️'
      })
    } 

    // validar que el mail del ususario este verifcado
    if(!user.verifiedEmail){
      return res.status(403).json({
        ok: false,
        message:"debes verificar tu mail para iniciar sesion🫣"
      })
    }

     // Generar token

     const token=generateToken(user._id);// aqui se acaba de generar el token

    // enviar/responder una cookie con el token (creamos una cookie  )
     res.cookie('token', token, {
      httpOnly:true, // opciones de seguridad: aqui seteamos que somaenete se pued enviar en este protocolo  y protege contra ataques XSS.
      sameSite: 'none' , // 'lax' esto es si la cooki viaja en el mismo sitio o en otro sitio 
      maxAge: 60*60*1000,  // duracion de la cookie 
      secure:true,// obligatorio si usas https o chrome/postman modernos
     })

    // si encontro un email y password en req.body.. entonce te logueo

    return res.status(200).json({
      ok:true,
      message:'login exitoso✔️',
      token,
      data:{
        id:user._id,
        mane:user.name,
        email:user.email,
        role: user.role,
      }
    })

      
    } catch (error) {
    console.error(error)
    return res.status(500).json({
      ok:false,
      message:error.message
    })
    
  }
   }

   // funcion LOGOUT ( solo hace que muera los cookie.. eso es todo)
   const logout=async(req,res,next)=>{
    try {
      res.clearCookie(200).json({
        ok:true,
        message:'lgout exitoso!!'
      })
      
    } catch (error) {
      next(error) 
      
    }
   }

   // funcion GETPROFILE
   const getUserProfile = async (req,res, next) => {
    try {
        
     const user = await User.findById(req.user._id) //accedo al ususario desde mongo
     .select('-password -verificationCode -codeExpiration');// no queiro qe traigas esto y tarda mens en responder, la consulta es rapida
     
     return res.status(200).json({
        ok:true,
        message: "Perfil del usuario obtenido correctamente",
        data: user
     })
    } catch (error) {
        next(error)
    }
}


const updateProfilePhoto = async (req,res, next) => {
    try {

        // validamos que el usuario suba una foto
        if(!req.file){
            return res.status(400).json({
                ok:false,
                message:"no se proporcionó ninguna imagen"
            })
        }

        const user = await User.findById(req.user._id)//accedo al ususario desde mongo
        .select('-password -verificationCode -codeExpiration');// no queiro qe traigas esto y tarda mens en responder, la consulta es rapida
        

        // Eliminar la foto anterior si es que existe
        if(user.profilePic){
            const path = require('path');
            const previousPhoto = path.join(__dirname, '../../src/uploads/profile',user.profilePic)
            deleteOneFile(previousPhoto)
        }

        // Actualizar con la nueva foto que envie el usuario
        user.profilePic = req.file.filename;
        await user.save()

        //enviamos la respuesta
        return res.status(201).json({
            ok:true,
            message:"foto de perfil actualizada 😊",
            data: user.profilePic
        })
        
    } catch (error) {
        next(error)
    }
}

module.exports = {
  register,
  login,
  verifyEmail,
  logout,
  getUserProfile,
  updateProfilePhoto,
}
