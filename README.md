# Sistema de Gestión Web para Refaccionaria

Sistema completo de gestión desarrollado con Node.js, Express y SQLite para el manejo de inventario y ventas de una refaccionaria.

**Desarrollado por: Miguel**

---

## 📋 Requisitos del Sistema

### Stack Tecnológico
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js + Express
- **Base de datos**: SQLite

### Funcionalidades Implementadas

1. **Autenticación (Login)**
   - Formulario de login
   - Validación de credenciales con SQLite
   - Manejo de sesiones (express-session)
   - Redirección al dashboard al iniciar sesión

2. **Dashboard**
   - Pantalla de bienvenida con nombre del usuario
   - Menú de navegación hacia Inventario, Ventas y Cerrar sesión
   - Diseño responsivo y limpio

3. **Módulo de Inventario (CRUD Completo)**
   - ✅ Crear producto
   - ✅ Leer lista de productos (tabla)
   - ✅ Editar producto
   - ✅ Eliminar/desactivar producto
   - ✅ Buscador (por nombre, categoría o SKU)
   - ✅ Tabla ordenable (click en columnas)
   - Campos: Nombre, Categoría, Precio, Stock, Código/SKU, Descripción

4. **Módulo de Ventas**
   - ✅ Registrar una venta (elegir producto, cantidad, fecha)
   - ✅ Disminuir stock automáticamente
   - ✅ Historial de ventas con fecha, producto, cantidad, precio total

---

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm (incluido con Node.js)

### Pasos para ejecutar el proyecto

1. **Instalar dependencias**
   ```bash
   npm install
   ```

2. **Iniciar el servidor**
   ```bash
   npm start
   ```

   O para modo desarrollo con auto-recarga:
   ```bash
   npm run dev
   ```

3. **Acceder al sistema**
   - Abre tu navegador web
   - Ve a: `http://localhost:3000`
   - Serás redirigido automáticamente al login

### Primer uso

Al iniciar el sistema por primera vez, no habrá usuarios creados. El sistema te redirigirá automáticamente a la página de registro para crear tu primer usuario (que será el administrador).

1. Completa el formulario de registro con:
   - Nombre completo
   - Nombre de usuario
   - Contraseña (mínimo 6 caracteres)
   - Confirmación de contraseña

2. Una vez creado el usuario, serás redirigido automáticamente al dashboard.

> **Nota**: Solo se puede crear un usuario si no existen usuarios en el sistema. Una vez creado el primer usuario, el registro estará deshabilitado por seguridad.

---

## 📁 Estructura del Proyecto

```
sistema-gestion-refaccionaria/
│
├── backend/
│   ├── controllers/          # Controladores de lógica de negocio
│   │   ├── authController.js
│   │   ├── productoController.js
│   │   └── ventaController.js
│   ├── routes/               # Definición de rutas
│   │   ├── authRoutes.js
│   │   ├── productoRoutes.js
│   │   └── ventaRoutes.js
│   ├── models/               # Modelos de base de datos
│   │   ├── Usuario.js
│   │   ├── Producto.js
│   │   └── Venta.js
│   ├── database/             # Configuración de base de datos
│   │   ├── db.js
│   │   └── refaccionaria.db  # Base de datos SQLite (se crea automáticamente)
│   ├── middleware/           # Middlewares de Express
│   │   └── auth.js
│   └── server.js             # Servidor principal
│
├── frontend/
│   ├── css/
│   │   └── styles.css        # Estilos principales
│   ├── js/
│   │   ├── api.js            # Utilidades de API
│   │   ├── login.js
│   │   ├── dashboard.js
│   │   ├── inventario.js
│   │   └── ventas.js
│   ├── views/                # Páginas HTML (vistas)
│   │   ├── login.html
│   │   ├── dashboard.html
│   │   ├── inventario.html
│   │   └── ventas.html
│   ├── login.html            # Páginas principales (acceso directo)
│   ├── dashboard.html
│   ├── inventario.html
│   └── ventas.html
│
├── package.json              # Configuración del proyecto y dependencias
└── README.md                 # Este archivo
```

---

## 🔧 Características Técnicas

### Base de Datos
- SQLite con tablas: `usuarios`, `productos`, `ventas`
- Creación automática de tablas si no existen
- Foreign keys habilitadas
- Usuario por defecto creado automáticamente

### Backend
- Express.js con estructura MVC
- Sesiones con express-session
- Middleware de autenticación para rutas protegidas
- Manejo de errores centralizado
- Validación de datos en controladores

### Frontend
- JavaScript Vanilla (sin frameworks)
- Fetch API para comunicación con backend
- Diseño responsivo con CSS Grid y Flexbox
- Interfaz moderna y limpia
- Validaciones en cliente y servidor

---

## 🎯 Uso del Sistema

### 1. Primera vez / Crear Usuario
- Si es la primera vez que usas el sistema, serás redirigido automáticamente al registro
- Completa el formulario para crear tu cuenta de administrador
- Una vez creado, serás redirigido al dashboard

### 2. Iniciar Sesión
- Si ya tienes una cuenta, ingresa tus credenciales
- El sistema te redirigirá automáticamente al dashboard

### 3. Gestionar Inventario
- Ve a "Inventario" en el menú
- Crea nuevos productos con el botón "+ Nuevo Producto"
- Busca productos usando el buscador
- Ordena la tabla haciendo click en los encabezados de columna
- Edita o elimina productos con los botones correspondientes

### 4. Registrar Ventas
- Ve a "Ventas" en el menú
- Selecciona un producto del catálogo
- Ingresa la cantidad y fecha
- El stock se disminuye automáticamente al registrar la venta
- Consulta el historial de ventas en la tabla inferior

### 5. Cerrar Sesión
- Haz click en "Cerrar Sesión" en cualquier momento
- Serás redirigido al login

---

## 📝 API Endpoints

### Autenticación
- `GET /api/auth/check-users` - Verificar si hay usuarios en el sistema
- `POST /api/auth/register` - Registrar primer usuario (solo si no hay usuarios)
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos
- `GET /api/productos` - Listar productos (query: `?buscar=term&soloActivos=true`)
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar/desactivar producto

### Ventas
- `GET /api/ventas` - Listar todas las ventas
- `POST /api/ventas` - Registrar nueva venta

---

## 🔒 Seguridad

- Contraseñas hasheadas con bcryptjs
- Sesiones seguras con express-session
- Rutas protegidas con middleware de autenticación
- Validación de datos en cliente y servidor
- Sanitización de entradas

---

## 📌 Notas Importantes

1. **Base de datos**: La base de datos SQLite se crea automáticamente en `backend/database/refaccionaria.db` la primera vez que ejecutas el sistema.

2. **Primer usuario**: Al iniciar por primera vez, no habrá usuarios. Debes crear tu primer usuario desde la página de registro. Este será tu cuenta de administrador.

3. **Puerto**: El servidor corre en el puerto 3000 por defecto. Puedes cambiarlo modificando la variable `PORT` en `backend/server.js` o usando variables de entorno.

4. **Desarrollo**: El proyecto incluye nodemon para desarrollo. Usa `npm run dev` para auto-recarga del servidor.

5. **Seguridad del registro**: El registro de nuevos usuarios solo está disponible cuando no hay usuarios en el sistema. Esto asegura que solo se pueda crear el primer usuario (administrador).

---

## 👨‍💻 Información del Desarrollador

**Desarrollado por: Miguel**

El nombre del desarrollador aparece en cada módulo del sistema:
- Dashboard
- Inventario
- Ventas

---

## 📄 Licencia

Este proyecto fue desarrollado como proyecto final académico.

---

## 🐛 Solución de Problemas

### Error: "Cannot find module"
```bash
npm install
```

### Error al conectar con la base de datos
- Asegúrate de tener permisos de escritura en la carpeta `backend/database/`
- Verifica que SQLite3 se instaló correctamente: `npm install sqlite3`

### El puerto 3000 está en uso
- Cambia el puerto en `backend/server.js` o cierra la aplicación que está usando el puerto

---

¡Listo para usar! 🚀

