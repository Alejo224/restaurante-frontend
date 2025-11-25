// src/modules/pagos/pages/PagoExitosoPage.js
export function PagoExitosoPage() {
    const page = document.createElement('div');
    page.className = 'container-fluid py-4';
    
    // Obtener el ID del pedido de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('pedidoId');
    
    page.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-8 col-lg-6">
                <!-- Skip link para navegación por teclado -->
                <a href="#main-content" class="visually-hidden-focusable position-absolute top-0 start-0 m-2">
                    Saltar al contenido principal
                </a>

                <div class="card border-success shadow-lg" role="alert" aria-live="polite" aria-atomic="true">
                    <div class="card-body text-center py-5">
                        <!-- Icono con descripción para screen readers -->
                        <div class="text-success mb-4" style="font-size: 4rem;" aria-hidden="true">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <span class="sr-only">Pago procesado exitosamente</span>

                        <!-- Título principal -->
                        <h1 id="page-title" class="card-title text-success mb-3 h2">
                            ¡Pago Exitoso!
                        </h1>

                        <!-- Descripción -->
                        <p class="card-text lead mb-4" id="page-description">
                            Tu pedido ha sido procesado correctamente.
                        </p>

                        <!-- Información del pedido -->
                        <div id="pedido-info" class="mb-4" aria-live="polite">
                            ${pedidoId ? `
                                <div class="alert alert-info" role="status">
                                    <h2 class="h6 mb-2">
                                        <i class="bi bi-receipt me-2" aria-hidden="true"></i>
                                        Detalles del Pedido
                                    </h2>
                                    <p class="mb-1"><strong>Número de pedido:</strong> #${pedidoId}</p>
                                    <p class="mb-0">
                                        <strong>Estado:</strong> 
                                        <span class="badge bg-success">
                                            Confirmado
                                            <span class="sr-only">estado del pedido: confirmado</span>
                                        </span>
                                    </p>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Información adicional -->
                        <div class="alert alert-success" role="status">
                            <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
                            <span>Recibirás un correo de confirmación con los detalles de tu pedido.</span>
                        </div>

                        <!-- Botones de acción -->
                        <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-4" role="group" aria-label="Opciones de navegación">
                            <button 
                                class="btn btn-primary flex-md-fill" 
                                id="volverHistorialBtn"
                                aria-label="Volver al historial de pedidos"
                            >
                                <i class="bi bi-arrow-left me-2" aria-hidden="true"></i>
                                Volver al Historial
                            </button>
                            
                            <button 
                                class="btn btn-outline-secondary flex-md-fill" 
                                id="irInicioBtn"
                                aria-label="Ir a la página de inicio"
                            >
                                <i class="bi bi-house me-2" aria-hidden="true"></i>
                                Ir al Inicio
                            </button>
                        </div>

                        <!-- Información de redirección automática -->
                        <div class="mt-4 text-center">
                            <small class="text-muted" id="countdown-info">
                                Serás redirigido automáticamente en <span id="countdown">5</span> segundos
                            </small>
                        </div>
                    </div>
                </div>

                <!-- Área de anuncios para screen readers -->
                <div id="aria-live-region" aria-live="polite" aria-atomic="true" class="sr-only"></div>
            </div>
        </div>
    `;

    // Configurar event listeners después de que el DOM esté montado
    setTimeout(() => {
        setupEventListeners(page, pedidoId);
        startCountdown(page);
    }, 0);

    return page;
}

// Función para anunciar a screen readers
function announceToScreenReader(message) {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
        liveRegion.textContent = message;
    }
}

// Configurar event listeners
function setupEventListeners(page, pedidoId) {
    const volverBtn = page.querySelector('#volverHistorialBtn');
    const inicioBtn = page.querySelector('#irInicioBtn');
    
    // Anunciar carga de página
    announceToScreenReader('Página de confirmación de pago exitoso cargada');
    
    if (pedidoId) {
        announceToScreenReader(`Pedido número ${pedidoId} confirmado exitosamente`);
    }

    // Funciones de navegación
    function volverAlHistorial() {
        announceToScreenReader('Navegando al historial de pedidos');
        window.location.hash = '#/historial-pedidos';
    }
    
    function irAlInicio() {
        announceToScreenReader('Navegando a la página de inicio');
        window.location.hash = '#/';
    }

    // Click events
    if (volverBtn) {
        volverBtn.addEventListener('click', volverAlHistorial);
        volverBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                volverAlHistorial();
            }
        });
    }
    
    if (inicioBtn) {
        inicioBtn.addEventListener('click', irAlInicio);
        inicioBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                irAlInicio();
            }
        });
    }

    // Enfocar el primer elemento interactivo
    setTimeout(() => {
        if (volverBtn) {
            volverBtn.focus();
        }
    }, 100);
}

// Contador para redirección automática
function startCountdown(page) {
    const countdownElement = page.querySelector('#countdown');
    const countdownInfo = page.querySelector('#countdown-info');
    
    if (!countdownElement || !countdownInfo) return;
    
    let seconds = 5;
    
    const countdownInterval = setInterval(() => {
        seconds--;
        countdownElement.textContent = seconds;
        
        // Anunciar cada segundo para screen readers
        if (seconds <= 3) {
            announceToScreenReader(`Redirección en ${seconds} segundos`);
        }
        
        if (seconds <= 0) {
            clearInterval(countdownInterval);
            countdownInfo.innerHTML = '<span class="sr-only">Redirigiendo automáticamente</span>';
            announceToScreenReader('Redirigiendo al historial de pedidos');
            window.location.hash = '#/historial-pedidos';
        }
    }, 1000);
}