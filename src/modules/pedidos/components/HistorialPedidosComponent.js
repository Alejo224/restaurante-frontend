// src/modules/pedidos/components/HistorialPedidosComponent.js

export function renderPedidoCard(pedido, service) {
  const card = document.createElement("div");
  card.className = `card pedido-card mb-3 border-0 shadow-sm`;
  card.setAttribute('data-estado', pedido.estadoPedidoEnum);
  card.setAttribute('role', 'article');
  card.setAttribute('aria-labelledby', `pedido-title-${pedido.id}`);
  card.setAttribute('aria-describedby', `pedido-desc-${pedido.id}`);
  
  const estadoTexto = service.obtenerTextoEstado(pedido.estadoPedidoEnum);
  const tipoServicioTexto = service.obtenerTextoTipoServicio(pedido.tipoServicio);
  const totalFormateado = service.formatearMoneda(pedido.total);
  const fechaFormateada = service.formatearFecha(pedido.fechaPedido);
  
  card.innerHTML = `
    <div class="card-body">
      <!-- Header del Pedido -->
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h5 id="pedido-title-${pedido.id}" class="card-title mb-1">Pedido #${pedido.id}</h5>
          <span class="badge ${service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)}" 
                aria-label="Estado: ${estadoTexto}">
            ${estadoTexto}
          </span>
        </div>
        <div class="text-end">
          <div class="fw-bold text-primary" aria-label="Total: ${totalFormateado}">
            ${totalFormateado}
          </div>
          <small class="text-muted" aria-label="Fecha: ${fechaFormateada}">
            ${fechaFormateada}
          </small>
        </div>
      </div>

      <!-- Información del Servicio -->
      <div class="mb-2">
        <small class="text-muted">
          <i class="${service.obtenerIconoTipoServicio(pedido.tipoServicio)} me-1" aria-hidden="true"></i>
          ${tipoServicioTexto}
        </small>
      </div>

      <!-- Información Específica -->
      <div class="mb-3" id="pedido-desc-${pedido.id}">
        ${renderInfoEspecifica(pedido, service)}
      </div>

      <!-- Productos -->
      <div class="pedido-productos mb-3">
        <h6 class="fw-semibold">Productos (${pedido.detalles?.length || 0})</h6>
        ${renderListaProductos(pedido.detalles, service, pedido.id)}
      </div>

      <!-- Notas -->
      ${pedido.notas ? `
        <div class="alert alert-light border mb-3" role="note">
          <small class="fw-semibold">Notas:</small>
          <p class="mb-0 small">${pedido.notas}</p>
        </div>
      ` : ''}

      <!-- Botones -->
      <div class="d-flex gap-2" role="group" aria-label="Acciones para pedido ${pedido.id}">
        <button class="btn ${pedido.estadoPedidoEnum === 'BORRADOR' ? 'btn-primary' : 'btn-outline-primary'} btn-sm pagar-btn" 
                data-pedido-id="${pedido.id}"
                ${pedido.estadoPedidoEnum !== 'BORRADOR' ? 'disabled' : ''}
                aria-label="${pedido.estadoPedidoEnum === 'BORRADOR' ? `Pagar pedido ${pedido.id} por ${totalFormateado}` : 'Pedido ya pagado'}">
          <i class="bi bi-credit-card me-1" aria-hidden="true"></i>Pagar Pedido
        </button>
        <button class="btn btn-outline-secondary btn-sm detalle-btn" 
                data-pedido-id="${pedido.id}"
                aria-label="Ver detalles completos del pedido ${pedido.id}">
          <i class="bi bi-eye me-1" aria-hidden="true"></i>Ver Detalle
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
          <i class="bi bi-geo-alt me-1" aria-hidden="true"></i>
          ${pedido.direccionEntrega || 'Sin dirección especificada'}
        </small>
        <br>
        <small class="text-muted">
          <i class="bi bi-telephone me-1" aria-hidden="true"></i>
          ${pedido.telefonoContacto || 'Sin teléfono de contacto'}
        </small>
      </div>
    `;
  } else if (pedido.tipoServicio === 'RECOGER_PEDIDO') {
    return `
      <div class="info-recoger">
        <small class="text-muted">
          <i class="bi bi-clock me-1" aria-hidden="true"></i>
          Hora de recogida: ${pedido.horaRecogida ? service.formatearFecha(pedido.horaRecogida) : 'No especificada'}
        </small>
        <br>
        <small class="text-muted">
          <i class="bi bi-telephone me-1" aria-hidden="true"></i>
          ${pedido.telefonoContacto || 'Sin teléfono de contacto'}
        </small>
      </div>
    `;
  }
  return '<span class="visually-hidden">Sin información adicional</span>';
}

function renderListaProductos(detalles, service, pedidoId) {
  if (!detalles || !Array.isArray(detalles)) {
    return '<div class="text-muted">No hay productos en este pedido</div>';
  }

  return `
    <div class="productos-lista" role="list" aria-label="Productos del pedido ${pedidoId}">
      ${detalles.map((detalle, index) => {
        const subtotal = service.formatearMoneda(detalle.subtotal || 0);
        const precioUnitario = service.formatearMoneda(detalle.precioUnitario || 0);
        
        return `
          <div class="d-flex justify-content-between align-items-center py-1 border-bottom" 
               role="listitem"
               aria-label="${detalle.cantidad || 0} ${detalle.platoNombre || 'Producto'}, precio unitario ${precioUnitario}, subtotal ${subtotal}">
            <div>
              <span class="fw-medium">${detalle.cantidad || 0}x ${detalle.platoNombre || 'Producto'}</span>
              ${detalle.notas ? `
                <br>
                <small class="text-muted" aria-label="Notas: ${detalle.notas}">
                  ${detalle.notas}
                </small>
              ` : ''}
            </div>
            <span class="text-end">
              <div class="fw-medium" aria-label="Subtotal: ${subtotal}">
                ${subtotal}
              </div>
              <small class="text-muted" aria-label="Precio unitario: ${precioUnitario}">
                ${precioUnitario} c/u
              </small>
            </span>
          </div>
        `;
      }).join('')}
    </div>
  `;
}