// src/modules/pedidos/components/TipoServicioPage.js
import { CarritoOffcanvas } from '../carrito/components/CarritoOffcanvas.js';
import { getToken, isAuthenticated } from '../auth/userService.js';

const API_BASE_URL = 'https://gestion-restaurante-api.onrender.com';

export function TipoServicioPage() {
  const page = document.createElement('div');
  page.setAttribute('role', 'main');
  page.setAttribute('aria-label', 'Selección de tipo de servicio');

  page.innerHTML = `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h2 class="h4 mb-0">
                <i class="bi bi-truck me-2"></i>
                Tipo de Servicio
              </h2>
            </div>
            
            <div class="card-body">
              <form id="form-tipo-servicio">
                <!-- Tipo de servicio -->
                <div class="mb-4">
                  <legend class="form-label fw-bold mb-3">Tipo de Servicio:</legend>
                  
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="tipoServicio" 
                           id="recoger-restaurante" value="RECOGER_PEDIDO">
                    <label class="form-check-label d-flex align-items-center" for="recoger-restaurante">
                      <i class="bi bi-shop me-2 fs-5 text-primary"></i>
                      Recoger en el Restaurante
                    </label>
                    <div class="form-text ms-4">
                      Retire su pedido directamente en nuestro local
                    </div>
                  </div>
                  
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" name="tipoServicio" 
                           id="entrega-domicilio" value="DOMICILIO">
                    <label class="form-check-label d-flex align-items-center" for="entrega-domicilio">
                      <i class="bi bi-truck me-2 fs-5 text-primary"></i>
                      Entrega a Domicilio
                    </label>
                    <div class="form-text ms-4">
                      Envío directo a la dirección que nos indique
                    </div>
                  </div>
                </div>

                <!-- Datos de contacto (solo para domicilio) -->
                <div id="datos-domicilio" style="display: none;">
                  <div class="mb-3">
                    <label for="direccion" class="form-label fw-bold">
                      Dirección de Entrega <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="direccion" 
                           placeholder="Ingrese la dirección de entrega" required>
                    <div class="form-text">
                      Calle, número, barrio, ciudad
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="telefono" class="form-label fw-bold">
                      Número de Teléfono <span class="text-danger">*</span>
                    </label>
                    <input type="tel" class="form-control" id="telefono" 
                           placeholder="Ingrese su número de contacto" required>
                    <div class="form-text">
                      Para coordinar la entrega
                    </div>
                  </div>
                </div>
                
                <!-- Botones -->
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" id="btn-volver">
                    <i class="bi bi-arrow-left me-1"></i>
                    Volver
                  </button>
                  <button type="submit" class="btn btn-primary" id="btn-confirmar">
                    <i class="bi bi-check-circle me-1"></i>
                    Confirmar y Ver Carrito
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mensajes de error/éxito -->
    <div id="mensaje-container" class="toast-container position-fixed top-0 end-0 p-3"></div>
  `;

  // Inicializar eventos
  setTimeout(() => {
    setupEventListeners();
  }, 100);

  function setupEventListeners() {
    // Radio buttons para mostrar/ocultar campos
    const recogerRadio = page.querySelector('#recoger-restaurante');
    const domicilioRadio = page.querySelector('#entrega-domicilio');
    const datosDomicilio = page.querySelector('#datos-domicilio');
    
    recogerRadio.addEventListener('change', () => {
      datosDomicilio.style.display = 'none';
      // Deshabilitar campos no requeridos
      page.querySelector('#direccion').required = false;
    });
    
    domicilioRadio.addEventListener('change', () => {
      datosDomicilio.style.display = 'block';
      // Habilitar campos requeridos
      page.querySelector('#direccion').required = true;
    });

    // Botón volver
    const btnVolver = page.querySelector('#btn-volver');
    btnVolver.addEventListener('click', () => {
      window.history.back();
    });

    // Formulario
    const form = page.querySelector('#form-tipo-servicio');
    form.addEventListener('submit', handleSubmit);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validar autenticación
    if (!isAuthenticated()) {
      mostrarMensaje('Debe iniciar sesión para realizar un pedido', 'error');
      return;
    }

    // Obtener datos del formulario
    const tipoServicio = page.querySelector('input[name="tipoServicio"]:checked');
    if (!tipoServicio) {
      mostrarMensaje('Por favor seleccione un tipo de servicio', 'error');
      return;
    }

    const datos = {
      tipoServicio: tipoServicio.value,
      fechaPedido: new Date().toISOString(),
      estadoPedidoEnum: 'BORRADOR'
    };

    // Si es domicilio, agregar datos adicionales
    if (tipoServicio.value === 'DOMICILIO') {
      const direccion = page.querySelector('#direccion').value.trim();
      const telefono = page.querySelector('#telefono').value.trim();
      
      if (!direccion || !telefono) {
        mostrarMensaje('Por favor complete todos los campos para entrega a domicilio', 'error');
        return;
      }
      
      datos.direccionEntrega = direccion;
      datos.telefonoContacto = telefono;
    }

    try {
      // Guardar datos temporalmente
      localStorage.setItem('pedidoPendiente', JSON.stringify(datos));
      
      // Abrir carrito
      abrirCarritoOffcanvas();
      
      mostrarMensaje('Datos guardados. Revise su carrito para continuar', 'success');
      
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('Error al procesar la solicitud', 'error');
    }
  }

  function abrirCarritoOffcanvas() {
    // Crear o mostrar carrito offcanvas
    let offcanvas = document.getElementById('carritoOffcanvas');
    if (!offcanvas) {
      const carrito = CarritoOffcanvas();
      document.body.appendChild(carrito);
      offcanvas = document.getElementById('carritoOffcanvas');
    }
    
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
  }

  function mostrarMensaje(texto, tipo) {
    const container = page.querySelector('#mensaje-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${tipo === 'error' ? 'danger' : 'success'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${texto}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    container.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }

  return page;
}