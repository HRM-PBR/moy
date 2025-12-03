/**
 * Configuración y conexión a la base de datos SQLite
 * Creado por: Miguel
 */

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Ruta de la base de datos
const dbPath = path.join(__dirname, 'refaccionaria.db');

// Crear conexión a la base de datos
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error al conectar con la base de datos:', err.message);
    } else {
        console.log('✓ Conectado a la base de datos SQLite');
    }
});

// Habilitar foreign keys
db.run('PRAGMA foreign_keys = ON');

/**
 * Inicializa las tablas de la base de datos si no existen
 */
function initDatabase() {
    return new Promise((resolve, reject) => {
        // Tabla de usuarios
        db.run(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                nombre TEXT NOT NULL,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error al crear tabla usuarios:', err.message);
                reject(err);
                return;
            }
            console.log('✓ Tabla usuarios creada/verificada');
        });

        // Tabla de productos
        db.run(`
            CREATE TABLE IF NOT EXISTS productos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                categoria TEXT NOT NULL,
                precio REAL NOT NULL,
                stock INTEGER NOT NULL DEFAULT 0,
                codigo_sku TEXT UNIQUE NOT NULL,
                descripcion TEXT,
                activo INTEGER DEFAULT 1,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error al crear tabla productos:', err.message);
                reject(err);
                return;
            }
            console.log('✓ Tabla productos creada/verificada');
        });

        // Tabla de ventas
        db.run(`
            CREATE TABLE IF NOT EXISTS ventas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                producto_id INTEGER NOT NULL,
                cantidad INTEGER NOT NULL,
                precio_unitario REAL NOT NULL,
                precio_total REAL NOT NULL,
                fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
                usuario_id INTEGER,
                FOREIGN KEY (producto_id) REFERENCES productos(id),
                FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
            )
        `, (err) => {
            if (err) {
                console.error('Error al crear tabla ventas:', err.message);
                reject(err);
                return;
            }
            console.log('✓ Tabla ventas creada/verificada');
            
            // No crear usuario por defecto - el usuario se creará mediante registro
            resolve();
        });
    });
}


// Cerrar conexión cuando se cierra la aplicación
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error al cerrar la base de datos:', err.message);
        } else {
            console.log('✓ Conexión a la base de datos cerrada');
        }
        process.exit(0);
    });
});

module.exports = { db, initDatabase };

