// src/modules/pedidos/components/HistorialPedidosComponent.js

export function renderPedidoCard(pedido, service) {
  const card = document.createElement("div");
  card.className = `card pedido-admin-card mb-3 border-0 shadow-sm`;
  card.setAttribute('data-estado', pedido.estadoPedidoEnum);
  card.setAttribute('data-pedido-id', pedido.id);
  card.setAttribute('role', 'article');
  card.setAttribute('aria-labelledby', `pedido-admin-title-${pedido.id}`);
  card.setAttribute('aria-describedby', `pedido-admin-desc-${pedido.id}`);
  
  const estadoTexto = service.obtenerTextoEstado(pedido.estadoPedidoEnum);
  const tipoServicioTexto = service.obtenerTextoTipoServicio(pedido.tipoServicio);
  const totalFormateado = service.formatearMoneda(pedido.total);
  const fechaFormateada = service.formatearFecha(pedido.fechaPedido);
  const usuarioNombre = pedido.usuario?.nombreCompleto || pedido.usuario?.email || 'Usuario no disponible';
  
  card.innerHTML = `
    <div class="card-body">
      <!-- Header del Pedido con información de usuario -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 id="pedido-admin-title-${pedido.id}" class="card-title mb-1">
                Pedido #${pedido.id}
                <span class="badge ${service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)} ms-2" 
                      aria-label="Estado: ${estadoTexto}">
                  ${estadoTexto}
                </span>
              </h5>
            </div>
            <div class="text-end">
              <div class="fw-bold text-primary h5" aria-label="Total: ${totalFormateado}">
                ${totalFormateado}
              </div>
              <small class="text-muted" aria-label="Fecha: ${fechaFormateada}">
                ${fechaFormateada}
              </small>
            </div>
          </div>
        </div>
      </div>

      <!-- Información del Servicio y Contacto -->
      <div class="row mb-3" id="pedido-admin-desc-${pedido.id}">
        <div class="col-md-6">
          <div class="service-info">
            <small class="text-muted">
              <i class="${service.obtenerIconoTipoServicio(pedido.tipoServicio)} me-1" aria-hidden="true"></i>
              <strong>Tipo:</strong> ${tipoServicioTexto}
            </small>
          </div>
          ${renderInfoContacto(pedido, service)}
        </div>
        <div class="col-md-6">
          ${renderInfoFinanciera(pedido, service)}
        </div>
      </div>

      <!-- Productos Resumen -->
      <div class="pedido-productos-resumen mb-3">
        <h6 class="fw-semibold mb-2">
          <i class="bi bi-list-check me-1" aria-hidden="true"></i>
          Productos (${pedido.detalles?.length || 0})
        </h6>
        ${renderListaProductosResumen(pedido.detalles, service, pedido.id)}
      </div>

      <!-- Notas del Pedido -->
      ${pedido.notas ? `
        <div class="alert alert-light border mb-3" role="note">
          <small class="fw-semibold">
            <i class="bi bi-chat-text me-1" aria-hidden="true"></i>
            Notas del Pedido:
          </small>
          <p class="mb-0 small mt-1">${pedido.notas}</p>
        </div>
      ` : ''}

      <!-- Motivo de Cancelación -->
      ${pedido.estadoPedidoEnum === 'CANCELADO' ? `
        <div class="alert alert-danger border mb-3" role="note">
          <small class="fw-semibold">
            <i class="bi bi-x-circle me-1" aria-hidden="true"></i>
            Motivo de Cancelación:
          </small>
          <p class="mb-0 small mt-1">${pedido.motivoCancelacion || 'No especificado'}</p>
        </div>
      ` : ''}

      <!-- Botones de Acción -->
        <div class="d-flex gap-2">
          <!-- Botón Pagar - Solo para pedidos BORRADOR -->
          ${pedido.estadoPedidoEnum === 'BORRADOR' ? `
            <button class="btn btn-success btn-sm pagar-btn" 
                    data-pedido-id="${pedido.id}"
                    aria-label="Marcar pedido ${pedido.id} como pagado">
              <i class="bi bi-credit-card me-1" aria-hidden="true"></i>Pagar
            </button>
          ` : ''}
          
          <!-- Botón Cancelar - Solo para pedidos BORRADOR o PENDIENTE recientes -->
          ${pedido.estadoPedidoEnum === 'BORRADOR' || (pedido.estadoPedidoEnum === 'PENDIENTE' && esPedidoReciente(pedido.fechaPedido)) ? `
            <button class="btn btn-outline-danger btn-sm cancelar-btn" 
                    data-pedido-id="${pedido.id}"
                    aria-label="Cancelar pedido ${pedido.id}">
              <i class="bi bi-trash me-1" aria-hidden="true"></i>Cancelar
            </button>
          ` : ''}

           <!-- Botón Ver Detalle - Siempre visible -->
          <button class="btn btn-outline-primary btn-sm detalle-btn" 
                  data-pedido-id="${pedido.id}"
                  aria-label="Ver detalles completos del pedido ${pedido.id}">
            <i class="bi bi-eye me-1" aria-hidden="true"></i>Detalle
          </button>
                    
        </div>
      </div>
      </div>
    </div>
  `;
  
  return card;
}

function renderInfoContacto(pedido, service) {
  let contactoHTML = '';
  
  if (pedido.tipoServicio === 'DOMICILIO') {
    contactoHTML = `
      <div class="contacto-info mt-2">
        <small class="text-muted d-block">
          <i class="bi bi-geo-alt me-1" aria-hidden="true"></i>
          <strong>Dirección:</strong> ${pedido.direccionEntrega || 'No especificada'}
        </small>
        ${pedido.telefonoContacto ? `
          <small class="text-muted d-block">
            <i class="bi bi-telephone me-1" aria-hidden="true"></i>
            <strong>Teléfono:</strong> ${pedido.telefonoContacto}
          </small>
        ` : ''}
      </div>
    `;
  } else if (pedido.tipoServicio === 'RECOGER_PEDIDO') {
    contactoHTML = `
      <div class="contacto-info mt-2">
        <small class="text-muted d-block">
          <i class="bi bi-clock me-1" aria-hidden="true"></i>
          <strong>Recogida:</strong> ${pedido.horaRecogida ? service.formatearFecha(pedido.horaRecogida) : 'No especificada'}
        </small>
        ${pedido.telefonoContacto ? `
          <small class="text-muted d-block">
            <i class="bi bi-telephone me-1" aria-hidden="true"></i>
            <strong>Teléfono:</strong> ${pedido.telefonoContacto}
          </small>
        ` : ''}
      </div>
    `;
  } else {
    contactoHTML = `
      <div class="contacto-info mt-2">
        <small class="text-muted">
          <i class="bi bi-info-circle me-1" aria-hidden="true"></i>
          Sin información de contacto adicional
        </small>
      </div>
    `;
  }
  
  return contactoHTML;
}

function renderInfoFinanciera(pedido, service) {
  const subtotal = service.formatearMoneda(pedido.subtotal || 0);
  const iva = service.formatearMoneda(pedido.iva || 0);
  const total = service.formatearMoneda(pedido.total || 0);
  
  return `
    <div class="financiera-info" aria-label="Resumen financiero del pedido">
      <small class="text-muted d-block">
        <strong>Subtotal:</strong> ${subtotal}
      </small>
      <small class="text-muted d-block">
        <strong>IVA (19%):</strong> ${iva}
      </small>
      <small class="text-muted d-block">
        <strong>Total:</strong> ${total}
      </small>
    </div>
  `;
}

function renderListaProductosResumen(detalles, service, pedidoId) {
  if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
    return '<div class="text-muted small">No hay productos en este pedido</div>';
  }

  // Mostrar máximo 3 productos en el resumen
  const productosMostrar = detalles.slice(0, 3);
  const productosOcultos = detalles.length - 3;

  return `
    <div class="productos-resumen" role="list" aria-label="Resumen de productos del pedido ${pedidoId}">
      ${productosMostrar.map((detalle, index) => {
        const subtotal = service.formatearMoneda(detalle.subtotal || 0);
        const precioUnitario = service.formatearMoneda(detalle.precioUnitario || 0);
        
        return `
          <div class="d-flex justify-content-between align-items-center py-1 border-bottom" 
               role="listitem"
               aria-label="${detalle.cantidad || 0} ${detalle.platoNombre || 'Producto'}, subtotal ${subtotal}">
            <div class="flex-grow-1">
              <span class="fw-medium small">${detalle.cantidad || 0}x ${detalle.platoNombre || 'Producto'}</span>
            </div>
            <span class="text-end">
              <div class="fw-medium small">${subtotal}</div>
            </span>
          </div>
        `;
      }).join('')}
      
      ${productosOcultos > 0 ? `
        <div class="text-center mt-2">
          <small class="text-muted">
            +${productosOcultos} producto${productosOcultos > 1 ? 's' : ''} más
          </small>
        </div>
      ` : ''}
    </div>
  `;
}

// Función de respaldo si el servicio no tiene obtenerOpcionesEstado
function obtenerOpcionesEstadoDefault(estadoActual) {
  const estados = [
    { value: 'BORRADOR', text: 'Por Pagar' },
    { value: 'PENDIENTE', text: 'Pendiente' },
    { value: 'COMPLETADO', text: 'Completado' },
    { value: 'CANCELADO', text: 'Cancelado' }
  ];

  return estados.map(estado => 
    `<option value="${estado.value}" ${estado.value === estadoActual ? 'selected' : ''}>
      ${estado.text}
    </option>`
  ).join('');
}

function esPedidoReciente(fechaPedido) {
  if (!fechaPedido) return false;
  
  try {
    const fechaPedidoDate = new Date(fechaPedido);
    const ahora = new Date();
    const diferenciaHoras = (ahora - fechaPedidoDate) / (1000 * 60 * 60); // Diferencia en horas
    return diferenciaHoras < 2; // Menos de 2 horas (puedes ajustar este tiempo)
  } catch (error) {
    console.error('Error al verificar fecha del pedido:', error);
    return false;
  }
}

// Método para mostrar modal de detalle para cliente
export function mostrarModalDetalleCliente(pedido, service) {
  console.log('🔍 Mostrando modal para cliente - pedido:', pedido.id);
  
  // Remover modal existente
  const modalExistente = document.getElementById('detallePedidoClienteModal');
  if (modalExistente) {
    cerrarModalManual();
  }
  
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    z-index: 1040;
  `;
  
  // Crear modal para cliente
  const modal = document.createElement('div');
  modal.id = 'detallePedidoClienteModal';
  modal.className = 'modal-manual';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'detallePedidoClienteModalLabel');
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    z-index: 1050;
    width: 90%;
    max-width: 800px;
    max-height: 90vh;
    overflow: auto;
  `;
  
  // Generar contenido específico para cliente
  modal.innerHTML = generarContenidoModalCliente(pedido, service);
  
  // Agregar al DOM y configurar eventos
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  configurarEventosModalManual(modal, overlay);
  
  // Enfocar primer elemento
  setTimeout(() => {
    const firstFocusable = modal.querySelector('button');
    if (firstFocusable) firstFocusable.focus();
  }, 100);
  
  document.body.style.overflow = 'hidden';
}

// Generar contenido del modal para cliente
function generarContenidoModalCliente(pedido, service) {
  const estadoTexto = service.obtenerTextoEstado(pedido.estadoPedidoEnum);
  const tipoServicioTexto = service.obtenerTextoTipoServicio(pedido.tipoServicio);
  
  return `
    <!-- Header para Cliente -->
    <header class="modal-header" style="padding: 1rem; border-bottom: 1px solid #dee2e6; background: #28a745; color: white; border-radius: 8px 8px 0 0; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          <h2 id="detallePedidoClienteModalLabel" style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">
            <i class="bi bi-bag-check me-2" aria-hidden="true"></i>
            Tu Pedido #${pedido.id}
          </h2>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span class="badge" style="background: white; color: #28a745; padding: 0.25rem 0.5rem; border-radius: 4px;">
              ${estadoTexto}
            </span>
            <small>
              <i class="bi bi-calendar me-1" aria-hidden="true"></i>
              ${service.formatearFecha(pedido.fechaPedido)}
            </small>
          </div>
        </div>
      </div>
    </header>

    <!-- Body para Cliente -->
    <main class="modal-body" style="padding: 1.5rem;">
      
      <!-- Información del Pedido -->
      <section aria-labelledby="info-pedido-heading" style="margin-bottom: 1.5rem;">
        <h3 id="info-pedido-heading" style="font-size: 1.1rem; margin-bottom: 1rem;">
          <i class="bi bi-info-circle me-2 text-primary"></i>
          Información del Pedido
        </h3>
        <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
            <div>
              <p><strong>Estado:</strong> ${estadoTexto}</p>
              <p><strong>Tipo de entrega:</strong> ${tipoServicioTexto}</p>
            </div>
            <div>
              <p><strong>Fecha:</strong> ${service.formatearFecha(pedido.fechaPedido)}</p>
              ${pedido.horaRecogida ? `<p><strong>Hora recogida:</strong> ${service.formatearFecha(pedido.horaRecogida)}</p>` : ''}
            </div>
          </div>
        </div>
      </section>

      <!-- Información de Entrega -->
      ${renderInfoEntregaCliente(pedido, service)}

      <!-- Productos -->
      <section aria-labelledby="productos-heading" style="margin-bottom: 1.5rem;">
        <h3 id="productos-heading" style="font-size: 1.1rem; margin-bottom: 1rem;">
          <i class="bi bi-list-check me-2 text-success"></i>
          Tus Productos (${pedido.detalles?.length || 0})
        </h3>
        <div style="max-height: 300px; overflow-y: auto;">
          ${renderListaProductosCliente(pedido.detalles, service)}
        </div>
      </section>

      <!-- Resumen Financiero -->
      <section aria-labelledby="resumen-heading">
        <h3 id="resumen-heading" style="font-size: 1.1rem; margin-bottom: 1rem;">
          <i class="bi bi-calculator me-2 text-warning"></i>
          Resumen de Pago
        </h3>
        <div style="background: #fff3cd; padding: 1rem; border-radius: 6px;">
          <div style="display: grid; grid-template-columns: 1fr auto; gap: 0.5rem; align-items: center;">
            <span><strong>Subtotal:</strong></span>
            <span>${service.formatearMoneda(pedido.subtotal || 0)}</span>
            
            <span><strong>IVA (19%):</strong></span>
            <span>${service.formatearMoneda(pedido.iva || 0)}</span>
            
            <span style="border-top: 1px solid #dee2e6; padding-top: 0.5rem; font-size: 1.1rem;">
              <strong>Total:</strong>
            </span>
            <span style="border-top: 1px solid #dee2e6; padding-top: 0.5rem; font-size: 1.1rem; font-weight: bold; color: #28a745;">
              ${service.formatearMoneda(pedido.total || 0)}
            </span>
          </div>
        </div>
      </section>

      ${pedido.notas ? `
        <section aria-labelledby="notas-heading" style="margin-top: 1.5rem;">
          <h3 id="notas-heading" style="font-size: 1.1rem; margin-bottom: 0.5rem;">
            <i class="bi bi-chat-text me-2 text-info"></i>
            Notas de tu pedido
          </h3>
          <div style="background: #e7f3ff; padding: 1rem; border-radius: 6px; border-left: 4px solid #0d6efd;">
            <p style="margin: 0; font-style: italic;">${pedido.notas}</p>
          </div>
        </section>
      ` : ''}

    </main>

    <!-- Footer para Cliente -->
    <footer class="modal-footer" style="padding: 1rem; border-top: 1px solid #dee2e6; text-align: center;">
      <button type="button" class="btn-cerrar-manual" 
              style="padding: 0.75rem 2rem; background: #28a745; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 1rem;">
        <i class="bi bi-check-circle me-1"></i>
        Entendido
      </button>
    </footer>
  `;
}

//  Información de entrega para cliente
function renderInfoEntregaCliente(pedido, service) {
  if (pedido.tipoServicio === 'DOMICILIO') {
    return `
      <section aria-labelledby="domicilio-heading" style="margin-bottom: 1.5rem;">
        <h3 id="domicilio-heading" style="font-size: 1.1rem; margin-bottom: 1rem;">
          <i class="bi bi-truck me-2 text-success"></i>
          Información de Entrega
        </h3>
        <div style="background: #d1edff; padding: 1rem; border-radius: 6px;">
          <p><strong>📍 Dirección:</strong> ${pedido.direccionEntrega || 'Por confirmar'}</p>
          ${pedido.telefonoContacto ? `<p><strong>📞 Teléfono:</strong> ${pedido.telefonoContacto}</p>` : ''}
        </div>
      </section>
    `;
  } else if (pedido.tipoServicio === 'RECOGER_PEDIDO') {
    return `
      <section aria-labelledby="recogida-heading" style="margin-bottom: 1.5rem;">
        <h3 id="recogida-heading" style="font-size: 1.1rem; margin-bottom: 1rem;">
          <i class="bi bi-shop me-2 text-warning"></i>
          Información de Recogida
        </h3>
        <div style="background: #fff3cd; padding: 1rem; border-radius: 6px;">
          <p><strong>⏰ Hora de recogida:</strong> ${pedido.horaRecogida ? service.formatearFecha(pedido.horaRecogida) : 'Por confirmar'}</p>
          ${pedido.telefonoContacto ? `<p><strong>📞 Teléfono:</strong> ${pedido.telefonoContacto}</p>` : ''}
        </div>
      </section>
    `;
  }
  return '';
}

// Lista de productos para cliente
function renderListaProductosCliente(detalles, service) {
  if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
    return '<p style="color: #6c757d; text-align: center; padding: 2rem;">No hay productos en este pedido</p>';
  }

  return `
    <div role="list" style="border: 1px solid #e9ecef; border-radius: 6px;">
      ${detalles.map((detalle, index) => `
        <div role="listitem" 
             style="display: flex; justify-content: space-between; padding: 1rem; 
                    ${index < detalles.length - 1 ? 'border-bottom: 1px solid #e9ecef;' : ''}
                    background: ${index % 2 === 0 ? '#f8f9fa' : 'white'};">
          <div style="flex: 1;">
            <div style="font-weight: bold; margin-bottom: 0.25rem;">
              ${detalle.cantidad || 0}x ${detalle.platoNombre || 'Producto'}
            </div>
            ${detalle.notas ? `
              <div style="color: #6c757d; font-size: 0.9rem;">
                <i class="bi bi-chat-left-text me-1"></i>
                ${detalle.notas}
              </div>
            ` : ''}
          </div>
          <div style="text-align: right;">
            <div style="font-weight: bold; color: #28a745;">
              ${service.formatearMoneda(detalle.subtotal || 0)}
            </div>
            <div style="color: #6c757d; font-size: 0.85rem;">
              ${service.formatearMoneda(detalle.precioUnitario || 0)} c/u
            </div>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// Configurar eventos del modal
function configurarEventosModalManual(modal, overlay) {
  // Botón cerrar del header
  const btnCerrarHeader = modal.querySelector('.btn-close-manual');
  if (btnCerrarHeader) {
    btnCerrarHeader.addEventListener('click', () => {
      cerrarModalManual();
    });
  }
  
  // Botón cerrar del footer
  const btnCerrarFooter = modal.querySelector('.btn-cerrar-manual');
  if (btnCerrarFooter) {
    btnCerrarFooter.addEventListener('click', () => {
      cerrarModalManual();
    });
  }
  
  // Cerrar al hacer click en el overlay
  overlay.addEventListener('click', () => {
    cerrarModalManual();
  });
  
  // Cerrar con tecla ESC
  const keyHandler = (e) => {
    if (e.key === 'Escape') {
      cerrarModalManual();
      document.removeEventListener('keydown', keyHandler);
    }
  };
  document.addEventListener('keydown', keyHandler);
  
  // Guardar referencia para limpiar después
  window.modalActual = modal;
  window.overlayActual = overlay;
  window.keyHandlerActual = keyHandler;
}

// Cerrar modal manual
function cerrarModalManual() {
  if (window.modalActual) {
    window.modalActual.remove();
    window.modalActual = null;
  }
  if (window.overlayActual) {
    window.overlayActual.remove();
    window.overlayActual = null;
  }
  if (window.keyHandlerActual) {
    document.removeEventListener('keydown', window.keyHandlerActual);
    window.keyHandlerActual = null;
  }
  
  // Restaurar scroll del body
  document.body.style.overflow = '';
  
  console.log('✅ Modal cerrado correctamente');
}