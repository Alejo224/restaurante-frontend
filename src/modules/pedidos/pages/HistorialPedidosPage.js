// src/modules/pedidos/pages/HistorialPedidosPage.js
import { createPedidosService } from "../services/PedidosService.js";
import { renderPedidoCard } from "../components/HistorialPedidosComponent.js";
import { router } from "../../../router.js";
import { logout, isAuthenticated, getCurrentUser } from '../../auth/userService.js';

export function HistorialPedidosPage() {
  const page = document.createElement('div');
  page.setAttribute('role', 'main');
  page.setAttribute('aria-label', 'Historial de pedidos');
  
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;
  const userName = user?.email?.split('@')[0] || 'Usuario';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  page.innerHTML = `
    <!-- Enlace para saltar navegación -->
    <a href="#main-content" class="btn btn-primary visually-hidden-focusable position-absolute top-0 start-0 m-2" 
       style="z-index: 9999;" tabindex="0">
      Saltar al contenido principal
    </a>

    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-dark fixed-top" role="navigation" aria-label="Navegación principal">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" id="homeLink" 
           aria-label="Sabores & Delicias - Ir al inicio" tabindex="0">
          <i class="bi bi-egg-fried me-2" aria-hidden="true"></i>
          Sabores & Delicias ${authenticated ? `- ${displayName}` : ''}
        </a>
        <div class="d-flex align-items-center gap-2" role="toolbar" aria-label="Controles de usuario">
          <button class="btn btn-outline-light btn-sm" id="backBtn" 
                  aria-label="Volver al dashboard principal">
            <i class="bi bi-arrow-left me-1" aria-hidden="true"></i>
            Dashboard
          </button>
          
          ${authenticated ? `
            <button class="btn btn-outline-warning btn-sm" id="logoutBtn" 
                    aria-label="Cerrar sesión de ${displayName}">
              <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i>
              Cerrar Sesión
            </button>
          ` : `
            <button class="btn btn-outline-success btn-sm" id="loginBtn" 
                    aria-label="Iniciar sesión en la cuenta">
              <i class="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
              Iniciar Sesión
            </button>
            <button class="btn btn-outline-warning btn-sm" id="registerBtn" 
                    aria-label="Crear nueva cuenta">
              <i class="bi bi-person-plus me-1" aria-hidden="true"></i>
              Registrarse
            </button>
          `}
        </div>
      </div>
    </nav>

    <div style="height: 80px;" aria-hidden="true"></div>

    <!-- Contenido Principal -->
    <div class="container-fluid py-4" id="main-content" tabindex="-1">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <header>
            <h1 class="h3 fw-bold">Mis Pedidos</h1>
            <p class="text-muted">Revisa y gestiona el historial de tus pedidos realizados</p>
          </header>
        </div>
      </div>

      <!-- Filtros -->
      <section aria-labelledby="filtros-heading">
        <h2 id="filtros-heading" class="visually-hidden">Filtros de pedidos</h2>
        <div class="row mb-4">
          <div class="col">
            <div class="d-flex flex-wrap gap-2" id="filtros-container" role="group" aria-label="Filtrar pedidos por estado">
              <button class="btn btn-outline-primary btn-sm active" data-filter="all"
                      aria-pressed="true"
                      aria-label="Mostrar todos los pedidos">
                Todos <span class="badge bg-primary ms-1" id="count-all">0</span>
              </button>
              <button class="btn btn-outline-warning btn-sm" data-filter="BORRADOR"
                      aria-pressed="false"
                      aria-label="Mostrar pedidos por pagar">
                Por Pagar <span class="badge bg-warning ms-1" id="count-borrador">0</span>
              </button>
              <button class="btn btn-outline-info btn-sm" data-filter="PENDIENTE"
                      aria-pressed="false"
                      aria-label="Mostrar pedidos pendientes">
                Pendientes <span class="badge bg-info ms-1" id="count-pendiente">0</span>
              </button>
              <button class="btn btn-outline-success btn-sm" data-filter="COMPLETADO"
                      aria-pressed="false"
                      aria-label="Mostrar pedidos completados">
                Completados <span class="badge bg-success ms-1" id="count-completado">0</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Contenido de Pedidos -->
      <section aria-labelledby="pedidos-heading">
        <h2 id="pedidos-heading" class="visually-hidden">Lista de pedidos</h2>
        <div id="lista-pedidos-container" aria-live="polite" aria-atomic="true">
          <div id="loading-spinner" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando pedidos...</span>
            </div>
            <p class="mt-2 text-muted">Cargando tus pedidos...</p>
          </div>
        </div>

        <!-- Mensaje sin pedidos -->
        <div id="sin-pedidos" class="text-center d-none" role="status" aria-live="polite">
          <div class="card border-dashed">
            <div class="card-body py-5">
              <i class="bi bi-bag fa-3x text-muted mb-3" aria-hidden="true"></i>
              <h5 class="text-muted">No tienes pedidos aún</h5>
              <p class="text-muted">Realiza tu primer pedido desde el carrito de compras</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Área de anuncios para accesibilidad -->
    <div class="visually-hidden" aria-live="polite" aria-atomic="true">
      <div id="ariaAnnouncer"></div>
    </div>

    <!-- CSS para mejoras de accesibilidad -->
    <style>
      .visually-hidden-focusable:not(:focus):not(:focus-within) {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      .visually-hidden-focusable:focus {
        position: fixed !important;
        top: 10px;
        left: 10px;
        z-index: 9999;
        width: auto !important;
        height: auto !important;
        padding: 0.5rem 1rem !important;
        background: #0d6efd !important;
        color: white !important;
        text-decoration: none !important;
      }

      .btn:focus-visible,
      .navbar-brand:focus-visible {
        outline: 3px solid #0d6efd;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
      }

      .pedido-card:focus-within {
        box-shadow: 0 0 0 2px #0d6efd;
      }

      /* Alto contraste */
      @media (prefers-contrast: high) {
        .card {
          border: 2px solid #000 !important;
        }
        
        .btn-outline-primary {
          border-color: #000;
          color: #000;
        }
      }

      /* Movimiento reducido */
      @media (prefers-reduced-motion: reduce) {
        .spinner-border {
          animation: none;
        }
      }
    </style>
  `;

  // Configurar event listeners
  setupPageEventListeners(page, displayName);

  return page;
}

function setupPageEventListeners(page, displayName) {
  // Función para anuncios de screen reader
  function announceToScreenReader(message) {
    const announcer = page.querySelector('#ariaAnnouncer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  // Usar event delegation para mejor rendimiento
  page.addEventListener('click', (e) => {
    const target = e.target;
    
    // Home link
    if (target.id === 'homeLink' || target.closest('#homeLink')) {
      e.preventDefault();
      announceToScreenReader('Navegando al inicio');
      router.navigate('/');
      return;
    }
    
    // Back button
    if (target.id === 'backBtn' || target.closest('#backBtn')) {
      e.preventDefault();
      announceToScreenReader('Volviendo al dashboard');
      router.navigate('/dashboard');
      return;
    }
    
    // Logout button
    if (target.id === 'logoutBtn' || target.closest('#logoutBtn')) {
      e.preventDefault();
      handleLogout(displayName);
      return;
    }
    
    // Login button
    if (target.id === 'loginBtn' || target.closest('#loginBtn')) {
      e.preventDefault();
      announceToScreenReader('Navegando al inicio de sesión');
      router.navigate('/login');
      return;
    }
    
    // Register button
    if (target.id === 'registerBtn' || target.closest('#registerBtn')) {
      e.preventDefault();
      announceToScreenReader('Navegando al registro de cuenta');
      router.navigate('/register');
      return;
    }
  });

  // Soporte para teclado
  page.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target;
      
      if (target.id === 'homeLink' || target.closest('#homeLink')) {
        e.preventDefault();
        router.navigate('/');
      } else if (target.id === 'backBtn' || target.closest('#backBtn')) {
        e.preventDefault();
        router.navigate('/dashboard');
      } else if (target.id === 'logoutBtn' || target.closest('#logoutBtn')) {
        e.preventDefault();
        handleLogout(displayName);
      } else if (target.id === 'loginBtn' || target.closest('#loginBtn')) {
        e.preventDefault();
        router.navigate('/login');
      } else if (target.id === 'registerBtn' || target.closest('#registerBtn')) {
        e.preventDefault();
        router.navigate('/register');
      }
    }
  });

  // Manejo de logout
  async function handleLogout(userDisplayName) {
    if (confirm(`¿Estás seguro de que quieres cerrar sesión ${userDisplayName}?`)) {
      announceToScreenReader('Cerrando sesión...');
      try {
        await logout();
        announceToScreenReader('Sesión cerrada correctamente');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        announceToScreenReader('Error al cerrar sesión');
      }
    } else {
      announceToScreenReader('Cierre de sesión cancelado');
    }
  }
}

// FUNCIÓN afterRender mejorada
export async function afterRenderHistorialPedidos() {
  console.log('🚀 afterRenderHistorialPedidos ejecutándose...');
  
  const container = document.getElementById('lista-pedidos-container');
  if (!container) {
    console.error('❌ No se encontró el contenedor de pedidos');
    return;
  }

  console.log('✅ Elementos DOM encontrados, iniciando carga...');
  
  const service = createPedidosService();
  let pedidos = [];
  let filtroActual = 'all';

  // Función para anuncios de screen reader
  function announceToScreenReader(message) {
    const announcer = document.getElementById('ariaAnnouncer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  try {
    mostrarLoading(true);
    ocultarSinPedidos();
    announceToScreenReader('Cargando historial de pedidos...');

    pedidos = await service.obtenerPedidos();
    console.log('📦 Pedidos obtenidos:', pedidos.length);
    
    renderizarPedidos();
    actualizarContadores();
    setupEventListeners();
    
    announceToScreenReader(`Historial cargado con ${pedidos.length} pedidos`);
    
  } catch (error) {
    console.error('❌ Error cargando pedidos:', error);
    mostrarError('Error al cargar los pedidos: ' + error.message);
    announceToScreenReader('Error al cargar el historial de pedidos');
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

    container.innerHTML = '';
    pedidosFiltrados.forEach(pedido => {
      const pedidoCard = renderPedidoCard(pedido, service);
      container.appendChild(pedidoCard);
    });

    setupPedidosEventListeners();
    announceToScreenReader(`Mostrando ${pedidosFiltrados.length} pedidos`);
  }

  function filtrarPedidos(pedidos) {
    if (filtroActual === 'all') return pedidos;
    return pedidos.filter(pedido => pedido.estadoPedidoEnum === filtroActual);
  }

  function setupEventListeners() {
    // Filtros con event delegation
    const filtrosContainer = document.getElementById('filtros-container');
    if (filtrosContainer) {
      filtrosContainer.addEventListener('click', (e) => {
        const botonFiltro = e.target.closest('[data-filter]');
        if (!botonFiltro) return;

        document.querySelectorAll('[data-filter]').forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-pressed', 'false');
        });
        
        botonFiltro.classList.add('active');
        botonFiltro.setAttribute('aria-pressed', 'true');
        aplicarFiltro(botonFiltro.dataset.filter);
      });

      // Soporte para teclado en filtros
      filtrosContainer.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          const botonFiltro = e.target.closest('[data-filter]');
          if (!botonFiltro) return;

          e.preventDefault();
          document.querySelectorAll('[data-filter]').forEach(b => {
            b.classList.remove('active');
            b.setAttribute('aria-pressed', 'false');
          });
          
          botonFiltro.classList.add('active');
          botonFiltro.setAttribute('aria-pressed', 'true');
          aplicarFiltro(botonFiltro.dataset.filter);
        }
      });
    }
  }

  function setupPedidosEventListeners() {
    // Event delegation para botones de pedidos
    const pedidosContainer = document.getElementById('lista-pedidos-container');
    if (!pedidosContainer) return;

    pedidosContainer.addEventListener('click', (e) => {
      const botonPagar = e.target.closest('.pagar-btn');
      const botonDetalle = e.target.closest('.detalle-btn');
      
      if (botonPagar) {
        const pedidoId = botonPagar.dataset.pedidoId;
        pagarPedido(pedidoId);
      } else if (botonDetalle) {
        const pedidoId = botonDetalle.dataset.pedidoId;
        verDetallePedido(pedidoId);
      }
    });

    // Soporte para teclado en botones de pedidos
    pedidosContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        const botonPagar = e.target.closest('.pagar-btn');
        const botonDetalle = e.target.closest('.detalle-btn');
        
        if (botonPagar) {
          e.preventDefault();
          const pedidoId = botonPagar.dataset.pedidoId;
          pagarPedido(pedidoId);
        } else if (botonDetalle) {
          e.preventDefault();
          const pedidoId = botonDetalle.dataset.pedidoId;
          verDetallePedido(pedidoId);
        }
      }
    });
  }

  function aplicarFiltro(filtro) {
    filtroActual = filtro;
    const filtroTexto = obtenerTextoFiltro(filtro);
    announceToScreenReader(`Filtro aplicado: ${filtroTexto}`);
    renderizarPedidos();
    actualizarContadores();
  }

  function obtenerTextoFiltro(filtro) {
    const textos = {
      'all': 'todos los pedidos',
      'BORRADOR': 'pedidos por pagar',
      'PENDIENTE': 'pedidos pendientes',
      'COMPLETADO': 'pedidos completados'
    };
    return textos[filtro] || filtro;
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
    announceToScreenReader(`Procesando pago del pedido ${pedidoId}`);
    alert(`Procesando pago del pedido #${pedidoId} (Próximo sprint)`);
  }

  function verDetallePedido(pedidoId) {
    console.log('👀 Viendo detalle del pedido:', pedidoId);
    const pedido = pedidos.find(p => p.id == pedidoId);
    if (pedido) {
      mostrarModalDetalle(pedido, service);
      announceToScreenReader(`Abriendo detalles del pedido ${pedidoId}`);
    }
  }

  function mostrarModalDetalle(pedido, service) {
    const modalHTML = `
      <div class="modal fade" id="detallePedidoModal" tabindex="-1" aria-labelledby="detallePedidoModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header">
              <h3 class="modal-title h5" id="detallePedidoModalLabel">Detalle del Pedido #${pedido.id}</h3>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Cerrar modal"></button>
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
              <h4 class="h6">Productos:</h4>
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
              `).join('') || '<p class="text-muted">No hay productos en este pedido</p>'}
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
      announceToScreenReader('Modal de detalles cerrado');
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
    announceToScreenReader('No tienes pedidos en tu historial');
  }

  function mostrarSinPedidosFiltro() {
    const container = document.getElementById('lista-pedidos-container');
    if (container) {
      container.innerHTML = `
        <div class="alert alert-info text-center" role="status">
          <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
          No hay pedidos con el filtro aplicado.
        </div>
      `;
    }
    announceToScreenReader('No hay pedidos que coincidan con el filtro seleccionado');
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
          <i class="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
          ${mensaje}
        </div>
      `;
    }
  }
}