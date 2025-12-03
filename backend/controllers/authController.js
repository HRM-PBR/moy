/**
 * Controlador de Autenticación
 * Maneja el login y logout del sistema
 * Creado por: Miguel
 */

const Usuario = require('../models/Usuario');

class AuthController {
    /**
     * Inicia sesión de un usuario
     * POST /api/auth/login
     */
    static async login(req, res) {
        try {
            const { usuario, password } = req.body;

            // Validar que se enviaron los datos requeridos
            if (!usuario || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Usuario y contraseña son requeridos'
                });
            }

            // Buscar usuario
            const user = await Usuario.findByUsername(usuario);

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                });
            }

            // Verificar contraseña
            const isValidPassword = Usuario.comparePassword(password, user.password);

            if (!isValidPassword) {
                return res.status(401).json({
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                });
            }

            // Crear sesión
            req.session.userId = user.id;
            req.session.usuario = user.usuario;
            req.session.nombre = user.nombre;

            res.json({
                success: true,
                message: 'Inicio de sesión exitoso',
                user: {
                    id: user.id,
                    usuario: user.usuario,
                    nombre: user.nombre
                }
            });
        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error al iniciar sesión'
            });
        }
    }

    /**
     * Cierra sesión del usuario
     * POST /api/auth/logout
     */
    static logout(req, res) {
        req.session.destroy((err) => {
            if (err) {
                console.error('Error al cerrar sesión:', err);
                return res.status(500).json({
                    success: false,
                    message: 'Error al cerrar sesión'
                });
            }

            res.json({
                success: true,
                message: 'Sesión cerrada exitosamente'
            });
        });
    }

    /**
     * Obtiene información del usuario autenticado
     * GET /api/auth/me
     */
    static async me(req, res) {
        try {
            if (!req.session.userId) {
                return res.status(401).json({
                    success: false,
                    message: 'No autenticado'
                });
            }

            const user = await Usuario.findById(req.session.userId);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }

            res.json({
                success: true,
                user: {
                    id: user.id,
                    usuario: user.usuario,
                    nombre: user.nombre
                }
            });
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            res.status(500).json({
                success: false,
                message: 'Error al obtener información del usuario'
            });
        }
    }

    /**
     * Registra un nuevo usuario (solo si no hay usuarios en el sistema)
     * POST /api/auth/register
     */
    static async register(req, res) {
        try {
            const { usuario, password, nombre } = req.body;

            // Validar que se enviaron los datos requeridos
            if (!usuario || !password || !nombre) {
                return res.status(400).json({
                    success: false,
                    message: 'Usuario, contraseña y nombre son requeridos'
                });
            }

            // Validar que la contraseña tenga al menos 6 caracteres
            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: 'La contraseña debe tener al menos 6 caracteres'
                });
            }

            // Verificar si ya existe un usuario con ese nombre de usuario
            const existingUser = await Usuario.findByUsername(usuario);
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: 'El nombre de usuario ya está en uso'
                });
            }

            // Verificar si ya hay usuarios en el sistema
            const userCount = await Usuario.count();
            if (userCount > 0) {
                return res.status(403).json({
                    success: false,
                    message: 'Ya existen usuarios en el sistema. El registro está deshabilitado.'
                });
            }

            // Crear el usuario
            const newUser = await Usuario.create({
                usuario,
                password,
                nombre
            });

            // Crear sesión automáticamente
            req.session.userId = newUser.id;
            req.session.usuario = newUser.usuario;
            req.session.nombre = newUser.nombre;

            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                user: {
                    id: newUser.id,
                    usuario: newUser.usuario,
                    nombre: newUser.nombre
                }
            });
        } catch (error) {
            console.error('Error en registro:', error);
            res.status(500).json({
                success: false,
                message: 'Error al registrar usuario'
            });
        }
    }

    /**
     * Verifica si hay usuarios en el sistema
     * GET /api/auth/check-users
     */
    static async checkUsers(req, res) {
        try {
            const userCount = await Usuario.count();
            res.json({
                success: true,
                hasUsers: userCount > 0,
                userCount: userCount
            });
        } catch (error) {
            console.error('Error al verificar usuarios:', error);
            res.status(500).json({
                success: false,
                message: 'Error al verificar usuarios'
            });
        }
    }
}

module.exports = AuthController;

