/**
 * Controlador de Productos
 * Maneja todas las operaciones CRUD de productos
 * Creado por: Miguel
 */

const Producto = require('../models/Producto');

class ProductoController {
    /**
     * Obtiene todos los productos
     * GET /api/productos
     */
    static async getAll(req, res) {
        try {
            const { buscar, soloActivos } = req.query;

            let productos;

            if (buscar) {
                // Si hay término de búsqueda, buscar productos
                productos = await Producto.search(buscar);
            } else {
                // Obtener todos los productos
                productos = await Producto.findAll(soloActivos === 'true');
            }

            res.json({
                success: true,
                productos
            });
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener productos'
            });
        }
    }

    /**
     * Obtiene un producto por su ID
     * GET /api/productos/:id
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const producto = await Producto.findById(id);

            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            res.json({
                success: true,
                producto
            });
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener producto'
            });
        }
    }

    /**
     * Crea un nuevo producto
     * POST /api/productos
     */
    static async create(req, res) {
        try {
            const { nombre, categoria, precio, stock, codigo_sku, descripcion } = req.body;

            // Validar campos requeridos
            if (!nombre || !categoria || precio === undefined || stock === undefined || !codigo_sku) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos requeridos deben ser proporcionados'
                });
            }

            // Validar que precio y stock sean números válidos
            if (isNaN(precio) || isNaN(stock)) {
                return res.status(400).json({
                    success: false,
                    message: 'Precio y stock deben ser números válidos'
                });
            }

            // Crear producto
            const producto = await Producto.create({
                nombre,
                categoria,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                codigo_sku,
                descripcion: descripcion || ''
            });

            res.status(201).json({
                success: true,
                message: 'Producto creado exitosamente',
                producto
            });
        } catch (error) {
            console.error('Error al crear producto:', error);
            
            // Verificar si es error de duplicado
            if (error.message && error.message.includes('UNIQUE constraint')) {
                return res.status(400).json({
                    success: false,
                    message: 'El código SKU ya existe'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al crear producto'
            });
        }
    }

    /**
     * Actualiza un producto
     * PUT /api/productos/:id
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { nombre, categoria, precio, stock, codigo_sku, descripcion } = req.body;

            // Verificar que el producto existe
            const productoExistente = await Producto.findById(id);
            if (!productoExistente) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            // Validar campos requeridos
            if (!nombre || !categoria || precio === undefined || stock === undefined || !codigo_sku) {
                return res.status(400).json({
                    success: false,
                    message: 'Todos los campos requeridos deben ser proporcionados'
                });
            }

            // Validar que precio y stock sean números válidos
            if (isNaN(precio) || isNaN(stock)) {
                return res.status(400).json({
                    success: false,
                    message: 'Precio y stock deben ser números válidos'
                });
            }

            // Actualizar producto
            const producto = await Producto.update(id, {
                nombre,
                categoria,
                precio: parseFloat(precio),
                stock: parseInt(stock),
                codigo_sku,
                descripcion: descripcion || ''
            });

            res.json({
                success: true,
                message: 'Producto actualizado exitosamente',
                producto
            });
        } catch (error) {
            console.error('Error al actualizar producto:', error);
            
            // Verificar si es error de duplicado
            if (error.message && error.message.includes('UNIQUE constraint')) {
                return res.status(400).json({
                    success: false,
                    message: 'El código SKU ya existe'
                });
            }

            res.status(500).json({
                success: false,
                message: 'Error al actualizar producto'
            });
        }
    }

    /**
     * Elimina (desactiva) un producto
     * DELETE /api/productos/:id
     */
    static async delete(req, res) {
        try {
            const { id } = req.params;

            // Verificar que el producto existe
            const producto = await Producto.findById(id);
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            // Eliminar (desactivar) producto
            const eliminado = await Producto.delete(id);

            if (eliminado) {
                res.json({
                    success: true,
                    message: 'Producto eliminado exitosamente'
                });
            } else {
                res.status(500).json({
                    success: false,
                    message: 'Error al eliminar producto'
                });
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({
                success: false,
                message: 'Error al eliminar producto'
            });
        }
    }
}

module.exports = ProductoController;

