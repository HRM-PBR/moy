/**
 * Lógica de la página de Inventario (CRUD completo)
 * Creado por: Miguel
 */

let productos = [];
let productosFiltrados = [];
let sortColumn = null;
let sortDirection = 'asc';

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const user = await checkAuth();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Cargar productos
    await cargarProductos();

    // Event listeners
    document.getElementById('btnNuevoProducto').addEventListener('click', () => {
        abrirModalNuevo();
    });

    document.getElementById('btnCerrarModal').addEventListener('click', cerrarModal);
    document.getElementById('btnCancelar').addEventListener('click', cerrarModal);

    document.getElementById('formProducto').addEventListener('submit', guardarProducto);

    document.getElementById('buscador').addEventListener('input', (e) => {
        filtrarProductos(e.target.value);
    });

    document.getElementById('btnLimpiarBusqueda').addEventListener('click', () => {
        document.getElementById('buscador').value = '';
        filtrarProductos('');
    });

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            try {
                await apiRequest('/auth/logout', { method: 'POST' });
                window.location.href = '/login.html';
            } catch (error) {
                window.location.href = '/login.html';
            }
        }
    });

    // Ordenamiento de columnas
    document.querySelectorAll('#tablaProductos th[data-sort]').forEach(th => {
        th.addEventListener('click', () => {
            const column = th.getAttribute('data-sort');
            ordenarTabla(column);
        });
    });
});

/**
 * Carga todos los productos desde la API
 */
async function cargarProductos() {
    try {
        const response = await apiRequest('/productos?soloActivos=false');
        productos = response.productos || [];
        productosFiltrados = [...productos];
        renderizarTabla();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showAlert('Error al cargar productos: ' + error.message, 'error');
    }
}

/**
 * Filtra productos según el término de búsqueda
 */
async function filtrarProductos(termino) {
    if (!termino.trim()) {
        productosFiltrados = [...productos];
        renderizarTabla();
        return;
    }

    try {
        const response = await apiRequest(`/productos?buscar=${encodeURIComponent(termino)}`);
        productosFiltrados = response.productos || [];
        renderizarTabla();
    } catch (error) {
        console.error('Error al buscar productos:', error);
        showAlert('Error al buscar productos', 'error');
    }
}

/**
 * Ordena la tabla por una columna
 */
function ordenarTabla(column) {
    if (sortColumn === column) {
        sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        sortColumn = column;
        sortDirection = 'asc';
    }

    productosFiltrados.sort((a, b) => {
        let aVal = a[column];
        let bVal = b[column];

        // Convertir a número si es precio o stock
        if (column === 'precio' || column === 'stock') {
            aVal = parseFloat(aVal);
            bVal = parseFloat(bVal);
        } else {
            // Comparación de strings
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
        }

        if (sortDirection === 'asc') {
            return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
            return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
    });

    // Actualizar iconos de ordenamiento
    document.querySelectorAll('#tablaProductos th').forEach(th => {
        const col = th.getAttribute('data-sort');
        if (col) {
            if (col === sortColumn) {
                th.textContent = th.textContent.replace(/ ↕| ↑| ↓/, '') + (sortDirection === 'asc' ? ' ↑' : ' ↓');
            } else {
                th.textContent = th.textContent.replace(/ ↕| ↑| ↓/, '') + ' ↕';
            }
        }
    });

    renderizarTabla();
}

/**
 * Renderiza la tabla de productos
 */
function renderizarTabla() {
    const tbody = document.getElementById('tbodyProductos');

    if (productosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No se encontraron productos</td></tr>';
        return;
    }

    tbody.innerHTML = productosFiltrados.map(producto => `
        <tr>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>${formatCurrency(producto.precio)}</td>
            <td>
                <span class="badge ${producto.stock > 0 ? 'badge-success' : 'badge-danger'}">
                    ${producto.stock}
                </span>
            </td>
            <td>${producto.codigo_sku}</td>
            <td>${producto.descripcion || '-'}</td>
            <td>
                <button class="btn btn-primary btn-small" onclick="editarProducto(${producto.id})">
                    Editar
                </button>
                <button class="btn btn-danger btn-small" onclick="eliminarProducto(${producto.id})">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

/**
 * Abre el modal para crear un nuevo producto
 */
function abrirModalNuevo() {
    document.getElementById('modalTitle').textContent = 'Nuevo Producto';
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('modalProducto').classList.add('active');
}

/**
 * Abre el modal para editar un producto
 */
async function editarProducto(id) {
    try {
        const response = await apiRequest(`/productos/${id}`);
        const producto = response.producto;

        document.getElementById('modalTitle').textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.id;
        document.getElementById('nombre').value = producto.nombre;
        document.getElementById('categoria').value = producto.categoria;
        document.getElementById('precio').value = producto.precio;
        document.getElementById('stock').value = producto.stock;
        document.getElementById('codigo_sku').value = producto.codigo_sku;
        document.getElementById('descripcion').value = producto.descripcion || '';

        document.getElementById('modalProducto').classList.add('active');
    } catch (error) {
        console.error('Error al cargar producto:', error);
        showAlert('Error al cargar el producto: ' + error.message, 'error');
    }
}

/**
 * Cierra el modal
 */
function cerrarModal() {
    document.getElementById('modalProducto').classList.remove('active');
}

/**
 * Guarda un producto (crear o actualizar)
 */
async function guardarProducto(e) {
    e.preventDefault();

    const productoId = document.getElementById('productoId').value;
    const productoData = {
        nombre: document.getElementById('nombre').value,
        categoria: document.getElementById('categoria').value,
        precio: parseFloat(document.getElementById('precio').value),
        stock: parseInt(document.getElementById('stock').value),
        codigo_sku: document.getElementById('codigo_sku').value,
        descripcion: document.getElementById('descripcion').value
    };

    const btnGuardar = document.getElementById('btnGuardar');
    btnGuardar.disabled = true;
    btnGuardar.innerHTML = '<span class="loading"></span> Guardando...';

    try {
        if (productoId) {
            // Actualizar producto existente
            await apiRequest(`/productos/${productoId}`, {
                method: 'PUT',
                body: JSON.stringify(productoData)
            });
            showAlert('Producto actualizado exitosamente', 'success');
        } else {
            // Crear nuevo producto
            await apiRequest('/productos', {
                method: 'POST',
                body: JSON.stringify(productoData)
            });
            showAlert('Producto creado exitosamente', 'success');
        }

        cerrarModal();
        await cargarProductos();
    } catch (error) {
        console.error('Error al guardar producto:', error);
        showAlert('Error al guardar producto: ' + error.message, 'error');
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = 'Guardar';
    }
}

/**
 * Elimina (desactiva) un producto
 */
async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        return;
    }

    try {
        await apiRequest(`/productos/${id}`, {
            method: 'DELETE'
        });
        showAlert('Producto eliminado exitosamente', 'success');
        await cargarProductos();
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        showAlert('Error al eliminar producto: ' + error.message, 'error');
    }
}

