// src/modules/pagos/pages/PagoCanceladoPage.js
import { router } from '../../../router.js';
import { getCurrentUser } from '../../auth/userService.js';

export function PagoCanceladoPage() {
    const page = document.createElement('div');
    page.className = 'container-fluid py-4';
    
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('pedidoId');
    const user = getCurrentUser();
    
    page.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card border-warning">
                    <div class="card-body text-center py-5">
                        <div class="text-warning mb-4" style="font-size: 4rem;">
                            <i class="bi bi-x-circle-fill"></i>
                        </div>
                        <h1 class="card-title text-warning">Pago Cancelado</h1>
                        <p class="card-text lead">El proceso de pago ha sido cancelado.</p>
                        
                        ${pedidoId ? `
                            <div class="alert alert-warning mt-4">
                                <strong>Pedido #${pedidoId}</strong><br>
                                Estado: <span class="badge bg-warning">Por Pagar</span>
                            </div>
                        ` : ''}
                        
                        <p class="text-muted mt-4">
                            No se ha realizado ningún cargo. Puedes intentar nuevamente cuando lo desees.
                        </p>
                        
                        <div class="mt-4">
                            <button class="btn btn-warning me-2" id="reintentarBtn">
                                <i class="bi bi-arrow-clockwise me-1"></i>
                                Reintentar Pago
                            </button>
                            <button class="btn btn-outline-secondary" id="volverHistorialBtn">
                                <i class="bi bi-arrow-left me-1"></i>
                                Volver al Historial
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners
    page.querySelector('#reintentarBtn').addEventListener('click', () => {
        if (pedidoId) {
            window.location.hash = `#/pago?pedidoId=${pedidoId}`;
        } else {
            router.navigate('/historial-pedidos');
        }
    });
    
    page.querySelector('#volverHistorialBtn').addEventListener('click', () => {
        window.location.hash = '#/historial-pedidos';
    });
    
    return page;
}