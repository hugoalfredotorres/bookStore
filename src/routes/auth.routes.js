// enrutador endpoint para manejar la autenticador del usuario
const express=require ("express");
const { register, login, getAllUsers, deleteUser, updateUserRole, verifyEmail, logout, getUserProfile, updateProfilePhoto} = require("../controllers/auth.controller");
const { validateRegister, validateLogin, validaUserId, validaUpdateRole, validateSuperAdmin, validateVerifyEmail,  } = require("../middlewares/auth.validator");
const { upLoadProfile } = require("../config/multer");
const { verifyAuth } = require("../middlewares/auth");
const router=express.Router(); // esto es un metodo para generar las rutas


// Endpoint(rutas) de Registro (POST /api/v1/auth/XXXXXX)
// importante el orden de las validaciones 1-multer 2-validacione 3- controlador
// endpoint publicos
router.post("/register",upLoadProfile,validateRegister, register); //de Registro (POST/api/v1/auth/register)
router.post("/verify-email",validateVerifyEmail, verifyEmail); //de Registro (POST/api/v1/auth/verify-email)
router.post("/login",validateLogin, login);//de Registro (POST/api/v1/auth/login)


// endpoint son privadas
router.post("/logout",verifyAuth, logout);
router.get("/profile",verifyAuth,  getUserProfile );
router.put("/profile/photo", verifyAuth, upLoadProfile, updateProfilePhoto);

//router.delete("/user/:id",validaUserId, deleteUser);// de Registro (GET/api/v1/auth/users/id)-ruta parametrizada
//router.patch("/user/:id",validaUpdateRole,updateUserRole);//de Registro (POST/api/v1/auth/user/)
// router.get("/users/:id ",validateSuperAdmin, getAllUsers);// de Registro (GET/api/v1/auth/users)


module.exports=router;