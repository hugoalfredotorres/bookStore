// routes/userRoutes.js enrutador maneja endpoint de usuarios
const express = require('express');
const { verifyAuth, verifyAdmin } = require('../middlewares/auth');
const { getAllUsers, updateUserRole, deleteUser, getUserById } = require('../controllers/user.controller');
const { validateMongoId, validaUpdateRole, validateUserId } = require('../middlewares/auth.validator');
const router = express.Router();

//TODAS LAS RUTAS REQUIEREN AUTNTICACION Y PERMISOS DE ADMIN

router.use(verifyAuth,verifyAdmin);// le indico al enrutador que x defecto use mis middlewares de validacion de roles.

//RUTAS PRIVADAS PARA AMNISNTRACION DE USUSARIOS

router.get('/',getAllUsers);  //http://localhost: 5000/api/v1/
// get userbyid!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
router.get('/:id',validateUserId, getUserById)
router.patch('/:id/role',  validateMongoId, validaUpdateRole,updateUserRole);
router.delete('/:id', validateMongoId, deleteUser);









/*
// Ruta para obtener el perfil del usuario (GET /api/v1/users/profile)
router.get('/profile', (req, res) => {
    // Lógica para obtener los datos del perfil del usuario logueado
    res.send('Obtener perfil del usuario');
});

// Ruta para actualizar el perfil (PUT /api/v1/users/profile)
router.put('/profile', (req, res) => {
    // Lógica para actualizar los datos del perfil
    res.send('Actualizar perfil del usuario');
});

// Ruta para eliminar la cuenta (DELETE /api/v1/users/:userId)
router.delete('/:userId', (req, res) => {
    // Lógica para eliminar la cuenta del usuario
    res.send(`Eliminar cuenta del usuario ${req.params.userId}`);
});
*/

module.exports = router;