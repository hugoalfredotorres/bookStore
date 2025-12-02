// routes/userRoutes.js enrutador maneja endpoint de usuarios
const express = require('express');
const router = express.Router();

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

module.exports = router;