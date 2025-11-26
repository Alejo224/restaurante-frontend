// public/pago-exitoso.js - Versión para página independiente
function volverAlHistorial() {
    // Redirigir al SPA en la ruta de historial
    window.location.href = `${window.location.origin}/restaurante-frontend/#/historial-pedidos`;
}

function irAlInicio() {
    // Redirigir al SPA en la ruta de inicio
    window.location.href = `${window.location.origin}/restaurante-frontend/#/`;
}

// Configurar event listeners cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    const btnVolverHistorial = document.getElementById('volverHistorialBtn');
    const btnInicio = document.getElementById('irInicioBtn');

    if (btnVolverHistorial) {
        btnVolverHistorial.addEventListener('click', volverAlHistorial);
    }

    if (btnInicio) {
        btnInicio.addEventListener('click', irAlInicio);
    }

    // Countdown para redirección automática
    let countdown = 5;
    const countdownElement = document.getElementById('countdown');
    
    if (countdownElement) {
        const countdownInterval = setInterval(() => {
            countdown--;
            countdownElement.textContent = countdown;
            
            if (countdown <= 0) {
                clearInterval(countdownInterval);
                irAlInicio();
            }
        }, 1000);
    }
});