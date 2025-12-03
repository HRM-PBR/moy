/**
 * Lógica de la página de Registro
 * Creado por: Miguel
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si ya hay usuarios en el sistema
    try {
        const response = await apiRequest('/auth/check-users');
        if (response.hasUsers) {
            // Ya hay usuarios, redirigir al login
            window.location.href = '/login.html';
            return;
        }
    } catch (error) {
        console.error('Error al verificar usuarios:', error);
        showAlert('Error al verificar el estado del sistema', 'error');
    }

    // Verificar si ya está autenticado
    const user = await checkAuth();
    if (user) {
        window.location.href = '/dashboard.html';
        return;
    }

    const registerForm = document.getElementById('registerForm');
    const registerBtn = document.getElementById('registerBtn');
    const alertContainer = document.getElementById('alertContainer');

    // Función para mostrar alerta
    function showAlert(message, type = 'error') {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    // Manejar envío del formulario
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById('nombre').value.trim();
        const usuario = document.getElementById('usuario').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones
        if (!nombre || !usuario || !password || !confirmPassword) {
            showAlert('Por favor, completa todos los campos');
            return;
        }

        if (password.length < 6) {
            showAlert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (password !== confirmPassword) {
            showAlert('Las contraseñas no coinciden');
            return;
        }

        // Deshabilitar botón y mostrar loading
        registerBtn.disabled = true;
        registerBtn.innerHTML = '<span class="loading"></span> Creando cuenta...';

        try {
            const response = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ nombre, usuario, password })
            });

            if (response.success) {
                showAlert('Cuenta creada exitosamente. Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1500);
            }
        } catch (error) {
            showAlert(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
            registerBtn.disabled = false;
            registerBtn.textContent = 'Crear Cuenta';
        }
    });
});

