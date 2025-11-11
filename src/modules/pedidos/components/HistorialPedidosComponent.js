// src/modules/pedidos/components/HistorialPedidosComponent.js

export function renderPedidoCard(pedido, service) {
  const card = document.createElement("div");
  card.className = `card pedido-card mb-3 border-0 shadow-sm`;
  card.setAttribute('data-estado', pedido.estadoPedidoEnum);
  
  card.innerHTML = `
    <div class="card-body">
      <!-- Header del Pedido -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 class="card-title mb-1">Pedido #${pedido.id}</h5>
          <span class="badge ${service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)}">
            ${service.obtenerTextoEstado(pedido.estadoPedidoEnum)}
          </span>
        </div>
        <div class="text-end">
          <div class="fw-bold text-primary">${service.formatearMoneda(pedido.total)}</div>
          <small class="text-muted">${service.formatearFecha(pedido.fechaPedido)}</small>
        </div>
      </div>

      <!-- Información del Servicio -->
      <div class="mb-2">
        <small class="text-muted">
          <i class="${service.obtenerIconoTipoServicio(pedido.tipoServicio)} me-1"></i>
          ${service.obtenerTextoTipoServicio(pedido.tipoServicio)}
        </small>
      </div>

      <!-- Información Específica -->
      <div class="mb-3">
        ${renderInfoEspecifica(pedido, service)}
      </div>

      <!-- Productos -->
      <div class="pedido-productos mb-3">
        <h6 class="fw-semibold">Productos (${pedido.detalles?.length || 0})</h6>
        ${renderListaProductos(pedido.detalles, service)}
      </div>

      <!-- Notas -->
      ${pedido.notas ? `
        <div class="alert alert-light border mb-3">
          <small class="fw-semibold">Notas:</small>
          <p class="mb-0 small">${pedido.notas}</p>
        </div>
      ` : ''}

      <!-- Botones -->
      <div class="d-flex gap-2">
        <button class="btn ${pedido.estadoPedidoEnum === 'BORRADOR' ? 'btn-primary' : 'btn-outline-primary'} btn-sm pagar-btn" 
                data-pedido-id="${pedido.id}"
                ${pedido.estadoPedidoEnum !== 'BORRADOR' ? 'disabled' : ''}>
          <i class="bi bi-credit-card me-1"></i>Pagar Pedido
        </button>
        <button class="btn btn-outline-secondary btn-sm detalle-btn" data-pedido-id="${pedido.id}">
          <i class="bi bi-eye me-1"></i>Ver Detalle
        </button>
      </div>
    </div>
  `;
  
  return card;
}

function renderInfoEspecifica(pedido, service) {
  if (pedido.tipoServicio === 'DOMICILIO') {
    return `
      <div class="info-domicilio">
        <small class="text-muted">
          <i class="bi bi-geo-alt me-1"></i>
          ${pedido.direccionEntrega || 'Sin dirección'}
        </small>
        <br>
        <small class="text-muted">
          <i class="bi bi-telephone me-1"></i>
          ${pedido.telefonoContacto || 'Sin teléfono'}
        </small>
      </div>
    `;
  } else if (pedido.tipoServicio === 'RECOGER_PEDIDO') {
    return `
      <div class="info-recoger">
        <small class="text-muted">
          <i class="bi bi-clock me-1"></i>
          Hora de recogida: ${pedido.horaRecogida ? service.formatearFecha(pedido.horaRecogida) : 'No especificada'}
        </small>
        <br>
        <small class="text-muted">
          <i class="bi bi-telephone me-1"></i>
          ${pedido.telefonoContacto || 'Sin teléfono'}
        </small>
      </div>
    `;
  }
  return '';
}

function renderListaProductos(detalles, service) {
  if (!detalles || !Array.isArray(detalles)) {
    return '<div class="text-muted">No hay productos</div>';
  }

  return detalles.map(detalle => `
    <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
      <div>
        <span class="fw-medium">${detalle.cantidad || 0}x ${detalle.platoNombre || 'Producto'}</span>
        ${detalle.notas ? `<br><small class="text-muted">${detalle.notas}</small>` : ''}
      </div>
      <span class="text-end">
        <div class="fw-medium">${service.formatearMoneda(detalle.subtotal || 0)}</div>
        <small class="text-muted">${service.formatearMoneda(detalle.precioUnitario || 0)} c/u</small>
      </span>
    </div>
  `).join('');
}