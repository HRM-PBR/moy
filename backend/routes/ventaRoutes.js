/**
 * Rutas de Ventas
 * Creado por: Miguel
 */

const express = require('express');
const router = express.Router();
const VentaController = require('../controllers/ventaController');
const { requireAuth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(requireAuth);

// GET /api/ventas - Obtener todas las ventas
router.get('/', VentaController.getAll);

// POST /api/ventas - Crear una nueva venta
router.post('/', VentaController.create);

module.exports = router;

