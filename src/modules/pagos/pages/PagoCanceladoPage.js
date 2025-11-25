// src/modules/pagos/pages/PagoCanceladoPage.js
export function PagoCanceladoPage() {
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

                <div class="card border-warning shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
                    <div class="card-body text-center py-5">
                        <!-- Icono -->
                        <div class="text-warning mb-4" style="font-size: 4rem;" aria-hidden="true">
                            <i class="bi bi-x-circle-fill"></i>
                        </div>
                        <span class="sr-only">Pago cancelado</span>

                        <!-- Título principal -->
                        <h1 id="page-title" class="card-title text-warning mb-3 h2">
                            Pago Cancelado
                        </h1>

                        <!-- Descripción -->
                        <p class="card-text lead mb-4" id="page-description">
                            El proceso de pago ha sido cancelado.
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
                                        <span class="badge bg-warning text-dark">
                                            Por Pagar
                                            <span class="sr-only">estado del pedido: por pagar</span>
                                        </span>
                                    </p>
                                </div>
                            ` : ''}
                        </div>

                        <!-- Información adicional -->
                        <div class="alert alert-warning" role="status">
                            <i class="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
                            <span>No se ha realizado ningún cargo. Puedes intentar nuevamente cuando lo desees.</span>
                        </div>

                        <!-- Botones de acción -->
                        <div class="d-grid gap-2 d-md-flex justify-content-md-center mt-4" role="group" aria-label="Opciones después de cancelación">
                            <button 
                                class="btn btn-warning flex-md-fill" 
                                id="reintentarBtn"
                                aria-label="Reintentar el pago del pedido"
                            >
                                <i class="bi bi-arrow-clockwise me-2" aria-hidden="true"></i>
                                Reintentar Pago
                            </button>
                            
                            <button 
                                class="btn btn-outline-secondary flex-md-fill" 
                                id="volverHistorialBtn"
                                aria-label="Volver al historial de pedidos"
                            >
                                <i class="bi bi-arrow-left me-2" aria-hidden="true"></i>
                                Volver al Historial
                            </button>
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
    const reintentarBtn = page.querySelector('#reintentarBtn');
    const volverBtn = page.querySelector('#volverHistorialBtn');
    
    // Anunciar carga de página
    announceToScreenReader('Página de pago cancelado cargada');
    
    if (pedidoId) {
        announceToScreenReader(`Pedido número ${pedidoId} aún pendiente de pago`);
    }

    // Funciones de navegación
    function reintentarPago() {
        if (pedidoId) {
            announceToScreenReader(`Reintentando pago del pedido ${pedidoId}`);
            window.location.hash = `#/pago?pedidoId=${pedidoId}`;
        } else {
            announceToScreenReader('Navegando al historial de pedidos');
            window.location.hash = '#/historial-pedidos';
        }
    }
    
    function volverAlHistorial() {
        announceToScreenReader('Volviendo al historial de pedidos');
        window.location.hash = '#/historial-pedidos';
    }

    // Click events
    if (reintentarBtn) {
        reintentarBtn.addEventListener('click', reintentarPago);
        reintentarBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                reintentarPago();
            }
        });
    }
    
    if (volverBtn) {
        volverBtn.addEventListener('click', volverAlHistorial);
        volverBtn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                volverAlHistorial();
            }
        });
    }

    // Enfocar el primer botón para fácil navegación por teclado
    setTimeout(() => {
        if (reintentarBtn) {
            reintentarBtn.focus();
        }
    }, 100);
}