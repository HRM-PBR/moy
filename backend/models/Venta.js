/**
 * Modelo de Venta
 * Creado por: Miguel
 */

const { db } = require('../database/db');

class Venta {
    /**
     * Obtiene todas las ventas con información del producto
     * @returns {Promise<Array>}
     */
    static findAll() {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT v.*, p.nombre as producto_nombre, p.codigo_sku
                 FROM ventas v
                 INNER JOIN productos p ON v.producto_id = p.id
                 ORDER BY v.fecha DESC`,
                [],
                (err, rows) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(rows || []);
                    }
                }
            );
        });
    }

    /**
     * Crea una nueva venta
     * @param {Object} ventaData - Datos de la venta
     * @returns {Promise<Object>}
     */
    static create(ventaData) {
        return new Promise((resolve, reject) => {
            const { producto_id, cantidad, precio_unitario, precio_total, usuario_id, fecha } = ventaData;
            
            db.run(
                `INSERT INTO ventas (producto_id, cantidad, precio_unitario, precio_total, usuario_id, fecha)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [producto_id, cantidad, precio_unitario, precio_total, usuario_id || null, fecha || new Date().toISOString()],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Obtener la venta creada con información del producto
                        Venta.findById(this.lastID).then(resolve).catch(reject);
                    }
                }
            );
        });
    }

    /**
     * Obtiene una venta por su ID
     * @param {number} id - ID de la venta
     * @returns {Promise<Object|null>}
     */
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                `SELECT v.*, p.nombre as producto_nombre, p.codigo_sku
                 FROM ventas v
                 INNER JOIN productos p ON v.producto_id = p.id
                 WHERE v.id = ?`,
                [id],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row || null);
                    }
                }
            );
        });
    }
}

module.exports = Venta;

