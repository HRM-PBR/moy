/**
 * Lógica de la página de Login
 * Creado por: Miguel
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar si ya está autenticado
    const user = await checkAuth();
    if (user) {
        window.location.href = '/dashboard.html';
        return;
    }

    // Verificar si hay usuarios en el sistema
    try {
        const response = await apiRequest('/auth/check-users');
        if (!response.hasUsers) {
            // No hay usuarios, redirigir al registro
            window.location.href = '/registro.html';
            return;
        }
    } catch (error) {
        console.error('Error al verificar usuarios:', error);
        // Continuar con el login aunque haya error
    }

    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const alertContainer = document.getElementById('alertContainer');

    // Función para mostrar alerta
    function showAlert(message, type = 'error') {
        alertContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        setTimeout(() => {
            alertContainer.innerHTML = '';
        }, 5000);
    }

    // Manejar envío del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const usuario = document.getElementById('usuario').value;
        const password = document.getElementById('password').value;

        // Validación básica
        if (!usuario || !password) {
            showAlert('Por favor, completa todos los campos');
            return;
        }

        // Deshabilitar botón y mostrar loading
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<span class="loading"></span> Iniciando sesión...';

        try {
            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ usuario, password })
            });

            if (response.success) {
                showAlert('Inicio de sesión exitoso. Redirigiendo...', 'success');
                setTimeout(() => {
                    window.location.href = '/dashboard.html';
                }, 1000);
            }
        } catch (error) {
            showAlert(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
            loginBtn.disabled = false;
            loginBtn.textContent = 'Iniciar Sesión';
        }
    });
});

