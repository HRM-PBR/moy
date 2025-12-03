/**
 * Modelo de Usuario
 * Creado por: Miguel
 */

const { db } = require('../database/db');
const bcrypt = require('bcryptjs');

class Usuario {
    /**
     * Busca un usuario por su nombre de usuario
     * @param {string} usuario - Nombre de usuario
     * @returns {Promise<Object|null>}
     */
    static findByUsername(usuario) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM usuarios WHERE usuario = ?',
                [usuario],
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
     * Busca un usuario por su ID
     * @param {number} id - ID del usuario
     * @returns {Promise<Object|null>}
     */
    static findById(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id, usuario, nombre, created_at FROM usuarios WHERE id = ?',
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
     * Verifica la contraseña de un usuario
     * @param {string} plainPassword - Contraseña en texto plano
     * @param {string} hashedPassword - Contraseña hasheada
     * @returns {boolean}
     */
    static comparePassword(plainPassword, hashedPassword) {
        return bcrypt.compareSync(plainPassword, hashedPassword);
    }

    /**
     * Crea un nuevo usuario
     * @param {Object} usuarioData - Datos del usuario
     * @returns {Promise<Object>}
     */
    static create(usuarioData) {
        return new Promise((resolve, reject) => {
            const { usuario, password, nombre } = usuarioData;
            const hashedPassword = bcrypt.hashSync(password, 10);

            db.run(
                'INSERT INTO usuarios (usuario, password, nombre) VALUES (?, ?, ?)',
                [usuario, hashedPassword, nombre],
                function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        // Obtener el usuario creado
                        Usuario.findById(this.lastID).then(resolve).catch(reject);
                    }
                }
            );
        });
    }

    /**
     * Cuenta el número total de usuarios en el sistema
     * @returns {Promise<number>}
     */
    static count() {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT COUNT(*) as total FROM usuarios',
                [],
                (err, row) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(row ? row.total : 0);
                    }
                }
            );
        });
    }
}

module.exports = Usuario;

