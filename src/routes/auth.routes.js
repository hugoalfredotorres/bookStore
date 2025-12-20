// enrutador endpoint para manejar la autenticador del usuario
const express=require ("express");
const { register, login, getAllUsers, deleteUser, updateUserRole } = require("../controllers/auth.controller");
const { validateRegister, validateLogin, validaUserId, validaUpdateRole, validateSuperAdmin } = require("../middlewares/auth.validator");
const { upLoadProfile } = require("../config/multer");
const router=express.Router(); // esto es un metodo para generar las rutas


// Endpoint(rutas) de Registro (POST /api/v1/auth/XXXXXX)

router.post("/register",upLoadProfile,validateRegister, register); //de Registro (POST/api/v1/auth/register)
router.post("/login",validateLogin, login);//de Registro (POST/api/v1/auth/login)
router.get("/users/:id ",validateSuperAdmin, getAllUsers);// de Registro (GET/api/v1/auth/users)
router.delete("/user/:id",validaUserId, deleteUser);// de Registro (GET/api/v1/auth/users/id)-ruta parametrizada
router.patch("/user/:id",validaUpdateRole,updateUserRole);//de Registro (POST/api/v1/auth/user/)


module.exports=router;