/**
 * Controlador de Ventas
 * Maneja el registro de ventas y el historial
 * Creado por: Miguel
 */

const Venta = require('../models/Venta');
const Producto = require('../models/Producto');

class VentaController {
    /**
     * Obtiene todas las ventas
     * GET /api/ventas
     */
    static async getAll(req, res) {
        try {
            const ventas = await Venta.findAll();
            res.json({
                success: true,
                ventas
            });
        } catch (error) {
            console.error('Error al obtener ventas:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener ventas'
            });
        }
    }

    /**
     * Crea una nueva venta
     * POST /api/ventas
     */
    static async create(req, res) {
        try {
            const { producto_id, cantidad, fecha } = req.body;
            const usuario_id = req.session.userId;

            // Validar campos requeridos
            if (!producto_id || !cantidad) {
                return res.status(400).json({
                    success: false,
                    message: 'Producto y cantidad son requeridos'
                });
            }

            // Validar que cantidad sea un número válido y mayor a 0
            const cantidadNum = parseInt(cantidad);
            if (isNaN(cantidadNum) || cantidadNum <= 0) {
                return res.status(400).json({
                    success: false,
                    message: 'La cantidad debe ser un número mayor a 0'
                });
            }

            // Obtener el producto
            const producto = await Producto.findById(producto_id);
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    message: 'Producto no encontrado'
                });
            }

            // Verificar que el producto esté activo
            if (producto.activo === 0) {
                return res.status(400).json({
                    success: false,
                    message: 'El producto no está disponible'
                });
            }

            // Verificar stock disponible
            if (producto.stock < cantidadNum) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente. Stock disponible: ${producto.stock}`
                });
            }

            // Calcular precios
            const precio_unitario = producto.precio;
            const precio_total = precio_unitario * cantidadNum;

            // Crear la venta
            const venta = await Venta.create({
                producto_id,
                cantidad: cantidadNum,
                precio_unitario,
                precio_total,
                usuario_id,
                fecha: fecha || new Date().toISOString()
            });

            // Disminuir el stock del producto
            await Producto.decreaseStock(producto_id, cantidadNum);

            res.status(201).json({
                success: true,
                message: 'Venta registrada exitosamente',
                venta
            });
        } catch (error) {
            console.error('Error al crear venta:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar venta'
            });
        }
    }
}

module.exports = VentaController;

