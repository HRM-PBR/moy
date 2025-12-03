/**
 * Rutas de Autenticación
 * Creado por: Miguel
 */

const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

// Ruta pública: Verificar si hay usuarios en el sistema
router.get('/check-users', AuthController.checkUsers);

// Ruta pública: Registrar primer usuario
router.post('/register', AuthController.register);

// Ruta pública: Iniciar sesión
router.post('/login', AuthController.login);

// Ruta protegida: Obtener información del usuario autenticado
router.get('/me', requireAuth, AuthController.me);

// Ruta pública: Cerrar sesión
router.post('/logout', AuthController.logout);

module.exports = router;

