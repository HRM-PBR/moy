/**
 * Lógica de la página Dashboard
 * Creado por: Miguel
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Verificar autenticación
    const user = await checkAuth();
    if (!user) {
        window.location.href = '/login.html';
        return;
    }

    // Mostrar nombre del usuario
    document.getElementById('userName').textContent = user.nombre || user.usuario;

    // Manejar logout
    document.getElementById('logoutBtn').addEventListener('click', async (e) => {
        e.preventDefault();
        
        if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
            try {
                await apiRequest('/auth/logout', {
                    method: 'POST'
                });
                window.location.href = '/login.html';
            } catch (error) {
                console.error('Error al cerrar sesión:', error);
                // Redirigir de todas formas
                window.location.href = '/login.html';
            }
        }
    });
});

