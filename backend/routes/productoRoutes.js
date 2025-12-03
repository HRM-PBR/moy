/**
 * Rutas de Productos
 * Creado por: Miguel
 */

const express = require('express');
const router = express.Router();
const ProductoController = require('../controllers/productoController');
const { requireAuth } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(requireAuth);

// GET /api/productos - Obtener todos los productos
router.get('/', ProductoController.getAll);

// GET /api/productos/:id - Obtener un producto por ID
router.get('/:id', ProductoController.getById);

// POST /api/productos - Crear un nuevo producto
router.post('/', ProductoController.create);

// PUT /api/productos/:id - Actualizar un producto
router.put('/:id', ProductoController.update);

// DELETE /api/productos/:id - Eliminar un producto
router.delete('/:id', ProductoController.delete);

module.exports = router;

