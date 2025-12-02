// enrutador endpoint para manejar la autenticador del usuario
const express=require ("express");
const { register, login, getAllusers, deleteUser } = require("../CONTROLLERS/auth.controller");
const router=express.Router(); // esto es un metodo para generar las rutas


// Endpoint(rutas) de Registro (POST /api/v1/auth/XXXXXX)

router.post("/register", register); //de Registro (POST/api/v1/auth/register)
router.post("/login", login);//de Registro (POST/api/v1/auth/login)
router.get("/users", getAllusers);// de Registro (GET/api/v1/auth/users)
router.delete("/user/:id", deleteUser);// de Registro (GET/api/v1/auth/users/id)-ruta parametrizada



module.exports=router;