/**
 * Lógica de la página de Ventas
 * Creado por: Miguel
 */

let productos = [];
let productoSeleccionado = null;

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const user = await checkAuth();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Establecer fecha actual por defecto
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    document.getElementById('fecha').value = now.toISOString().slice(0, 16);

    // Cargar productos y ventas
    await cargarProductos();
    await cargarVentas();

    // Event listeners
    document.getElementById('producto_id').addEventListener('change', (e) => {
        seleccionarProducto(parseInt(e.target.value));
    });

    document.getElementById('cantidad').addEventListener('input', (e) => {
        calcularPrecioTotal();
    });

    document.getElementById('formVenta').addEventListener('submit', registrarVenta);

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
});

/**
 * Carga los productos disponibles (solo activos)
 */
async function cargarProductos() {
    try {
        const response = await apiRequest('/productos?soloActivos=true');
        productos = response.productos || [];

        const select = document.getElementById('producto_id');
        select.innerHTML = '<option value="">Selecciona un producto</option>';
        
        productos.forEach(producto => {
            const option = document.createElement('option');
            option.value = producto.id;
            option.textContent = `${producto.nombre} (SKU: ${producto.codigo_sku}) - Stock: ${producto.stock}`;
            option.dataset.precio = producto.precio;
            option.dataset.stock = producto.stock;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error al cargar productos:', error);
        showAlert('Error al cargar productos: ' + error.message, 'error');
    }
}

/**
 * Selecciona un producto y muestra su información
 */
function seleccionarProducto(productoId) {
    productoSeleccionado = productos.find(p => p.id === productoId);
    
    if (productoSeleccionado) {
        document.getElementById('precioUnitario').textContent = formatCurrency(productoSeleccionado.precio);
        document.getElementById('stockDisponible').textContent = productoSeleccionado.stock;
        document.getElementById('precioInfo').style.display = 'block';
        
        // Establecer cantidad máxima
        document.getElementById('cantidad').max = productoSeleccionado.stock;
        document.getElementById('cantidad').value = '';
        document.getElementById('precioTotal').textContent = formatCurrency(0);
    } else {
        document.getElementById('precioInfo').style.display = 'none';
        productoSeleccionado = null;
    }
}

/**
 * Calcula el precio total según la cantidad
 */
function calcularPrecioTotal() {
    if (!productoSeleccionado) return;

    const cantidad = parseInt(document.getElementById('cantidad').value) || 0;
    
    if (cantidad > productoSeleccionado.stock) {
        showAlert(`La cantidad excede el stock disponible (${productoSeleccionado.stock})`, 'error');
        document.getElementById('cantidad').value = productoSeleccionado.stock;
        cantidad = productoSeleccionado.stock;
    }

    const precioTotal = productoSeleccionado.precio * cantidad;
    document.getElementById('precioTotal').textContent = formatCurrency(precioTotal);
}

/**
 * Registra una nueva venta
 */
async function registrarVenta(e) {
    e.preventDefault();

    if (!productoSeleccionado) {
        showAlert('Por favor, selecciona un producto', 'error');
        return;
    }

    const productoId = parseInt(document.getElementById('producto_id').value);
    const cantidad = parseInt(document.getElementById('cantidad').value);
    const fecha = document.getElementById('fecha').value;

    if (cantidad <= 0) {
        showAlert('La cantidad debe ser mayor a 0', 'error');
        return;
    }

    if (cantidad > productoSeleccionado.stock) {
        showAlert(`La cantidad excede el stock disponible (${productoSeleccionado.stock})`, 'error');
        return;
    }

    const btnSubmit = e.target.querySelector('button[type="submit"]');
    btnSubmit.disabled = true;
    btnSubmit.innerHTML = '<span class="loading"></span> Registrando...';

    try {
        await apiRequest('/ventas', {
            method: 'POST',
            body: JSON.stringify({
                producto_id: productoId,
                cantidad: cantidad,
                fecha: new Date(fecha).toISOString()
            })
        });

        showAlert('Venta registrada exitosamente', 'success');
        
        // Limpiar formulario
        document.getElementById('formVenta').reset();
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('fecha').value = now.toISOString().slice(0, 16);
        document.getElementById('precioInfo').style.display = 'none';
        productoSeleccionado = null;

        // Recargar productos (para actualizar stock) y ventas
        await cargarProductos();
        await cargarVentas();
    } catch (error) {
        console.error('Error al registrar venta:', error);
        showAlert('Error al registrar venta: ' + error.message, 'error');
    } finally {
        btnSubmit.disabled = false;
        btnSubmit.textContent = 'Registrar Venta';
    }
}

/**
 * Carga el historial de ventas
 */
async function cargarVentas() {
    try {
        const response = await apiRequest('/ventas');
        const ventas = response.ventas || [];
        renderizarVentas(ventas);
    } catch (error) {
        console.error('Error al cargar ventas:', error);
        showAlert('Error al cargar ventas: ' + error.message, 'error');
    }
}

/**
 * Renderiza la tabla de ventas
 */
function renderizarVentas(ventas) {
    const tbody = document.getElementById('tbodyVentas');

    if (ventas.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay ventas registradas</td></tr>';
        return;
    }

    tbody.innerHTML = ventas.map(venta => `
        <tr>
            <td>${formatDate(venta.fecha)}</td>
            <td>${venta.producto_nombre}</td>
            <td>${venta.codigo_sku}</td>
            <td>${venta.cantidad}</td>
            <td>${formatCurrency(venta.precio_unitario)}</td>
            <td><strong>${formatCurrency(venta.precio_total)}</strong></td>
        </tr>
    `).join('');
}

