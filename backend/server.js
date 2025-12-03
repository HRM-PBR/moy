/**
 * Servidor principal de la aplicación
 * Sistema de Gestión Web para Refaccionaria
 * Creado por: Miguel
 */

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const { initDatabase } = require('./database/db');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productoRoutes = require('./routes/productoRoutes');
const ventaRoutes = require('./routes/ventaRoutes');

// Importar middleware
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de sesiones
app.use(session({
    secret: 'refaccionaria-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // En producción con HTTPS, cambiar a true
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware para parsear JSON y URL encoded
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware personalizado para proteger páginas HTML (excepto login)
app.use((req, res, next) => {
    // Si es una petición a un archivo HTML protegido, verificar autenticación
    if (req.path.match(/^\/(dashboard|inventario|ventas)\.html$/)) {
        return requireAuth(req, res, next);
    }
    next();
});

// Servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/ventas', ventaRoutes);

// Ruta raíz - redirigir al dashboard, login o registro
app.get('/', async (req, res) => {
    if (req.session && req.session.userId) {
        res.redirect('/dashboard.html');
    } else {
        // Verificar si hay usuarios en el sistema
        try {
            const Usuario = require('./models/Usuario');
            const userCount = await Usuario.count();
            if (userCount === 0) {
                // No hay usuarios, redirigir al registro
                res.redirect('/registro.html');
            } else {
                // Hay usuarios, redirigir al login
                res.redirect('/login.html');
            }
        } catch (error) {
            // En caso de error, redirigir al login
            console.error('Error al verificar usuarios:', error);
            res.redirect('/login.html');
        }
    }
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error en el servidor:', err);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
    });
});

// Ruta 404 para páginas no encontradas
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, '../frontend/views/404.html'));
});

// Inicializar base de datos y luego iniciar servidor
initDatabase()
    .then(() => {
        app.listen(PORT, () => {
            console.log('═══════════════════════════════════════════════════════════');
            console.log('🚀 Sistema de Gestión para Refaccionaria');
            console.log('═══════════════════════════════════════════════════════════');
            console.log(`✓ Servidor corriendo en http://localhost:${PORT}`);
            console.log(`✓ Base de datos inicializada`);
            console.log('═══════════════════════════════════════════════════════════');
            console.log('📝 Crea tu primer usuario desde el registro');
            console.log('═══════════════════════════════════════════════════════════');
        });
    })
    .catch((error) => {
        console.error('❌ Error al inicializar la base de datos:', error);
        process.exit(1);
    });

module.exports = app;

