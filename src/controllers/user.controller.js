// mini crud de usuarios auth
// traigo el modelo de user.js
const express = require('express');
const User= require('../models/User.js');
const { sendVerificationEmail } = require('../util/emailService');
const { deleteOneFile, getCompleteRoute } = require('../util/fileCleanpup');
const jwt=require('jsonwebtoken');
const path= require('path');

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

// funcion get user by id
const getUserById=async (req, res,next)=>{
  try {
    const user= await User.findById(req.params.id)
   .select('-password -verificationCode -codeExpiration')
   if(!user){
    return res.status(404).json({
      ok:false,
      message:'usuario no encontrado'
    })
   }
   return res.status(200).json({
    ok:true,
    message:'usuario encontrado',
    data:user
   })
    
  } catch (error) {
     next(error)
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

    const user=await User.findById(id);
    // protejer al superadmin del borrado!!!!!!!!!!!!!!!!!!!!
    if(user.role === process.env.SUPER_ADMIN_ROLE){
      return res.status(403).json({
        ok:false,
        message:"no se puede eliminar el sueradmin"
      })
    }
    // si tiene una foto de perfil borrarla!!!!!!!!!!!!!!!!

    if(user.profilePic){
      const photoPath=getCompleteRoute(user.profilePic, 'profiles');
      deleteOneFile(photoPath);
    }

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
  getAllUsers,
  deleteUser,
  updateUserRole,
  getUserById
}
