// src/modules/pedidos/pages/HistorialPedidosPage.js
import { createPedidosService } from "../services/PedidosService.js";
import { renderPedidoCard } from "../components/HistorialPedidosComponent.js";
import { router } from "../../../router.js";
import { logout, isAuthenticated, getCurrentUser } from '../../auth/userService.js';

// ✅ FUNCIÓN PRINCIPAL que retorna el HTML
export function HistorialPedidosPage() {
  const page = document.createElement('div');
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;
  const userName = user?.email?.split('@')[0] || 'Usuario';

  page.innerHTML = `
    <div class="container-fluid py-4">
  
      <!-- Navbar -->
      <nav class="navbar navbar-dark bg-dark fixed-top">
        <div class="container">
          <a class="navbar-brand fw-bold" href="#" id="homeLink">
            <i class="bi bi-egg-fried me-2"></i>
            Sabores & Delicias ${authenticated ? `- ${userName}` : ''}
          </a>
          <div class="d-flex align-items-center gap-2">
            ${authenticated ? `
              
            ` : ''}
            
            <button class="btn btn-outline-light btn-sm" id="backBtn">
              <i class="bi bi-arrow-left me-1"></i>
              Dashboard
            </button>
            
            ${authenticated ? `
              <button class="btn btn-outline-warning btn-sm" id="logoutBtn">
                <i class="bi bi-box-arrow-right me-1"></i>
                Cerrar Sesión
              </button>
            ` : `
              <button class="btn btn-outline-success btn-sm" id="loginBtn">
                <i class="bi bi-box-arrow-in-right me-1"></i>
                Iniciar Sesión
              </button>
              <button class="btn btn-outline-warning btn-sm" id="registerBtn">
                <i class="bi bi-person-plus me-1"></i>
                Registrarse
              </button>
            `}
          </div>
        </div>
      </nav>

      <div style="height: 80px;"></div>

      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <h1 class="h3 fw-bold">Mis Pedidos</h1>
          <p class="text-muted">Gestiona tus pedidos y realiza pagos pendientes</p>
        </div>
      </div>

      <!-- Filtros -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex flex-wrap gap-2" id="filtros-container">
            <button class="btn btn-outline-primary btn-sm active" data-filter="all">
              Todos <span class="badge bg-primary ms-1" id="count-all">0</span>
            </button>
            <button class="btn btn-outline-warning btn-sm" data-filter="BORRADOR">
              Por Pagar <span class="badge bg-warning ms-1" id="count-borrador">0</span>
            </button>
            <button class="btn btn-outline-info btn-sm" data-filter="PENDIENTE">
              Pendientes <span class="badge bg-info ms-1" id="count-pendiente">0</span>
            </button>
            <button class="btn btn-outline-success btn-sm" data-filter="COMPLETADO">
              Completados <span class="badge bg-success ms-1" id="count-completado">0</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido -->
      <div id="lista-pedidos-container">
        <div id="loading-spinner" class="text-center my-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <p class="mt-2 text-muted">Cargando tus pedidos...</p>
        </div>
      </div>

      <!-- Mensaje sin pedidos -->
      <div id="sin-pedidos" class="text-center d-none">
        <div class="card border-dashed">
          <div class="card-body py-5">
            <i class="bi bi-bag fa-3x text-muted mb-3"></i>
            <h5 class="text-muted">No tienes pedidos aún</h5>
            <p class="text-muted">Realiza tu primer pedido desde el carrito</p>
          </div>
        </div>
      </div>
    </div>
  `
  // Event listeners
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  page.querySelector('#backBtn').addEventListener('click', () => {
    router.navigate('/dashboard');
  });

  const logoutBtn = page.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        logout();
      }
    });
  }

  

  return page;
}

// FUNCIÓN afterRender que se ejecuta DESPUÉS de insertar el HTML
export async function afterRenderHistorialPedidos() {
  console.log('🚀 afterRenderHistorialPedidos ejecutándose...');
  
  // Verificar que los elementos del DOM existen
  const container = document.getElementById('lista-pedidos-container');
  if (!container) {
    console.error('❌ No se encontró el contenedor de pedidos');
    return;
  }

  console.log('✅ Elementos DOM encontrados, iniciando carga...');
  
  const service = createPedidosService();
  let pedidos = [];
  let filtroActual = 'all';

  try {
    mostrarLoading(true);
    ocultarSinPedidos();

    // Obtener pedidos de la API
    pedidos = await service.obtenerPedidos();
    console.log('📦 Pedidos obtenidos:', pedidos.length);
    
    renderizarPedidos();
    actualizarContadores();
    setupEventListeners();
    
  } catch (error) {
    console.error('❌ Error cargando pedidos:', error);
    mostrarError('Error al cargar los pedidos: ' + error.message);
  } finally {
    mostrarLoading(false);
  }

  function renderizarPedidos() {
    const container = document.getElementById('lista-pedidos-container');
    if (!container) return;

    if (pedidos.length === 0) {
      mostrarSinPedidos();
      return;
    }

    const pedidosFiltrados = filtrarPedidos(pedidos);
    
    if (pedidosFiltrados.length === 0) {
      mostrarSinPedidosFiltro();
      return;
    }

    container.innerHTML = ''; // Limpiar loading
    pedidosFiltrados.forEach(pedido => {
      const pedidoCard = renderPedidoCard(pedido, service);
      container.appendChild(pedidoCard);
    });

    setupPedidosEventListeners();
  }

  function filtrarPedidos(pedidos) {
    if (filtroActual === 'all') return pedidos;
    return pedidos.filter(pedido => pedido.estadoPedidoEnum === filtroActual);
  }

  function setupEventListeners() {
    // Filtros
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        aplicarFiltro(e.target.dataset.filter);
      });
    });
  }

  function setupPedidosEventListeners() {
    // Botones de pagar
    document.querySelectorAll('.pagar-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pedidoId = e.target.closest('.pagar-btn').dataset.pedidoId;
        pagarPedido(pedidoId);
      });
    });

    // Botones de detalle
    document.querySelectorAll('.detalle-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pedidoId = e.target.closest('.detalle-btn').dataset.pedidoId;
        verDetallePedido(pedidoId);
      });
    });
  }

  function aplicarFiltro(filtro) {
    filtroActual = filtro;
    renderizarPedidos();
    actualizarContadores();
  }

  function actualizarContadores() {
    const counts = service.obtenerContadores(pedidos);
    Object.keys(counts).forEach(key => {
      const element = document.getElementById(`count-${key}`);
      if (element) element.textContent = counts[key];
    });
  }

  function pagarPedido(pedidoId) {
    console.log('💳 Pagando pedido:', pedidoId);
    alert(`Procesando pago del pedido #${pedidoId} (Próximo sprint)`);
  }

  function verDetallePedido(pedidoId) {
    console.log('👀 Viendo detalle del pedido:', pedidoId);
    const pedido = pedidos.find(p => p.id == pedidoId);
    if (pedido) {
      mostrarModalDetalle(pedido, service);
    }
  }

  function mostrarModalDetalle(pedido, service) {
    const modalHTML = `
      <div class="modal fade" id="detallePedidoModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Detalle del Pedido #${pedido.id}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <div class="row">
                <div class="col-md-6">
                  <p><strong>Estado:</strong> <span class="badge ${service.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum)}">${service.obtenerTextoEstado(pedido.estadoPedidoEnum)}</span></p>
                  <p><strong>Fecha:</strong> ${service.formatearFecha(pedido.fechaPedido)}</p>
                  <p><strong>Tipo:</strong> ${service.obtenerTextoTipoServicio(pedido.tipoServicio)}</p>
                </div>
                <div class="col-md-6">
                  <p><strong>Subtotal:</strong> ${service.formatearMoneda(pedido.subtotal)}</p>
                  <p><strong>IVA:</strong> ${service.formatearMoneda(pedido.iva)}</p>
                  <p><strong>Total:</strong> ${service.formatearMoneda(pedido.total)}</p>
                </div>
              </div>
              <hr>
              <h6>Productos:</h6>
              ${pedido.detalles?.map(detalle => `
                <div class="d-flex justify-content-between border-bottom py-2">
                  <div>
                    <strong>${detalle.cantidad}x ${detalle.platoNombre}</strong>
                    ${detalle.notas ? `<br><small class="text-muted">${detalle.notas}</small>` : ''}
                  </div>
                  <div class="text-end">
                    <div>${service.formatearMoneda(detalle.subtotal)}</div>
                    <small class="text-muted">${service.formatearMoneda(detalle.precioUnitario)} c/u</small>
                  </div>
                </div>
              `).join('') || 'No hay productos'}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              ${pedido.estadoPedidoEnum === 'BORRADOR' ? 
                `<button type="button" class="btn btn-primary" onclick="pagarPedido(${pedido.id})">Pagar Pedido</button>` : 
                ''
              }
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('detallePedidoModal'));
    modal.show();
    
    document.getElementById('detallePedidoModal').addEventListener('hidden.bs.modal', function () {
      this.remove();
    });
  }

  function mostrarLoading(mostrar) {
    const container = document.getElementById('lista-pedidos-container');
    const spinner = document.getElementById('loading-spinner');
    
    if (mostrar) {
      if (container) container.innerHTML = '';
      if (spinner) spinner.style.display = 'block';
    } else {
      if (spinner) spinner.style.display = 'none';
    }
  }

  function mostrarSinPedidos() {
    const sinPedidos = document.getElementById('sin-pedidos');
    const container = document.getElementById('lista-pedidos-container');
    if (sinPedidos) sinPedidos.classList.remove('d-none');
    if (container) container.innerHTML = '';
  }

  function mostrarSinPedidosFiltro() {
    const container = document.getElementById('lista-pedidos-container');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          No hay pedidos con el filtro aplicado.
        </div>
      `;
    }
  }

  function ocultarSinPedidos() {
    const sinPedidos = document.getElementById('sin-pedidos');
    if (sinPedidos) sinPedidos.classList.add('d-none');
  }

  function mostrarError(mensaje) {
    const container = document.getElementById('lista-pedidos-container');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-danger" role="alert">
          <i class="bi bi-exclamation-triangle me-2"></i>
          ${mensaje}
        </div>
      `;
    }
  }
}