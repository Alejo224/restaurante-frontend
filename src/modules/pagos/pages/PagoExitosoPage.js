// src/modules/pagos/pages/PagoExitosoPage.js
import { router } from '../../../router.js';
import { getCurrentUser } from '../../auth/userService.js';

export function PagoExitosoPage() {
    const page = document.createElement('div');
    page.className = 'container-fluid py-4';
    
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get('pedidoId');
    const user = getCurrentUser();
    
    page.innerHTML = `
        <div class="row justify-content-center">
            <div class="col-md-6">
                <div class="card border-success">
                    <div class="card-body text-center py-5">
                        <div class="text-success mb-4" style="font-size: 4rem;">
                            <i class="bi bi-check-circle-fill"></i>
                        </div>
                        <h1 class="card-title text-success">¡Pago Exitoso!</h1>
                        <p class="card-text lead">Tu pedido ha sido procesado correctamente.</p>
                        
                        ${pedidoId ? `
                            <div class="alert alert-info mt-4">
                                <strong>Pedido #${pedidoId}</strong><br>
                                Estado: <span class="badge bg-success">Confirmado</span>
                            </div>
                        ` : ''}
                        
                        <p class="text-muted mt-4">
                            Recibirás un correo de confirmación con los detalles de tu pedido.
                        </p>
                        
                        <div class="mt-4">
                            <button class="btn btn-primary me-2" id="volverHistorialBtn">
                                <i class="bi bi-arrow-left me-1"></i>
                                Volver al Historial
                            </button>
                            <button class="btn btn-outline-secondary" id="irInicioBtn">
                                <i class="bi bi-house me-1"></i>
                                Ir al Inicio
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Event listeners
    page.querySelector('#volverHistorialBtn').addEventListener('click', () => {
        router.navigate('/historial-pedidos');
    });
    
    page.querySelector('#irInicioBtn').addEventListener('click', () => {
        window.location.hash = '#/';
    });
    
    return page;
}