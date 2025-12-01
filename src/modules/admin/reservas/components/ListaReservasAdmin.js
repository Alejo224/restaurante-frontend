// src/modules/admin/reservas/components/ListaReservasAdmin.js
import { adminReservaService } from '../services/adminReservaService.js';
import * as bootstrap from 'bootstrap'; // Importar Bootstrap

export class ListaReservasAdmin {
  constructor() {
    this.reservas = [];
    this.filtroEstado = 'TODAS';
    this.currentModal = null; // Referencia al modal actual
  }

  async initialize() {
    await this.cargarReservas();
    this.render();
    this.configurarEventListeners();
  }

  async cargarReservas() {
    const loadingElement = document.getElementById('reservas-loading');
    const contentElement = document.getElementById('reservas-content');
    const errorElement = document.getElementById('reservas-error');

    try {
      // Mostrar loading
      if (loadingElement) loadingElement.style.display = 'block';
      if (contentElement) contentElement.style.display = 'none';
      if (errorElement) errorElement.style.display = 'none';

      this.reservas = await adminReservaService.obtenerTodasLasReservas();
      
      // Ocultar loading y mostrar contenido
      if (loadingElement) loadingElement.style.display = 'none';
      if (contentElement) contentElement.style.display = 'block';

    } catch (error) {
      console.error('Error cargando reservas:', error);
      if (loadingElement) loadingElement.style.display = 'none';
      if (errorElement) errorElement.style.display = 'block';
    }
  }

  render() {
    const container = document.getElementById('reservas-list-container');
    if (!container) return;

    const reservasFiltradas = this.filtrarReservas();

    container.innerHTML = `
      <div class="card border-0 shadow-sm">
        <div class="card-header bg-white">
          <div class="d-flex justify-content-between align-items-center">
            <h5 class="card-title mb-0">Todas las Reservas</h5>
            <div class="d-flex gap-2 align-items-center">
              <label class="form-label mb-0 small">Filtrar por estado:</label>
              <select class="form-select form-select-sm" id="filtroEstado" style="width: auto;">
                <option value="TODAS">Todas</option>
                <option value="CONFIRMADA">Confirmadas</option>
                <option value="PENDIENTE">Pendientes</option>
                <option value="CANCELADA">Canceladas</option>
              </select>
            </div>
          </div>
        </div>
        <div class="card-body p-0">
          ${this.renderTablaReservas(reservasFiltradas)}
        </div>
      </div>
    `;
  }

  filtrarReservas() {
    if (this.filtroEstado === 'TODAS') {
      return this.reservas;
    }
    return this.reservas.filter(reserva => reserva.estado === this.filtroEstado);
  }

  renderTablaReservas(reservas) {
    if (!reservas || reservas.length === 0) {
      return `
        <div class="text-center py-5">
          <i class="bi bi-calendar-x fs-1 text-muted"></i>
          <p class="text-muted mt-2">No hay reservas registradas</p>
        </div>
      `;
    }

    return `
      <div class="table-responsive">
        <table class="table table-hover mb-0" aria-label="Lista de reservas del restaurante">
          <thead class="table-light">
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Cliente</th>
              <th scope="col">Fecha</th>
              <th scope="col">Hora</th>
              <th scope="col">Mesa</th>
              <th scope="col">Estado</th>
              <th scope="col">Notas</th>
              <th scope="col">Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${reservas.map(reserva => this.renderFilaReserva(reserva)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  renderFilaReserva(reserva) {
    const claseEstado = adminReservaService.obtenerClaseEstado(reserva.estado);
    const textoEstado = adminReservaService.obtenerTextoEstado(reserva.estado);
    const fechaFormateada = adminReservaService.formatearFecha(reserva.fechaReserva);
    const horaFormateada = adminReservaService.formatearHora(reserva.horaReserva);
    
    return `
      <tr>
        <td class="fw-bold">#${reserva.id}</td>
        <td>
          <div class="d-flex align-items-center">
            <i class="bi bi-person-circle me-2 text-muted"></i>
            <span>${reserva.usuarioEmail}</span>
          </div>
        </td>
        <td>${fechaFormateada}</td>
        <td>${horaFormateada}</td>
        <td>
          <span class="badge bg-light text-dark border">
            ${reserva.mesa?.nombreMesa || 'N/A'} 
            (${reserva.mesa?.capacidad || 0} pers.)
          </span>
        </td>
        <td>
          <span class="badge ${claseEstado}">${textoEstado}</span>
        </td>
        <td>
          <span class="d-inline-block text-truncate" style="max-width: 200px;" 
                title="${reserva.nota || 'Sin notas'}">
            ${reserva.nota || '-'}
          </span>
        </td>
        <td>
          <div class="btn-group btn-group-sm" role="group">
            ${this.renderBotonesAccion(reserva)}
          </div>
        </td>
      </tr>
    `;
  }

  renderBotonesAccion(reserva) {
      const botones = [];

      // Botón de detalles (siempre visible)
      botones.push(`
          <button type="button" class="btn btn-outline-primary btn-detalles" 
                  data-reserva-id="${reserva.id}"
                  title="Ver detalles">
              <i class="bi bi-eye"></i>
          </button>
      `);

      // Botones según estado
      if (reserva.estado === 'PENDIENTE') {
          botones.push(`
              <button type="button" class="btn btn-outline-success btn-confirmar" 
                      data-reserva-id="${reserva.id}"
                      title="Confirmar reserva">
                  <i class="bi bi-check-lg"></i>
              </button>
          `);
      }

      if (reserva.estado !== 'CANCELADA' && reserva.estado !== 'COMPLETADA') {
          botones.push(`
              <button type="button" class="btn btn-outline-danger btn-cancelar" 
                      data-reserva-id="${reserva.id}"
                      title="Cancelar reserva">
                  <i class="bi bi-x-lg"></i>
              </button>
          `);
      }

      return botones.join('');
  }

  configurarEventListeners() {
      const filtroEstado = document.getElementById('filtroEstado');
      if (filtroEstado) {
          filtroEstado.value = this.filtroEstado;
          filtroEstado.addEventListener('change', (e) => {
              this.filtroEstado = e.target.value;
              this.render();
          });
      }

      // Botón de actualizar
      const actualizarBtn = document.getElementById('actualizarReservasBtn');
      if (actualizarBtn) {
          actualizarBtn.addEventListener('click', async () => {
              await this.cargarReservas();
              this.render();
          });
      }

      // Event delegation para los botones de acción
      const container = document.getElementById('reservas-list-container');
      if (container) {
          container.addEventListener('click', (e) => {
              const target = e.target;
              
              // Buscar el botón que fue clickeado (puede ser el ícono o el botón)
              const button = target.closest('.btn-detalles, .btn-confirmar, .btn-cancelar');
              
              if (button) {
                  const reservaId = parseInt(button.dataset.reservaId);
                  console.log('🎯 Botón clickeado, reserva ID:', reservaId);
                  
                  if (button.classList.contains('btn-detalles')) {
                      this.mostrarDetalles(reservaId);
                  } else if (button.classList.contains('btn-confirmar')) {
                      this.confirmarReserva(reservaId);
                  } else if (button.classList.contains('btn-cancelar')) {
                      this.cancelarReserva(reservaId);
                  }
              }
          });
      }
  }

  async confirmarReserva(reservaId) {
    if (!confirm('¿Estás seguro de que quieres confirmar esta reserva?')) {
      return;
    }

    try {
      await adminReservaService.actualizarEstadoReserva(reservaId, 'CONFIRMADA');
      this.mostrarMensaje('Reserva confirmada exitosamente', 'success');
      await this.cargarReservas();
      this.render();
    } catch (error) {
      this.mostrarMensaje('Error al confirmar la reserva', 'error');
    }
  }

  async cancelarReserva(reservaId) {
    if (!confirm('¿Estás seguro de que quieres cancelar esta reserva?')) {
      return;
    }

    try {
      await adminReservaService.cancelarReserva(reservaId);
      this.mostrarMensaje('Reserva cancelada exitosamente', 'success');
      await this.cargarReservas();
      this.render();
    } catch (error) {
      this.mostrarMensaje('Error al cancelar la reserva', 'error');
    }
  }

  mostrarDetalles(reservaId) {
    console.log('🔍 Buscando reserva ID:', reservaId, 'Tipo:', typeof reservaId);
    console.log('📋 Todas las reservas:', this.reservas);
    
    // Buscar la reserva
    const reserva = this.reservas.find(r => r.id.toString() === reservaId.toString());
    
    console.log('✅ Reserva encontrada:', reserva);

    if (!reserva) {
        console.error('❌ No se encontró la reserva con ID:', reservaId);
        this.mostrarMensaje('No se pudo encontrar la reserva', 'error');
        return;
    }

    // Crear modal directamente
    this.crearYMostrarModal(reserva);
  }

  crearYMostrarModal(reserva) {
    // Limpiar modal anterior
    if (this.currentModal) {
      this.currentModal.dispose();
    }

    // Crear modal HTML
    const modalHtml = `
      <div class="modal fade" id="modalDetallesReserva" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalles de Reserva #${reserva.id}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <h6>Información del Cliente</h6>
                  <p><strong>Email:</strong> ${reserva.usuarioEmail}</p>
                  
                  <h6 class="mt-3">Detalles de la Reserva</h6>
                  <p><strong>Fecha:</strong> ${adminReservaService.formatearFecha(reserva.fechaReserva)}</p>
                  <p><strong>Hora:</strong> ${adminReservaService.formatearHora(reserva.horaReserva)}</p>
                  <p><strong>Estado:</strong> 
                    <span class="badge ${adminReservaService.obtenerClaseEstado(reserva.estado)}">
                      ${adminReservaService.obtenerTextoEstado(reserva.estado)}
                    </span>
                  </p>
                  <p><strong>Fecha creación:</strong> ${adminReservaService.formatearFecha(reserva.fechaCreacion)}</p>
                </div>
                <div class="col-md-6">
                  <h6>Información de la Mesa</h6>
                  <p><strong>Mesa:</strong> ${reserva.mesa?.nombreMesa || 'N/A'}</p>
                  <p><strong>Capacidad:</strong> ${reserva.mesa?.capacidad || 0} personas</p>
                  <p><strong>Estado mesa:</strong> 
                    <span class="badge ${reserva.mesa?.estado ? 'bg-success' : 'bg-danger'}">
                      ${reserva.mesa?.estado ? 'Disponible' : 'Ocupada'}
                    </span>
                  </p>
                  
                  <h6 class="mt-3">Notas Adicionales</h6>
                  <p class="border rounded p-2 bg-light">${reserva.nota || 'No hay notas adicionales'}</p>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              ${this.renderAccionesModal(reserva)}
            </div>
          </div>
        </div>
      </div>
    `;

    // Crear elemento modal
    const modalElement = document.createElement('div');
    modalElement.innerHTML = modalHtml;
    const modal = modalElement.firstElementChild;

    // Agregar al documento
    document.body.appendChild(modal);

    // Crear instancia de modal Bootstrap
    const bsModal = new bootstrap.Modal(modal);
    this.currentModal = bsModal;

    // Configurar eventos del modal
    modal.addEventListener('hidden.bs.modal', () => {
      modal.remove();
      this.currentModal = null;
    });

    // Configurar botones de acción dentro del modal
    this.configurarAccionesModal(modal, reserva.id);

    // Mostrar modal
    bsModal.show();
  }

  renderAccionesModal(reserva) {
    let botones = `
      <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
    `;

    if (reserva.estado === 'PENDIENTE') {
      botones += `
        <button type="button" class="btn btn-success btn-confirmar-modal" 
                data-reserva-id="${reserva.id}">
          Confirmar Reserva
        </button>
      `;
    }

    if (reserva.estado !== 'CANCELADA' && reserva.estado !== 'COMPLETADA') {
      botones += `
        <button type="button" class="btn btn-danger btn-cancelar-modal" 
                data-reserva-id="${reserva.id}">
          Cancelar Reserva
        </button>
      `;
    }

    return botones;
  }

  configurarAccionesModal(modal, reservaId) {
    // Botón confirmar en modal
    const btnConfirmar = modal.querySelector('.btn-confirmar-modal');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', async () => {
        if (confirm('¿Confirmar esta reserva?')) {
          try {
            await this.confirmarReserva(reservaId);
            this.currentModal.hide();
          } catch (error) {
            console.error('Error al confirmar:', error);
          }
        }
      });
    }

    // Botón cancelar en modal
    const btnCancelar = modal.querySelector('.btn-cancelar-modal');
    if (btnCancelar) {
      btnCancelar.addEventListener('click', async () => {
        if (confirm('¿Cancelar esta reserva?')) {
          try {
            await this.cancelarReserva(reservaId);
            this.currentModal.hide();
          } catch (error) {
            console.error('Error al cancelar:', error);
          }
        }
      });
    }
  }

  mostrarMensaje(mensaje, tipo) {
    // Usar alert temporal si no está disponible toast de Bootstrap
    const toastId = `toast-${Date.now()}`;
    
    const toastHtml = `
      <div id="${toastId}" class="toast align-items-center text-bg-${tipo === 'success' ? 'success' : 'danger'} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">
            ${mensaje}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
      </div>
    `;
    
    // Obtener o crear contenedor de toasts
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
      document.body.appendChild(toastContainer);
    }
    
    // Agregar toast
    toastContainer.insertAdjacentHTML('afterbegin', toastHtml);
    
    // Mostrar toast
    const toastElement = document.getElementById(toastId);
    if (toastElement && bootstrap && bootstrap.Toast) {
      const toast = new bootstrap.Toast(toastElement);
      toast.show();
      
      // Remover después de ocultar
      toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
      });
    } else {
      // Fallback: usar alert simple y remover después de 3 segundos
      setTimeout(() => {
        const element = document.getElementById(toastId);
        if (element) element.remove();
      }, 3000);
    }
  }
}

// Versión alternativa para compatibilidad
if (!window.bootstrap && typeof bootstrap !== 'undefined') {
  window.bootstrap = bootstrap;
}