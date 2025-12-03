/**
 * Middleware de autenticación
 * Verifica si el usuario está autenticado antes de acceder a rutas protegidas
 * Creado por: Miguel
 */

/**
 * Middleware para verificar si el usuario está autenticado
 * Redirige al login si no hay sesión activa
 */
function requireAuth(req, res, next) {
    if (req.session && req.session.userId) {
        // Usuario autenticado, continuar
        next();
    } else {
        // Usuario no autenticado, redirigir al login
        if (req.xhr || req.headers.accept?.indexOf('json') > -1) {
            // Si es una petición AJAX, devolver JSON
            res.status(401).json({ success: false, message: 'No autenticado' });
        } else {
            // Si es una petición normal, redirigir
            res.redirect('/login.html');
        }
    }
}

/**
 * Middleware para verificar si el usuario NO está autenticado
 * Redirige al dashboard si ya hay sesión activa (útil para la página de login)
 */
function requireGuest(req, res, next) {
    if (req.session && req.session.userId) {
        // Usuario ya autenticado, redirigir al dashboard
        res.redirect('/dashboard.html');
    } else {
        // Usuario no autenticado, continuar
        next();
    }
}

module.exports = { requireAuth, requireGuest };

