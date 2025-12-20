// mini crud de usuarios auth

// traigo el modelo de user.js
const e = require('express');
const User= require('../models/User');

// funcion para getallgetAllusers users.. leer toos los usuarios
const getAllUsers=async (req, res)=>{
  try {

    const users=await User.find().select("-password");  //find trae tod los documentos que le pida-todos los usuarios menos la password

    // validamos que existan usuarios para enviar mensaje al front
    if(users.length===0){
      return res.status(404).json({
      ok:false,
      message:'no se encontraron usuarios en la DB 🛩️'
    })
    }
    // si hay datos en base de dato aunque sea uno
    return res.status(200).json({
      ok:true,
      message:"usuarios encontrados en db",
      data:{
        length:users.length,
        users,
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

// funcion para registrar los usuarios y validar que NO este vacio
const register = async (req, res) => {

  try {
    const{ name,email,password}=req.body;
    //validar que llegue la info basica. lo hace auth.validator.js
    // valido el email no este en uso. lo hace auth.validator.js
    
     // crear el usuario con mongoose
    const newUser=await User.create({// creamos el usuario en mongoose
      name,                         // le decimos los campos en el orden correcto
       email,
        password,
         profilePic : req.file ? req.file.filename: null
    });
    return res.status(201).json({
      ok:true,
      message:'usuario registrado corectamente 🙋‍♂️',
      user:{
        id:newUser._id,  // guion bajo es porque ya viene de mongodb
        name:newUser.name,
        email:newUser.email,
        role:newUser.role,
        foto:newUser.profilePic
      },
    })


    
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      ok:false,
      message:error.message
    })
    
  }
}
   // funcion para Login de los usuarios
   const login =async(req,res)=>{
    try {

      const{ email, password}=req.body;

      //validar que tenga la informacion basica-lo hace el middlewares auth.validators
      //validar que llegue la info basica-lo hace el middlewares auth.validators
    
    // verificar si el email y password estan correcto
    const user=await User.findOne({email, password}); //buscame que me encuentre un usario con el email y passwor iguales
    
    // si encontro un email y password en req.body.. entonce te logueo

    return res.status(200).json({
      ok:true,
      message:'login exitoso✔️',
      user:{
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

   // Funciom para realizar el camibo de role
    const updateUserRole=async(req, res)=>{
    try {
      const {id}=req.params; // atrapo el id del params
      const {role}=req.body; // atrapo el role que bien en body

      // buscar y actulaizar el usuario con findByIdAndUpdate
      const updateUser= await User.findByIdAndUpdate(
        id,
        {role},// actualices el role
        {new:true, 
        runValidators:true} // correr las validaciones
      ).select("-password");// le digo que no me traiga la password

      // si encontro el usario y salio todo bien

      return res.status(200).json({
      ok:true,
      message:`role actualizado correctamente`,
      user:{
        id:updateUser._id,
        name:updateUser.name,
        email:updateUser.email,
        role:updateUser.role
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

   // funcion para eliminar un usuario por su ID
const deleteUser = async (req, res) => {
  try {
    // 1. Obtener el ID del usuario a eliminar
    // Se asume que el ID vendrá en los parámetros de la URL (ej: /users/12345)
    const { id } = req.params;

    // 2. Ejecutar la eliminación
    // findByIdAndDelete busca y elimina el documento en una sola operación
    const deletedUser = await User.findByIdAndDelete(id).select("-password");// le digo que no me traiga la password;

    // 3. Validar si el usuario existía-lo hace el middlewares auth.validators
    
    // 4. Respuesta exitosa
    return res.status(200).json({
      ok: true,
      message: 'Usuario eliminado correctamente ✅',
      user:deletedUser
      //data: {
        //id: deletedUser._id,
        //name: deletedUser.name,
      //}
    });

  } catch (error) {
    // Manejo de errores (ej. formato de ID incorrecto)
    console.error(error);
    return res.status(500).json({
      ok: false,
      message: 'Error al intentar eliminar el usuario: ' + error.message
    });
  }
}

module.exports = {
  register,
  login,
  getAllUsers,
  deleteUser,
  updateUserRole 
}
