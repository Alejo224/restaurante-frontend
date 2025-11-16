// src/modules/admin/components/HistorialPedidosAdminComponent.js
import { createAdminPedidosService } from '../services/AdminPedidosService.js';

export class HistorialPedidosAdminComponent {
  constructor() {
    this.service = createAdminPedidosService();
    this.pedidos = [];
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.filtroEstado = 'todos';
  }

  async initialize() {
    await this.cargarPedidos();
    this.setupEventListeners();
  }

  async cargarPedidos() {
    try {
      const contenedor = document.getElementById('historial-pedidos-container');
      if (contenedor) {
        contenedor.innerHTML = `
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando pedidos...</span>
            </div>
            <p class="mt-2 text-muted">Cargando historial de pedidos...</p>
          </div>
        `;
      }

      this.pedidos = await this.service.obtenerTodosLosPedidos();
      this.render();
    } catch (error) {
      console.error('Error al cargar pedidos:', error);
      this.mostrarError('Error al cargar el historial de pedidos: ' + error.message);
    }
  }

  render() {
    const contenedor = document.getElementById('historial-pedidos-container');
    if (!contenedor) return;

    const pedidosFiltrados = this.filtrarPedidos();
    const pedidosPaginados = this.paginarPedidos(pedidosFiltrados);

    contenedor.innerHTML = this.generarHTML(pedidosFiltrados, pedidosPaginados);
    this.setupCardEventListeners();
  }

  filtrarPedidos() {
    if (this.filtroEstado === 'todos') {
      return this.pedidos;
    }
    return this.pedidos.filter(pedido => pedido.estadoPedidoEnum === this.filtroEstado);
  }

  paginarPedidos(pedidos) {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return pedidos.slice(startIndex, endIndex);
  }

  generarHTML(pedidosFiltrados, pedidosPaginados) {
    const contadores = this.service.obtenerContadores(this.pedidos);

    return `
      <div class="historial-pedidos-admin">
        <!-- Header y Filtros -->
        <div class="row mb-4">
          <div class="col-md-6">
            <h2 class="h4 mb-0">
              <i class="bi bi-clock-history me-2"></i>
              Historial de Pedidos - Admin
            </h2>
            <p class="text-muted mb-0">Gestiona todos los pedidos del sistema</p>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-2 justify-content-md-end">
              <div class="filter-group">
                <label for="filtro-estado" class="form-label visually-hidden">Filtrar por estado</label>
                <select id="filtro-estado" class="form-select">
                  <option value="todos" ${this.filtroEstado === 'todos' ? 'selected' : ''}>Todos los estados</option>
                  <option value="BORRADOR" ${this.filtroEstado === 'BORRADOR' ? 'selected' : ''}>Por Pagar</option>
                  <option value="PENDIENTE" ${this.filtroEstado === 'PENDIENTE' ? 'selected' : ''}>Pendiente</option>
                  <option value="COMPLETADO" ${this.filtroEstado === 'COMPLETADO' ? 'selected' : ''}>Completado</option>
                  <option value="CANCELADO" ${this.filtroEstado === 'CANCELADO' ? 'selected' : ''}>Cancelado</option>
                </select>
              </div>
              <button id="btn-actualizar" class="btn btn-outline-primary">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Estadísticas -->
        <div class="row mb-4">
          <div class="col-12">
            <div class="card bg-light">
              <div class="card-body py-3">
                <div class="row text-center">
                  <div class="col">
                    <span class="h5 text-primary">${contadores.all}</span>
                    <br>
                    <small class="text-muted">Total Pedidos</small>
                  </div>
                  <div class="col">
                    <span class="h5 text-warning">${contadores.borrador || 0}</span>
                    <br>
                    <small class="text-muted">Por Pagar</small>
                  </div>
                  <div class="col">
                    <span class="h5 text-info">${contadores.pendiente || 0}</span>
                    <br>
                    <small class="text-muted">Pendientes</small>
                  </div>
                  <div class="col">
                    <span class="h5 text-success">${contadores.completado || 0}</span>
                    <br>
                    <small class="text-muted">Completados</small>
                  </div>
                  <div class="col">
                    <span class="h5 text-danger">${contadores.cancelado || 0}</span>
                    <br>
                    <small class="text-muted">Cancelados</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Lista de Pedidos -->
        <div id="lista-pedidos">
          ${pedidosPaginados.length > 0 ? 
            pedidosPaginados.map(pedido => this.renderPedidoCard(pedido)).join('') :
            this.renderMensajeSinPedidos()
          }
        </div>

        <!-- Paginación -->
        ${this.renderPaginacion(pedidosFiltrados.length)}
      </div>
    `;
  }

  renderPedidoCard(pedido) {
    const cardElement = renderPedidoAdminCard(pedido, this.service);
    return cardElement.outerHTML;
  }

  renderMensajeSinPedidos() {
    return `
      <div class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <h3 class="h4 text-muted mt-3">No hay pedidos</h3>
        <p class="text-muted">No se encontraron pedidos con los filtros aplicados.</p>
      </div>
    `;
  }

  renderPaginacion(totalItems) {
    const totalPages = Math.ceil(totalItems / this.itemsPerPage);
    if (totalPages <= 1) return '';

    return `
      <nav aria-label="Paginación de pedidos">
        <ul class="pagination justify-content-center">
          <li class="page-item ${this.currentPage === 1 ? 'disabled' : ''}">
            <button class="page-link" data-page="${this.currentPage - 1}">Anterior</button>
          </li>
          
          ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
            <li class="page-item ${page === this.currentPage ? 'active' : ''}">
              <button class="page-link" data-page="${page}">${page}</button>
            </li>
          `).join('')}
          
          <li class="page-item ${this.currentPage === totalPages ? 'disabled' : ''}">
            <button class="page-link" data-page="${this.currentPage + 1}">Siguiente</button>
          </li>
        </ul>
      </nav>
    `;
  }

  setupEventListeners() {
    document.addEventListener('click', (e) => {
      // Filtro de estado
      if (e.target.id === 'filtro-estado') {
        this.filtroEstado = e.target.value;
        this.currentPage = 1;
        this.render();
      }

      // Botón actualizar
      if (e.target.id === 'btn-actualizar' || e.target.closest('#btn-actualizar')) {
        this.cargarPedidos();
      }

      // Paginación
      if (e.target.classList.contains('page-link')) {
        e.preventDefault();
        const page = parseInt(e.target.dataset.page);
        if (page && page !== this.currentPage) {
          this.currentPage = page;
          this.render();
        }
      }
    });
  }

  setupCardEventListeners() {
    // Selectores de estado
    document.querySelectorAll('.estado-select').forEach(select => {
      select.addEventListener('change', async (e) => {
        const pedidoId = e.target.dataset.pedidoId;
        const nuevoEstado = e.target.value;

        try {
          await this.service.actualizarEstadoPedido(pedidoId, nuevoEstado);
          this.mostrarMensaje('Estado actualizado correctamente', 'success');
          await this.cargarPedidos();
        } catch (error) {
          console.error('Error al actualizar estado:', error);
          this.mostrarMensaje('Error al actualizar el estado', 'error');
          e.target.value = e.target.dataset.originalValue;
        }
      });
      select.dataset.originalValue = select.value;
    });

    // Botón Pagar
    document.querySelectorAll('.pagar-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const pedidoId = e.target.closest('.pagar-btn').dataset.pedidoId;
        const pedido = this.pedidos.find(p => p.id == pedidoId);
        
        if (pedido && confirm(`¿Marcar el pedido #${pedidoId} como pagado por ${this.service.formatearMoneda(pedido.total)}?`)) {
          try {
            await this.service.marcarComoPagado(pedidoId);
            this.mostrarMensaje('Pedido marcado como pagado correctamente', 'success');
            await this.cargarPedidos();
          } catch (error) {
            console.error('Error al marcar como pagado:', error);
            this.mostrarMensaje('Error al marcar el pedido como pagado', 'error');
          }
        }
      });
    });

    // Botón Eliminar
    document.querySelectorAll('.eliminar-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const pedidoId = e.target.closest('.eliminar-btn').dataset.pedidoId;
        const pedido = this.pedidos.find(p => p.id == pedidoId);
        
        if (pedido) {
          let mensajeConfirmacion = `¿Estás seguro de eliminar el pedido #${pedidoId}?`;
          let mensajeAdvertencia = '';
          
          if (pedido.estadoPedidoEnum === 'PENDIENTE') {
            mensajeAdvertencia = '\n\n⚠️ Este pedido ya fue marcado como pagado. Solo elimínalo si es un error.';
          }
          
          if (confirm(mensajeConfirmacion + mensajeAdvertencia)) {
            try {
              await this.service.eliminarPedido(pedidoId);
              this.mostrarMensaje('Pedido eliminado correctamente', 'success');
              await this.cargarPedidos();
            } catch (error) {
              console.error('Error al eliminar pedido:', error);
              this.mostrarMensaje('Error al eliminar el pedido', 'error');
            }
          }
        }
      });
    });

    // Botón Ver Detalle 
    document.querySelectorAll('.detalle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pedidoId = e.target.closest('.detalle-btn').dataset.pedidoId;
        const pedido = this.pedidos.find(p => p.id == pedidoId);
        if (pedido) {
          this.mostrarModalDetalle(pedido);
        }
      });
    });

    // Botón Contacto    
    document.querySelectorAll('.contacto-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const telefono = e.target.closest('.contacto-btn').dataset.telefono;
        const pedidoId = e.target.closest('.contacto-btn').dataset.pedidoId;
        
        if (telefono) {
          const telefonoLimpio = telefono.replace(/\s+/g, '').replace(/[^\d+]/g, '');
          
          const quiereWhatsApp = confirm(
            `Contactar cliente del pedido #${pedidoId}\n\n` +
            `Teléfono: ${telefono}\n\n` +
            `¿Quieres enviar WhatsApp? (Aceptar)\n` +
            `¿O prefieres llamar? (Cancelar)`
          );
          
          if (quiereWhatsApp) {
            const mensaje = `Hola! Soy del restaurante. Te contacto por tu pedido #${pedidoId}. ¿En qué puedo ayudarte?`;
            window.open(`https://wa.me/${telefonoLimpio}?text=${encodeURIComponent(mensaje)}`, '_blank');
          } else {
            window.open(`tel:${telefonoLimpio}`, '_self');
          }
        } else {
          this.mostrarMensaje('No hay número de teléfono disponible para contactar', 'warning');
        }
      });
    });
  }

  generarModalDetalle(pedido) {
    const usuarioNombre = pedido.usuario?.nombreCompleto || pedido.usuario?.email || 'No disponible';
    const usuarioEmail = pedido.usuario?.email || 'No disponible';
    const estadoTexto = this.service.obtenerTextoEstado(pedido.estadoPedidoEnum);
    const tipoServicioTexto = this.service.obtenerTextoTipoServicio(pedido.tipoServicio);
    
    return `
      <div class="modal fade" id="detallePedidoAdminModal" tabindex="-1" 
          aria-labelledby="detallePedidoAdminModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <div>
                <h2 class="modal-title h5 mb-1" id="detallePedidoAdminModalLabel">
                  <i class="bi bi-receipt me-2" aria-hidden="true"></i>
                  Detalle Completo - Pedido #${pedido.id}
                </h2>
                <div class="d-flex align-items-center gap-3 mt-1">
                  <span class="badge ${this.service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)}">
                    ${estadoTexto}
                  </span>
                  <small class="text-white-50">
                    <i class="bi bi-calendar me-1" aria-hidden="true"></i>
                    ${this.service.formatearFecha(pedido.fechaPedido)}
                  </small>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" 
                      aria-label="Cerrar modal de detalle"></button>
            </div>

            <div class="modal-body p-4">
              <div class="row">
                <div class="col-lg-6">
                  <!-- Información del Cliente -->
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light bg-opacity-50">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-person-badge me-2 text-primary" aria-hidden="true"></i>
                        Información del Cliente
                      </h3>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Nombre:</strong>
                          <div class="fw-medium">${usuarioNombre}</div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Email:</strong>
                          <div class="fw-medium text-truncate">${usuarioEmail}</div>
                        </div>
                      </div>
                      ${pedido.telefonoContacto ? `
                        <div class="row">
                          <div class="col-12">
                            <strong class="text-muted small">Teléfono:</strong>
                            <div class="fw-medium">${pedido.telefonoContacto}</div>
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Información del Pedido -->
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light bg-opacity-50">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-info-circle me-2 text-info" aria-hidden="true"></i>
                        Información del Pedido
                      </h3>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Número:</strong>
                          <div class="fw-medium text-primary">#${pedido.id}</div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Estado:</strong>
                          <div>
                            <span class="badge ${this.service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)}">
                              ${estadoTexto}
                            </span>
                          </div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Tipo de Servicio:</strong>
                          <div class="fw-medium">
                            <i class="${this.service.obtenerIconoTipoServicio(pedido.tipoServicio)} me-1" aria-hidden="true"></i>
                            ${tipoServicioTexto}
                          </div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Fecha:</strong>
                          <div class="fw-medium">${this.service.formatearFecha(pedido.fechaPedido)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <!-- Lista de Productos -->
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-list-check me-2 text-success" aria-hidden="true"></i>
                        Productos (${pedido.detalles?.length || 0})
                      </h3>
                      <span class="badge bg-primary">${pedido.detalles?.length || 0} items</span>
                    </div>
                    <div class="card-body p-0">
                      ${this.renderListaProductosCompleta(pedido.detalles)}
                    </div>
                  </div>

                  <!-- Resumen Financiero -->
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-light bg-opacity-50">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-calculator me-2 text-warning" aria-hidden="true"></i>
                        Resumen Financiero
                      </h3>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-8">
                          <strong>Subtotal:</strong>
                        </div>
                        <div class="col-4 text-end">
                          ${this.service.formatearMoneda(pedido.subtotal || 0)}
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-8">
                          <strong>IVA (19%):</strong>
                        </div>
                        <div class="col-4 text-end">
                          ${this.service.formatearMoneda(pedido.iva || 0)}
                        </div>
                      </div>
                      <hr>
                      <div class="row mt-2">
                        <div class="col-8">
                          <strong class="h6">Total:</strong>
                        </div>
                        <div class="col-4 text-end">
                          <strong class="h6 text-primary">${this.service.formatearMoneda(pedido.total || 0)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="bi bi-x-circle me-1" aria-hidden="true"></i>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  mostrarModalDetalle(pedido) {
  console.log('🔍 Mostrando modal para pedido:', pedido.id);
  
  // Remover modal existente
  const modalExistente = document.getElementById('detallePedidoAdminModal');
  if (modalExistente) {
    this.cerrarModalManual();
  }
  
  // Crear overlay de fondo
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
  
  // Crear modal con HTML5 semántico y ARIA correcto
  const modal = document.createElement('div');
  modal.id = 'detallePedidoAdminModal';
  modal.className = 'modal-manual';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'detallePedidoAdminModalLabel');
  modal.setAttribute('aria-describedby', 'detallePedidoAdminModalDesc');
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
    max-width: 1200px;
    max-height: 90vh;
    overflow: auto;
  `;
  
  // Generar contenido del modal
  modal.innerHTML = this.generarContenidoModalAccesible(pedido);
  
  // Agregar al DOM
  document.body.appendChild(overlay);
  document.body.appendChild(modal);
  
  // Configurar eventos
  this.configurarEventosModalManual(modal, overlay);
  
  // Enfocar el primer elemento interactivo para accesibilidad
  setTimeout(() => {
    const firstFocusable = modal.querySelector('button');
    if (firstFocusable) firstFocusable.focus();
  }, 100);
  
  // Prevenir scroll del body
  document.body.style.overflow = 'hidden';
  
  console.log('✅ Modal manual mostrado correctamente');
}

  generarContenidoModalAccesible(pedido) {
    const usuarioNombre = pedido.usuario?.nombreCompleto || pedido.usuario?.email || 'No disponible';
    const estadoTexto = this.service.obtenerTextoEstado(pedido.estadoPedidoEnum);
    const tipoServicioTexto = this.service.obtenerTextoTipoServicio(pedido.tipoServicio);
    
    return `
      <!-- Header del Modal -->
      <header class="modal-header" style="padding: 1rem; border-bottom: 1px solid #dee2e6; background: #0d6efd; color: white; border-radius: 8px 8px 0 0; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: flex-start;">
        <div style="flex: 1;">
          <h2 id="detallePedidoAdminModalLabel" style="margin: 0 0 0.5rem 0; font-size: 1.25rem;">
            <i class="bi bi-receipt me-2" aria-hidden="true"></i>
            Detalle Completo - Pedido #${pedido.id}
          </h2>
          <div style="display: flex; align-items: center; gap: 1rem;">
            <span class="badge" style="background: white; color: #0d6efd; padding: 0.25rem 0.5rem; border-radius: 4px;">
              ${estadoTexto}
            </span>
            <small>
              <i class="bi bi-calendar me-1" aria-hidden="true"></i>
              ${this.service.formatearFecha(pedido.fechaPedido)}
            </small>
          </div>
        </div>
      </div>
    </header>

      <!-- Descripción para screen readers -->
      <div id="detallePedidoAdminModalDesc" class="visually-hidden">
        Detalle completo del pedido número ${pedido.id} del cliente ${usuarioNombre} 
        con estado ${estadoTexto} y tipo de servicio ${tipoServicioTexto}
      </div>

      <!-- Body del Modal -->
      <main class="modal-body" style="padding: 1.5rem; max-height: 60vh; overflow-y: auto;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
          
          <!-- Columna Izquierda -->
          <section aria-labelledby="info-cliente-heading">
            <h3 id="info-cliente-heading" style="font-size: 1.1rem; margin-bottom: 1rem;">
              <i class="bi bi-person-badge me-2 text-primary"></i>
              Información del Cliente
            </h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
              <p><strong>Nombre:</strong> ${usuarioNombre}</p>
              <p><strong>Email:</strong> ${pedido.usuario?.email || 'No disponible'}</p>
              ${pedido.telefonoContacto ? `<p><strong>Teléfono:</strong> ${pedido.telefonoContacto}</p>` : ''}
            </div>

            <h3 style="font-size: 1.1rem; margin: 1.5rem 0 1rem 0;">
              <i class="bi bi-info-circle me-2 text-info"></i>
              Información del Pedido
            </h3>
            <div style="background: #f8f9fa; padding: 1rem; border-radius: 6px;">
              <p><strong>Número:</strong> <span style="color: #0d6efd;">#${pedido.id}</span></p>
              <p><strong>Estado:</strong> ${estadoTexto}</p>
              <p><strong>Tipo:</strong> ${tipoServicioTexto}</p>
              <p><strong>Fecha:</strong> ${this.service.formatearFecha(pedido.fechaPedido)}</p>
            </div>
          </section>

          <!-- Columna Derecha -->
          <section aria-labelledby="productos-heading">
            <h3 id="productos-heading" style="font-size: 1.1rem; margin-bottom: 1rem;">
              <i class="bi bi-list-check me-2 text-success"></i>
              Productos (${pedido.detalles?.length || 0})
            </h3>
            <div style="max-height: 200px; overflow-y: auto;">
              ${this.renderListaProductosSimple(pedido.detalles)}
            </div>

            <h3 style="font-size: 1.1rem; margin: 1.5rem 0 1rem 0;">
              <i class="bi bi-calculator me-2 text-warning"></i>
              Resumen Financiero
            </h3>
            <div style="background: #fff3cd; padding: 1rem; border-radius: 6px;">
              <p><strong>Subtotal:</strong> ${this.service.formatearMoneda(pedido.subtotal || 0)}</p>
              <p><strong>IVA (19%):</strong> ${this.service.formatearMoneda(pedido.iva || 0)}</p>
              <p style="font-weight: bold; font-size: 1.1rem; color: #0d6efd;">
                <strong>Total:</strong> ${this.service.formatearMoneda(pedido.total || 0)}
              </p>
            </div>
          </section>
        </div>
      </main>

      <!-- Footer del Modal -->
      <footer class="modal-footer" style="padding: 1rem; border-top: 1px solid #dee2e6; text-align: right;">
        <button type="button" class="btn-cerrar-manual" 
                style="padding: 0.5rem 1rem; background: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer;">
          <i class="bi bi-x-circle me-1"></i>
          Cerrar
        </button>
      </footer>
    `;
  }

  renderListaProductosSimple(detalles) {
    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return '<p style="color: #6c757d; text-align: center;">No hay productos en este pedido</p>';
    }

    return `
      <div role="list">
        ${detalles.map((detalle, index) => `
          <div role="listitem" style="display: flex; justify-content: between; padding: 0.5rem 0; border-bottom: 1px solid #e9ecef;">
            <div style="flex: 1;">
              <strong>${detalle.cantidad || 0}x ${detalle.platoNombre || 'Producto'}</strong>
              ${detalle.notas ? `<br><small style="color: #6c757d;">${detalle.notas}</small>` : ''}
            </div>
            <div style="text-align: right;">
              <strong>${this.service.formatearMoneda(detalle.subtotal || 0)}</strong>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  configurarEventosModalManual(modal, overlay) {
    // Botón cerrar del header
    const btnCerrarHeader = modal.querySelector('.btn-close-manual');
    if (btnCerrarHeader) {
      btnCerrarHeader.addEventListener('click', () => {
        this.cerrarModalManual();
      });
    }
    
    // Botón cerrar del footer
    const btnCerrarFooter = modal.querySelector('.btn-cerrar-manual');
    if (btnCerrarFooter) {
      btnCerrarFooter.addEventListener('click', () => {
        this.cerrarModalManual();
      });
    }
    
    // Cerrar al hacer click en el overlay
    overlay.addEventListener('click', () => {
      this.cerrarModalManual();
    });
    
    // Cerrar con tecla ESC
    const keyHandler = (e) => {
      if (e.key === 'Escape') {
        this.cerrarModalManual();
        document.removeEventListener('keydown', keyHandler);
      }
    };
    document.addEventListener('keydown', keyHandler);
    
    // Guardar referencia para limpiar después
    this.modalActual = modal;
    this.overlayActual = overlay;
    this.keyHandlerActual = keyHandler;
  }

  cerrarModalManual() {
    if (this.modalActual) {
      this.modalActual.remove();
      this.modalActual = null;
    }
    if (this.overlayActual) {
      this.overlayActual.remove();
      this.overlayActual = null;
    }
    if (this.keyHandlerActual) {
      document.removeEventListener('keydown', this.keyHandlerActual);
      this.keyHandlerActual = null;
    }
    
    // Restaurar scroll del body
    document.body.style.overflow = '';
    
    console.log('✅ Modal cerrado correctamente');
  }

  renderModalDetalleAdmin(pedido) {
    const usuarioNombre = pedido.usuario?.nombreCompleto || pedido.usuario?.email || 'No disponible';
    const usuarioEmail = pedido.usuario?.email || 'No disponible';
    const estadoTexto = this.service.obtenerTextoEstado(pedido.estadoPedidoEnum);
    const tipoServicioTexto = this.service.obtenerTextoTipoServicio(pedido.tipoServicio);
    
    return `
      <div class="modal fade" id="detallePedidoAdminModal" tabindex="-1" 
          aria-labelledby="detallePedidoAdminModalLabel" aria-hidden="true" data-bs-backdrop="static">
        <div class="modal-dialog modal-xl modal-dialog-scrollable">
          <div class="modal-content">
            <div class="modal-header bg-primary text-white">
              <div>
                <h2 class="modal-title h5 mb-1" id="detallePedidoAdminModalLabel">
                  <i class="bi bi-receipt me-2" aria-hidden="true"></i>
                  Detalle Completo - Pedido #${pedido.id}
                </h2>
                <div class="d-flex align-items-center gap-3 mt-1">
                  <span class="badge ${this.service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)}">
                    ${estadoTexto}
                  </span>
                  <small class="text-white-50">
                    <i class="bi bi-calendar me-1" aria-hidden="true"></i>
                    ${this.service.formatearFecha(pedido.fechaPedido)}
                  </small>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" 
                      aria-label="Cerrar modal de detalle"></button>
            </div>

            <div class="modal-body p-4">
              <div class="row">
                <div class="col-lg-6">
                  <!-- Información del Cliente -->
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light bg-opacity-50">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-person-badge me-2 text-primary" aria-hidden="true"></i>
                        Información del Cliente
                      </h3>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Nombre:</strong>
                          <div class="fw-medium">${usuarioNombre}</div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Email:</strong>
                          <div class="fw-medium text-truncate">${usuarioEmail}</div>
                        </div>
                      </div>
                      ${pedido.telefonoContacto ? `
                        <div class="row">
                          <div class="col-12">
                            <strong class="text-muted small">Teléfono:</strong>
                            <div class="fw-medium">${pedido.telefonoContacto}</div>
                          </div>
                        </div>
                      ` : ''}
                    </div>
                  </div>

                  <!-- Información del Pedido -->
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light bg-opacity-50">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-info-circle me-2 text-info" aria-hidden="true"></i>
                        Información del Pedido
                      </h3>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Número:</strong>
                          <div class="fw-medium text-primary">#${pedido.id}</div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Estado:</strong>
                          <div>
                            <span class="badge ${this.service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)}">
                              ${estadoTexto}
                            </span>
                          </div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Tipo de Servicio:</strong>
                          <div class="fw-medium">
                            <i class="${this.service.obtenerIconoTipoServicio(pedido.tipoServicio)} me-1" aria-hidden="true"></i>
                            ${tipoServicioTexto}
                          </div>
                        </div>
                        <div class="col-6 mb-2">
                          <strong class="text-muted small">Fecha:</strong>
                          <div class="fw-medium">${this.service.formatearFecha(pedido.fechaPedido)}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="col-lg-6">
                  <!-- Lista de Productos -->
                  <div class="card border-0 shadow-sm mb-4">
                    <div class="card-header bg-light bg-opacity-50 d-flex justify-content-between align-items-center">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-list-check me-2 text-success" aria-hidden="true"></i>
                        Productos (${pedido.detalles?.length || 0})
                      </h3>
                      <span class="badge bg-primary">${pedido.detalles?.length || 0} items</span>
                    </div>
                    <div class="card-body p-0">
                      ${this.renderListaProductosCompleta(pedido.detalles)}
                    </div>
                  </div>

                  <!-- Resumen Financiero -->
                  <div class="card border-0 shadow-sm">
                    <div class="card-header bg-light bg-opacity-50">
                      <h3 class="h6 mb-0">
                        <i class="bi bi-calculator me-2 text-warning" aria-hidden="true"></i>
                        Resumen Financiero
                      </h3>
                    </div>
                    <div class="card-body">
                      <div class="row">
                        <div class="col-8">
                          <strong>Subtotal:</strong>
                        </div>
                        <div class="col-4 text-end">
                          ${this.service.formatearMoneda(pedido.subtotal || 0)}
                        </div>
                      </div>
                      <div class="row mt-2">
                        <div class="col-8">
                          <strong>IVA (19%):</strong>
                        </div>
                        <div class="col-4 text-end">
                          ${this.service.formatearMoneda(pedido.iva || 0)}
                        </div>
                      </div>
                      <hr>
                      <div class="row mt-2">
                        <div class="col-8">
                          <strong class="h6">Total:</strong>
                        </div>
                        <div class="col-4 text-end">
                          <strong class="h6 text-primary">${this.service.formatearMoneda(pedido.total || 0)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">
                <i class="bi bi-x-circle me-1" aria-hidden="true"></i>
                Cerrar
            </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  renderListaProductosCompleta(detalles) {
    if (!detalles || !Array.isArray(detalles) || detalles.length === 0) {
      return `
        <div class="text-center py-4 text-muted">
          <i class="bi bi-inbox display-4 opacity-25"></i>
          <p class="mt-2 mb-0">No hay productos en este pedido</p>
        </div>
      `;
    }

    return `
      <div class="table-responsive">
        <table class="table table-hover mb-0">
          <thead class="table-light">
            <tr>
              <th scope="col" class="ps-4">Producto</th>
              <th scope="col" class="text-center">Cantidad</th>
              <th scope="col" class="text-end pe-4">Precio Unitario</th>
              <th scope="col" class="text-end pe-4">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${detalles.map((detalle, index) => {
              const subtotal = this.service.formatearMoneda(detalle.subtotal || 0);
              const precioUnitario = this.service.formatearMoneda(detalle.precioUnitario || 0);
              
              return `
                <tr>
                  <td class="ps-4">
                    <div class="fw-medium">${detalle.platoNombre || 'Producto'}</div>
                    ${detalle.notas ? `
                      <small class="text-muted d-block mt-1">
                        <i class="bi bi-chat-left-text me-1" aria-hidden="true"></i>
                        ${detalle.notas}
                      </small>
                    ` : ''}
                  </td>
                  <td class="text-center">
                    <span class="badge bg-secondary">${detalle.cantidad || 0}</span>
                  </td>
                  <td class="text-end pe-4">${precioUnitario}</td>
                  <td class="text-end pe-4 fw-medium">${subtotal}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  mostrarMensaje(mensaje, tipo = 'info') {
    const alertClass = {
      'success': 'alert-success',
      'error': 'alert-danger',
      'info': 'alert-info',
      'warning': 'alert-warning'
    }[tipo] || 'alert-info';

    const alertHTML = `
      <div class="alert ${alertClass} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;

    const contenedor = document.getElementById('historial-pedidos-container');
    if (contenedor) {
      contenedor.insertAdjacentHTML('afterbegin', alertHTML);
      
      setTimeout(() => {
        const alert = contenedor.querySelector('.alert');
        if (alert) {
          alert.remove();
        }
      }, 5000);
    }
  }

  mostrarError(mensaje) {
    const contenedor = document.getElementById('historial-pedidos-container');
    if (contenedor) {
      contenedor.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          ${mensaje}
          <button class="btn btn-sm btn-outline-danger ms-2" onclick="location.reload()">
            Reintentar
          </button>
        </div>
      `;
    }
  }
}

// Función auxiliar para determinar pedidos recientes
function esPedidoReciente(fechaPedido) {
  if (!fechaPedido) return false;
  
  try {
    const fechaPedidoDate = new Date(fechaPedido);
    const ahora = new Date();
    const diferenciaHoras = (ahora - fechaPedidoDate) / (1000 * 60 * 60);
    return diferenciaHoras < 2;
  } catch (error) {
    console.error('Error al verificar fecha del pedido:', error);
    return false;
  }
}

// Función para renderizar tarjetas de pedido (mantener esta sola función externa)
export function renderPedidoAdminCard(pedido, service) {
  const card = document.createElement("div");
  card.className = `card pedido-admin-card mb-3 border-0 shadow-sm`;
  card.setAttribute('data-estado', pedido.estadoPedidoEnum);
  card.setAttribute('data-pedido-id', pedido.id);
  
  const estadoTexto = service.obtenerTextoEstado(pedido.estadoPedidoEnum);
  const tipoServicioTexto = service.obtenerTextoTipoServicio(pedido.tipoServicio);
  const totalFormateado = service.formatearMoneda(pedido.total);
  const fechaFormateada = service.formatearFecha(pedido.fechaPedido);
  const usuarioNombre = pedido.usuario?.nombreCompleto || pedido.usuario?.email || 'Usuario no disponible';
  
  card.innerHTML = `
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start mb-3">
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <h5 class="card-title mb-1">
                Pedido #${pedido.id}
                <span class="badge ${service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)} ms-2">
                  ${estadoTexto}
                </span>
              </h5>
              <div class="user-info">
                <small class="text-muted">
                  <i class="bi bi-person me-1"></i>
                  <strong>Cliente:</strong> ${usuarioNombre}
                </small>
              </div>
            </div>
            <div class="text-end">
              <div class="fw-bold text-primary h5">${totalFormateado}</div>
              <small class="text-muted">${fechaFormateada}</small>
            </div>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col-md-6">
          <div class="service-info">
            <small class="text-muted">
              <i class="${service.obtenerIconoTipoServicio(pedido.tipoServicio)} me-1"></i>
              <strong>Tipo:</strong> ${tipoServicioTexto}
            </small>
          </div>
          ${renderInfoContacto(pedido, service)}
        </div>
        <div class="col-md-6">
          ${renderInfoFinanciera(pedido, service)}
        </div>
      </div>

      <div class="pedido-productos-resumen mb-3">
        <h6 class="fw-semibold mb-2">
          <i class="bi bi-list-check me-1"></i>
          Productos (${pedido.detalles?.length || 0})
        </h6>
        ${renderListaProductosResumen(pedido.detalles, service, pedido.id)}
      </div>

      ${pedido.notas ? `
        <div class="alert alert-light border mb-3">
          <small class="fw-semibold">
            <i class="bi bi-chat-text me-1"></i>
            Notas del Pedido:
          </small>
          <p class="mb-0 small mt-1">${pedido.notas}</p>
        </div>
      ` : ''}

      <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div class="estado-selector">
          <select class="form-select form-select-sm estado-select" 
                  data-pedido-id="${pedido.id}">
            ${service.obtenerOpcionesEstado(pedido.estadoPedidoEnum)}
          </select>
        </div>

        <div class="d-flex gap-2">
          ${pedido.estadoPedidoEnum === 'BORRADOR' ? `
            <button class="btn btn-success btn-sm pagar-btn" data-pedido-id="${pedido.id}">
              <i class="bi bi-credit-card me-1"></i>Pagar
            </button>
          ` : ''}
          
          ${pedido.estadoPedidoEnum === 'BORRADOR' || (pedido.estadoPedidoEnum === 'PENDIENTE' && esPedidoReciente(pedido.fechaPedido)) ? `
            <button class="btn btn-outline-danger btn-sm eliminar-btn" data-pedido-id="${pedido.id}">
              <i class="bi bi-trash me-1"></i>Eliminar
            </button>
          ` : ''}

          <button class="btn btn-outline-primary btn-sm detalle-btn" data-pedido-id="${pedido.id}">
            <i class="bi bi-eye me-1"></i>Detalle
          </button>
          
          ${pedido.telefonoContacto ? `
            <button class="btn btn-outline-info btn-sm contacto-btn" 
                    data-pedido-id="${pedido.id}"
                    data-telefono="${pedido.telefonoContacto}">
              <i class="bi bi-telephone me-1"></i>Contactar
            </button>
          ` : ''}
        </div>
      </div>
    </div>
  `;
  
  return card;
}

// Funciones auxiliares para la tarjeta de pedido
function renderInfoContacto(pedido, service) {
  if (pedido.tipoServicio === 'DOMICILIO') {
    return `
      <div class="contacto-info mt-2">
        <small class="text-muted d-block">
          <i class="bi bi-geo-alt me-1"></i>
          <strong>Dirección:</strong> ${pedido.direccionEntrega || 'No especificada'}
        </small>
        ${pedido.telefonoContacto ? `
          <small class="text-muted d-block">
            <i class="bi bi-telephone me-1"></i>
            <strong>Teléfono:</strong> ${pedido.telefonoContacto}
          </small>
        ` : ''}
      </div>
    `;
  } else if (pedido.tipoServicio === 'RECOGER_PEDIDO') {
    return `
      <div class="contacto-info mt-2">
        <small class="text-muted d-block">
          <i class="bi bi-clock me-1"></i>
          <strong>Recogida:</strong> ${pedido.horaRecogida ? service.formatearFecha(pedido.horaRecogida) : 'No especificada'}
        </small>
        ${pedido.telefonoContacto ? `
          <small class="text-muted d-block">
            <i class="bi bi-telephone me-1"></i>
            <strong>Teléfono:</strong> ${pedido.telefonoContacto}
          </small>
        ` : ''}
      </div>
    `;
  }
  return '';
}

function renderInfoFinanciera(pedido, service) {
  const subtotal = service.formatearMoneda(pedido.subtotal || 0);
  const iva = service.formatearMoneda(pedido.iva || 0);
  const total = service.formatearMoneda(pedido.total || 0);
  
  return `
    <div class="financiera-info">
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

  const productosMostrar = detalles.slice(0, 3);
  const productosOcultos = detalles.length - 3;

  return `
    <div class="productos-resumen">
      ${productosMostrar.map((detalle, index) => {
        const subtotal = service.formatearMoneda(detalle.subtotal || 0);
        return `
          <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
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