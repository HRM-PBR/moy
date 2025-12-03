/**
 * Modelo de Producto
 * Creado por: Miguel
 */

const { db } = require('../database/db');

class Producto {
    /**
     * Obtiene todos los productos (activos e inactivos)
     * @param {boolean} soloActivos - Si es true, solo devuelve productos activos
     * @returns {Promise<Array>}
     */
    static findAll(soloActivos = false) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM productos';
            const params = [];

            if (soloActivos) {
                query += ' WHERE activo = 1';
            }

            query += ' ORDER BY nombre ASC';

            db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(rows || []);
                }
            });
        });
    }

    /**
     * Busca productos por término de búsqueda
     * @param {string} termino - Término de búsqueda
     * @returns {Promise<Array>}
     */
    static search(termino) {
        return new Promise((resolve, reject) => {
            const searchTerm = `%${termino}%`;
            db.all(
                `SELECT * FROM productos 
                 WHERE (nombre LIKE ? OR categoria LIKE ? OR codigo_sku LIKE ?) 
                 AND activo = 1
                 ORDER BY nombre ASC`,
                [searchTerm, searchTerm, searchTerm],
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
     * Obtiene un producto por su ID
     * @param {number} id - ID del producto
     * @returns {Promise<Object|null>}
     */
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM productos WHERE id = ?',
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

    /**
     * Crea un nuevo producto
     * @param {Object} productoData - Datos del producto
     * @returns {Promise<Object>}
     */
    static create(productoData) {
        return new Promise((resolve, reject) => {
            const { nombre, categoria, precio, stock, codigo_sku, descripcion } = productoData;
            
            db.run(
                `INSERT INTO productos (nombre, categoria, precio, stock, codigo_sku, descripcion)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [nombre, categoria, precio, stock, codigo_sku, descripcion || ''],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Obtener el producto creado
                        Producto.findById(this.lastID).then(resolve).catch(reject);
                    }
                }
            );
        });
    }

    /**
     * Actualiza un producto
     * @param {number} id - ID del producto
     * @param {Object} productoData - Datos actualizados
     * @returns {Promise<Object>}
     */
    static update(id, productoData) {
        return new Promise((resolve, reject) => {
            const { nombre, categoria, precio, stock, codigo_sku, descripcion } = productoData;
            
            db.run(
                `UPDATE productos 
                 SET nombre = ?, categoria = ?, precio = ?, stock = ?, 
                     codigo_sku = ?, descripcion = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [nombre, categoria, precio, stock, codigo_sku, descripcion || '', id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        Producto.findById(id).then(resolve).catch(reject);
                    }
                }
            );
        });
    }

    /**
     * Elimina (desactiva) un producto
     * @param {number} id - ID del producto
     * @returns {Promise<boolean>}
     */
    static delete(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE productos SET activo = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes > 0);
                    }
                }
            );
        });
    }

    /**
     * Disminuye el stock de un producto
     * @param {number} id - ID del producto
     * @param {number} cantidad - Cantidad a disminuir
     * @returns {Promise<boolean>}
     */
    static decreaseStock(id, cantidad) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE productos SET stock = stock - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
                [cantidad, id],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(this.changes > 0);
                    }
                }
            );
        });
    }
}

module.exports = Producto;

