// src/modules/admin/pages/AdminDashboard.js
import { router } from '../../../router.js';
import { logout, getCurrentUser } from '../../auth/userService.js';
import { PlatoList } from '../../menu/components/PlatoList.js';
import { MesasList } from '../../Mesa/MesasList.js';
import { CrearMesaModal } from '../crear-mesa/CrearMesaModal.js';
import { HistorialPedidosAdminComponent } from '../../pedidos/components/HistorialPedidosAdminComponent.js';
import { EstadisticasAvanzadas } from '../../estadisticas/components/EstadisticasAvanzadas.js';
import { estadisticasAvanzadasService } from '../../estadisticas/EstadisticasAvanzadasService.js';
import { ListaReservasAdmin } from '../reservas/components/ListaReservasAdmin.js';

export function AdminDashboard() {
  const page = document.createElement('div');
  page.setAttribute('role', 'application');
  page.setAttribute('aria-label', 'Panel de Administración del Restaurante');
  
  const user = getCurrentUser();
  const userName = user?.email?.split('@')[0] || 'Administrador';
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  // Inicializar estadisticas avanzadas
  let estadisticasAvanzadas;

  let listaReservasAdmin;

  page.innerHTML = `
  <!-- Layout con Sidebar -->
  <div class="admin-layout">
    
    <!-- Enlace para saltar navegación -->
    <a href="#main-content" class="btn btn-primary visually-hidden-focusable position-absolute top-0 start-0 m-2" 
       style="z-index: 9999;" tabindex="0">
      Saltar al contenido principal
    </a>

    <!-- Sidebar - Navegación principal -->
    <aside class="admin-sidebar" id="adminSidebar" aria-label="Navegación principal del panel administrativo">
      <!-- Header del Sidebar -->
      <header class="sidebar-header" role="banner">
        <div class="d-flex align-items-center">
          <i class="bi bi-egg-fried fs-3 me-2 text-warning" aria-hidden="true"></i>
          <div>
            <h1 class="h5 mb-0 fw-bold text-white">Panel Administrativo</h1>
            <small class="text-panel" aria-label="Usuario actual: ${displayName}">${displayName}</small>
          </div>
        </div>
      </header>

      <!-- Navegación del Sidebar -->
      <nav class="sidebar-nav" aria-label="Menú de administración">
        <ul class="nav flex-column" role="menubar">
          <!-- Dashboard -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link active" id="navDashboard" data-section="dashboard" role="menuitem" 
               aria-current="page" aria-label="Ir al dashboard principal">
              <i class="bi bi-speedometer2 me-2" aria-hidden="true"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <!-- Gestión de Menú -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navMenu" data-section="menu" role="menuitem" 
               aria-label="Gestionar menú del restaurante">
              <i class="bi bi-menu-button-wide me-2" aria-hidden="true"></i>
              <span>Gestionar Menú</span>
            </a>
          </li>

          <!-- Gestión de Mesas -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navMesas" data-section="mesas" role="menuitem" 
               aria-label="Gestionar mesas del restaurante">
              <i class="bi bi-table me-2" aria-hidden="true"></i>
              <span>Gestionar Mesas</span>
            </a>
          </li>

          <!-- Gestión de Reservas -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navReservas" data-section="reservas" role="menuitem" 
               aria-label="Gestionar reservas de clientes">
              <i class="bi bi-calendar-check me-2" aria-hidden="true"></i>
              <span>Gestionar Reservas</span>
            </a>
          </li>

          <!-- Gestión de Pedidos -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navPedidos" data-section="pedidos" role="menuitem" 
               aria-label="Gestión de pedidos de clientes">
              <i class="bi bi-receipt me-2" aria-hidden="true"></i>
              <span>Gestión de Pedidos</span>
            </a>
          </li>

          <!-- Estadísticas Avanzadas -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navEstadisticas" data-section="estadisticas" role="menuitem" 
              aria-label="Ver estadísticas avanzadas del restaurante">
              <i class="bi bi-graph-up me-2" aria-hidden="true"></i>
              <span>Estadísticas</span>
            </a>
          </li>

          <li role="separator"><hr class="border-secondary my-2"></li>

        </ul>
      </nav>

      <!-- Footer del Sidebar -->
      <footer class="sidebar-footer">
        <button class="btn btn-outline-danger w-100" id="logoutBtn" 
                aria-label="Cerrar sesión del panel administrativo">
          <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
          Cerrar Sesión
        </button>
      </footer>
    </aside>

    <!-- Contenido Principal -->
    <main class="admin-content" id="main-content" tabindex="-1" role="main">
      
      <!-- Navbar Superior -->
      <header class="navbar navbar-light bg-white border-bottom sticky-top shadow-sm" role="banner">
        <div class="container-fluid px-4">
          <button class="btn btn-outline-dark d-lg-none" id="toggleSidebar" 
                  aria-label="Alternar menú de navegación" 
                  aria-expanded="false" 
                  aria-controls="adminSidebar">
            <i class="bi bi-list fs-4" aria-hidden="true"></i>
          </button>
          
          <div class="d-flex align-items-center flex-grow-1 ms-3">
            <h2 class="h5 mb-0 fw-bold" id="pageTitle">Dashboard</h2>
          </div>

          <!-- Botones de acción dinámicos -->
          <div class="d-flex align-items-center gap-3" role="toolbar" aria-label="Acciones rápidas">
            <button class="btn btn-primary d-none" id="crearPlatoBtn" 
                    aria-label="Crear nuevo plato en el menú">
              <i class="bi bi-plus-circle me-1" aria-hidden="true"></i>
              Crear Plato
            </button>
            <button class="btn btn-success d-none" id="crearMesaBtn" 
                    aria-label="Crear nueva mesa en el restaurante">
              <i class="bi bi-plus-circle me-1" aria-hidden="true"></i>
              Crear Mesa
            </button>
            <span class="text-muted small d-none d-md-inline" aria-label="Usuario conectado: ${displayName}">
              <i class="bi bi-person-circle me-1" aria-hidden="true"></i>
              ${displayName}
            </span>
          </div>
        </div>
      </header>

      <!-- Contenido dinámico -->
      <div class="container-fluid p-4">
        
        <!-- SECCIÓN DASHBOARD -->
        <section id="seccionDashboard" class="content-section" aria-labelledby="dashboard-heading">
          <header class="dashboard-welcome">
            <h1 id="dashboard-heading" class="fw-bold mb-2">
              Bienvenido al Panel de Administración, ${displayName}
            </h1>
            <p class="mb-0 opacity-75">
              Gestiona tu restaurante desde este panel de control
            </p>
          </header>

          <!-- Cards principales de gestión -->
          <div class="dashboard-cards" role="list" aria-label="Opciones de gestión del restaurante">
            
            <!-- Card: Gestionar Menú -->
            <article class="dashboard-card" data-navigate="menu" role="listitem" tabindex="0"
                     aria-label="Gestionar menú del restaurante - Actualizar platos y precios">
              <div class="dashboard-card-icon primary" aria-hidden="true">
                <i class="bi bi-menu-button-wide"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h3 class="dashboard-card-content h4">Gestionar Menú</h3>
              <p class="text-muted small mb-0 mt-2">
                Actualizar platos y precios
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

            <!-- Card: Gestionar Mesas -->
            <article class="dashboard-card" data-navigate="mesas" role="listitem" tabindex="0"
                     aria-label="Gestionar mesas del restaurante - Confirmar y organizar mesas">
              <div class="dashboard-card-icon success" aria-hidden="true">
                <i class="bi bi-table"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h3 class="dashboard-card-content h4">Gestionar Mesas</h3>
              <p class="text-muted small mb-0 mt-2">
                Confirmar y organizar mesas
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

            <!-- Card: Gestionar Reservas -->
            <article class="dashboard-card" data-navigate="reservas" role="listitem" tabindex="0"
                     aria-label="Gestionar reservas - Ver y administrar reservas de clientes">
              <div class="dashboard-card-icon warning" aria-hidden="true">
                <i class="bi bi-calendar-check"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h3 class="dashboard-card-content h4">Gestionar Reservas</h3>
              <p class="text-muted small mb-0 mt-2">
                Ver y administrar reservas
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

            <!-- Card: Gestionar Pedidos -->
            <article class="dashboard-card" data-navigate="pedidos" role="listitem" tabindex="0"
                     aria-label="Gestionar Pedidos - Ver y administrar pedidos de clientes">
              <div class="dashboard-card-icon warning" aria-hidden="true">
                <i class="bi bi-receipt"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h3 class="dashboard-card-content h4">Gestionar Pedidos</h3>
              <p class="text-muted small mb-0 mt-2">
                Ver y administrar pedidos
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

            <!-- Card: Estadisticas  -->
            <article class="dashboard-card" data-navigate="estadisticas" role="listitem" tabindex="0"
                     aria-label="Estadísticas - Ver estadísticas con gráficas">
              <div class="dashboard-card-icon warning" aria-hidden="true">
                <i class="bi bi-graph-up me-2 text-info" aria-hidden="true"></i>
              </div>
              <div class="dashboard-card-title">ESTADÍSTICAS <div>
              <h3 class="dashboard-card-content h4">Estadísticas Avanzadas</h3>
              <p class="text-muted small mb-0 mt-2">
                Análisis detallado del rendimiento del restaurante
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

          </div>

          
          <div class="stats-grid" role="list" aria-label="Estadísticas del día actual">
            <!-- Estos valores ahora se cargarán dinámicamente -->
            <article class="stat-card" role="listitem">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <div class="stat-label">Total De Pedidos Hoy</div>
                  <div class="stat-value" aria-live="polite" id="total-pedidos-hoy-value">0</div>
                </div>
                <div class="stat-icon bg-primary bg-opacity-10 text-primary" aria-hidden="true">
                  <i class="bi bi-calendar"></i>
                </div>
              </div>
            </article>

            <article class="stat-card" role="listitem">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <div class="stat-label">Reservas Confirmadas</div>
                  <div class="stat-value" aria-live="polite" id="reservas-confirmadas-value">0/0</div>
                </div>
                <div class="stat-icon bg-success bg-opacity-10 text-success" aria-hidden="true">
                  <i class="bi bi-table"></i>
                </div>
              </div>
            </article>

            <article class="stat-card" role="listitem">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <div class="stat-label">Ingresos Hoy</div>
                  <div class="stat-value" aria-live="polite" id="ingresos-hoy-value">$0</div>
                </div>
                <div class="stat-icon bg-warning bg-opacity-10 text-warning" aria-hidden="true">
                  <i class="bi bi-cash-stack"></i>
                </div>
              </div>
            </article>

            <article class="stat-card" role="listitem">
              <div class="d-flex align-items-center justify-content-between">
                <div>
                  <div class="stat-label">Platos Activos</div>
                  <div class="stat-value" aria-live="polite" id="platos-activos-value">0</div>
                </div>
                <div class="stat-icon bg-info bg-opacity-10 text-info" aria-hidden="true">
                  <i class="bi bi-menu-button"></i>
                </div>
              </div>
            </article>
          </div>
        </section>

        <!-- SECCIÓN GESTIONAR MENÚ -->
        <section id="seccionMenu" class="content-section" style="display: none;" aria-labelledby="menu-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 id="menu-heading" class="fw-bold mb-1">
                <i class="bi bi-menu-button-wide me-2 text-primary" aria-hidden="true"></i>
                Gestión de Menú
              </h1>
              <p class="text-muted mb-0">Administra los platos del restaurante</p>
            </div>
          </header>
          
          <!-- Componente de lista de platos -->
          <div id="plato-list-container" role="region" aria-label="Lista de platos del menú"></div>
        </section>

        <!-- SECCIÓN GESTIONAR MESAS -->
        <section id="seccionMesas" class="content-section" style="display: none;" aria-labelledby="mesas-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 id="mesas-heading" class="fw-bold mb-1">
                <i class="bi bi-table me-2 text-success" aria-hidden="true"></i>
                Gestión de Mesas
              </h1>
              <p class="text-muted mb-0">Administra las mesas del restaurante</p>
            </div>
          </header>

          <!-- Aquí se mostrará la lista de mesas -->
          <div id="mesa-list-container" class="mt-3" role="region" aria-label="Lista de mesas del restaurante"></div>
        </section>

        <!-- SECCIÓN GESTIONAR RESERVAS -->
        <section id="seccionReservas" class="content-section" style="display: none;" aria-labelledby="reservas-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 id="reservas-heading" class="fw-bold mb-1">
                <i class="bi bi-calendar-check me-2 text-warning" aria-hidden="true"></i>
                Gestión de Reservas
              </h1>
              <p class="text-muted mb-0">Administra todas las reservas del restaurante</p>
            </div>
            <button class="btn btn-primary" id="actualizarReservasBtn">
              <i class="bi bi-arrow-clockwise me-1"></i>
              Actualizar
            </button>
          </header>

          <!-- Loading State -->
          <div id="reservas-loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando reservas...</span>
            </div>
            <p class="mt-2 text-muted">Cargando reservas...</p>
          </div>

          <!-- Contenido de Reservas -->
          <div id="reservas-content" style="display: none;">
            <div id="reservas-list-container"></div>
          </div>

          <!-- Error State -->
          <div id="reservas-error" class="alert alert-danger text-center" style="display: none;" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Error al cargar las reservas.</strong> Por favor, intente nuevamente.
          </div>
        </section>

        <!-- SECCIÓN GESTIONAR PEDIDOS -->
        <section id="seccionPedidos" class="content-section" style="display: none;" aria-labelledby="pedidos-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 id="pedidos-heading" class="fw-bold mb-1">
                <i class="bi bi-receipt me-2 text-warning" aria-hidden="true"></i>
                Gestión de Pedidos
              </h1>
            </div>
          </header>
          
          <!-- Componente de historial de pedidos -->
          <div id="historial-pedidos-container" role="region" aria-label="Historial completo de pedidos"></div>
        </section>

        <!-- SECCIÓN ESTADÍSTICAS AVANZADAS -->
        <section id="seccionEstadisticas" class="content-section" style="display: none;" aria-labelledby="estadisticas-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 id="estadisticas-heading" class="fw-bold mb-1">
                <i class="bi bi-graph-up me-2 text-info" aria-hidden="true"></i>
                Estadísticas Avanzadas
              </h1>
              <p class="text-muted mb-0">Análisis detallado del rendimiento del restaurante</p>
            </div>
            <div class="d-flex gap-2">
              <select class="form-select form-select-sm" id="rangoEstadisticas" aria-label="Seleccionar rango de tiempo">
                <option value="7">Últimos 7 días</option>
                <option value="30" selected>Últimos 30 días</option>
                <option value="90">Últimos 3 meses</option>
              </select>
            </div>
          </header>

          <!-- Loading State -->
          <div id="estadisticas-loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando estadísticas...</span>
            </div>
            <p class="mt-2 text-muted">Cargando estadísticas...</p>
          </div>

          <!-- Contenido de Estadísticas -->
          <div id="estadisticas-content" style="display: none;">
            
            <!-- Cards de Resumen -->
            <div class="row mb-4">
              <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-grow-1">
                        <h6 class="card-title text-muted mb-1">Ingresos Totales</h6>
                        <h4 class="mb-0 text-success" id="ingresos-totales">$0</h4>
                        <small class="text-muted" id="ingresos-variacion">+0% vs período anterior</small>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="bi bi-currency-dollar fs-2 text-success opacity-25"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-grow-1">
                        <h6 class="card-title text-muted mb-1">Pedidos Completados</h6>
                        <h4 class="mb-0 text-primary" id="pedidos-completados">0</h4>
                        <small class="text-muted" id="pedidos-variacion">+0% vs período anterior</small>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="bi bi-check-circle fs-2 text-primary opacity-25"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-grow-1">
                        <h6 class="card-title text-muted mb-1">Tasa de Éxito</h6>
                        <h4 class="mb-0 text-info" id="tasa-exito">0%</h4>
                        <small class="text-muted" id="tasa-variacion">+0% vs período anterior</small>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="bi bi-graph-up fs-2 text-info opacity-25"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-body">
                    <div class="d-flex align-items-center">
                      <div class="flex-grow-1">
                        <h6 class="card-title text-muted mb-1">Ticket Promedio</h6>
                        <h4 class="mb-0 text-warning" id="ticket-promedio">$0</h4>
                        <small class="text-muted" id="ticket-variacion">+0% vs período anterior</small>
                      </div>
                      <div class="flex-shrink-0">
                        <i class="bi bi-receipt fs-2 text-warning opacity-25"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Gráficos -->
            <div class="row">
              <!-- Gráfico de Ventas por Fecha -->
              <div class="col-lg-8 mb-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="card-title mb-0">Ventas por Fecha</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="chartVentas" height="300"></canvas>
                  </div>
                </div>
              </div>

              <!-- Gráfico de Platos Populares -->
              <div class="col-lg-4 mb-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="card-title mb-0">Platos Más Populares</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="chartPlatosPopulares" height="300"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <!-- Segunda fila de gráficos -->
            <div class="row">
              <!-- Distribución de Pedidos por Estado -->
              <div class="col-lg-6 mb-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="card-title mb-0">Distribución de Pedidos</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="chartDistribucionPedidos" height="250"></canvas>
                  </div>
                </div>
              </div>

              <!-- Tendencias Semanales -->
              <div class="col-lg-6 mb-4">
                <div class="card border-0 shadow-sm h-100">
                  <div class="card-header bg-white">
                    <h5 class="card-title mb-0">Tendencias Semanales</h5>
                  </div>
                  <div class="card-body">
                    <canvas id="chartTendencias" height="250"></canvas>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tabla de Platos Populares -->
            <div class="row">
              <div class="col-12">
                <div class="card border-0 shadow-sm">
                  <div class="card-header bg-white">
                    <h5 class="card-title mb-0">Top 10 Platos Más Vendidos</h5>
                  </div>
                  <div class="card-body">
                    <div class="table-responsive">
                      <table class="table table-hover" id="tablaPlatosPopulares">
                        <thead>
                          <tr>
                            <th>Plato</th>
                            <th class="text-end">Cantidad Vendida</th>
                            <th class="text-end">Ingresos Generados</th>
                          </tr>
                        </thead>
                        <tbody>
                          <!-- Los datos se llenarán dinámicamente -->
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error State -->
          <div id="estadisticas-error" class="alert alert-danger text-center" style="display: none;" role="alert">
            <i class="bi bi-exclamation-triangle me-2"></i>
            <strong>Error al cargar las estadísticas.</strong> Por favor, intente nuevamente.
          </div>
        </section>
      </div>
    </main>
  </div>

  <!-- Overlay para móvil -->
  <div class="sidebar-overlay" id="sidebarOverlay" aria-hidden="true"></div>

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
    .nav-link:focus-visible,
    .dashboard-card:focus-visible {
      outline: 3px solid #0d6efd;
      outline-offset: 2px;
      box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
    }

    .dashboard-card:focus-within {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
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
      
      .nav-link {
        border: 1px solid transparent;
      }
      
      .nav-link.active {
        border-color: #000;
      }
    }

    /* Movimiento reducido */
    @media (prefers-reduced-motion: reduce) {
      .dashboard-card {
        transition: none;
      }
      
      .dashboard-card:focus-within {
        transform: none;
      }
    }

    /* Mejoras de enfoque para sidebar */
    .admin-sidebar .btn:focus-visible,
    .admin-sidebar .nav-link:focus-visible {
      outline-color: #fff;
    }
  </style>
`;

  // ========================================
  // INICIALIZACIÓN Y CONFIGURACIÓN
  // ========================================

  // Función para anuncios de screen reader
  function announceToScreenReader(message) {
    const announcer = page.querySelector('#ariaAnnouncer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  // Cargar componentes de forma asíncrona
  setTimeout(() => {
    initializeComponents();
    setupEventListeners();
    announceToScreenReader('Panel de administración cargado correctamente');
  }, 100);

  function initializeComponents() {
    // Cargar componente de platos
    const platoContainer = page.querySelector('#plato-list-container');
    if (platoContainer) {
      platoContainer.appendChild(PlatoList(true)); // true = modo admin con CRUD
    }

    // Cargar componente de mesas
    const mesaContainer = page.querySelector("#mesa-list-container");
    if (mesaContainer) {
      MesasList().then(mesasComponent => {
        if (mesasComponent instanceof Node) {
          mesaContainer.appendChild(mesasComponent);
        } else {
          console.warn("⚠️ MesasList no devolvió un nodo válido");
        }
      }).catch(error => {
        console.error("❌ Error cargando componente de mesas:", error);
      });
    }

    // Inicializar estadisticas avanzadas
    estadisticasAvanzadas = new EstadisticasAvanzadas();

    // Inicializar la lista de reservas
    listaReservasAdmin = new ListaReservasAdmin();

    cargarEstadisticasDashboard();
  }

  async function cargarEstadisticasDashboard() {
    try {
      const estadisticasHoy = await estadisticasAvanzadasService.obtenerEstadisticasHoy();
      
      // Formatear montos
      const formatter = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
      });

      document.getElementById('total-pedidos-hoy-value').textContent = estadisticasHoy.totalPedidosHoy || 0;
      document.getElementById('reservas-confirmadas-value').textContent = estadisticasHoy.reservasConfirmadasHoy || 0;
      document.getElementById('ingresos-hoy-value').textContent = formatter.format(estadisticasHoy.ingresosHoy || 0);
      document.getElementById('platos-activos-value').textContent = estadisticasHoy.platosActivos || 0;
      
    } catch (error) {
      console.error('Error cargando estadísticas del dashboard:', error);
    }
  }



  function setupEventListeners() {
    setupSidebarNavigation();
    setupActionButtons();
    setupDashboardCards();
  }

  function setupSidebarNavigation() {
    const sidebar = page.querySelector('#adminSidebar');
    const overlay = page.querySelector('#sidebarOverlay');
    const toggleBtn = page.querySelector('#toggleSidebar');

    // Toggle Sidebar (móvil)
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const isExpanded = sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
        toggleBtn.setAttribute('aria-expanded', isExpanded.toString());
        announceToScreenReader(isExpanded ? 'Menú de navegación abierto' : 'Menú de navegación cerrado');
      });
    }

    overlay.addEventListener('click', () => {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
      toggleBtn.setAttribute('aria-expanded', 'false');
      announceToScreenReader('Menú de navegación cerrado');
    });

    // Navegación entre secciones
    const navLinks = page.querySelectorAll('.sidebar-nav .nav-link:not(.disabled)');
    
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const section = link.dataset.section;
        if (section) navigateToSection(section);
      });

      // Soporte para teclado
      link.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const section = link.dataset.section;
          if (section) navigateToSection(section);
        }
      });
    });
  }

  function setupActionButtons() {
    // Botones de acción dinámicos
    const crearPlatoBtn = page.querySelector('#crearPlatoBtn');
    const crearMesaBtn = page.querySelector('#crearMesaBtn');
    const logoutBtn = page.querySelector('#logoutBtn');

    // Botón Crear Plato
    if (crearPlatoBtn) {
      crearPlatoBtn.addEventListener('click', () => {
        announceToScreenReader('Abriendo página para crear nuevo plato');
        console.log('Abriendo página de crear plato...');
        router.navigate('/admin/platos/crear');
      });
    }

    // Botón Crear Mesa
    if (crearMesaBtn) {
      crearMesaBtn.addEventListener('click', () => {
        announceToScreenReader('Abriendo modal para crear nueva mesa');
        CrearMesaModal();
      });
    }

    // Logout
    if (logoutBtn) {
      logoutBtn.addEventListener('click', async () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión del panel administrativo?')) {
          announceToScreenReader('Cerrando sesión del panel administrativo...');
          try {
            await logout();
            announceToScreenReader('Sesión cerrada correctamente');
          } catch (error) {
            console.error('Error al cerrar sesión:', error);
            announceToScreenReader('Error al cerrar sesión');
            localStorage.clear();
            router.navigate('/login');
          }
        } else {
          announceToScreenReader('Cierre de sesión cancelado');
        }
      });
    }
  }

  function setupDashboardCards() {
    // Click en dashboard cards
    page.querySelectorAll('.dashboard-card[data-navigate]').forEach(card => {
      card.addEventListener('click', () => {
        const section = card.dataset.navigate;
        if (section) navigateToSection(section);
      });

      // Soporte para teclado
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const section = card.dataset.navigate;
          if (section) navigateToSection(section);
        }
      });
    });
  }

  function navigateToSection(sectionName) {
    // Actualizar nav links
    const navLinks = page.querySelectorAll('.sidebar-nav .nav-link:not(.disabled)');
    navLinks.forEach(l => {
      l.classList.remove('active');
      l.removeAttribute('aria-current');
    });
    
    const activeLink = page.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
      activeLink.setAttribute('aria-current', 'page');
    }

    // Mostrar sección
    const sections = {
      dashboard: page.querySelector('#seccionDashboard'),
      menu: page.querySelector('#seccionMenu'),
      mesas: page.querySelector('#seccionMesas'),
      reservas: page.querySelector('#seccionReservas'),
      pedidos: page.querySelector('#seccionPedidos'),
      estadisticas: page.querySelector('#seccionEstadisticas')
    };

    Object.values(sections).forEach(s => {
      if (s) s.style.display = 'none';
    });
    
    if (sections[sectionName]) {
      sections[sectionName].style.display = 'block';
    }

    // Actualizar título y botones según la sección
    const pageTitle = page.querySelector('#pageTitle');
    const crearPlatoBtn = page.querySelector('#crearPlatoBtn');
    const crearMesaBtn = page.querySelector('#crearMesaBtn');
    
    const sectionTitles = {
      dashboard: 'Dashboard',
      menu: 'Gestionar Menú',
      mesas: 'Gestionar Mesas',
      reservas: 'Gestionar Reservas',
      pedidos: 'Gestión de Pedidos',
      estadisticas: 'Estadísticas Avanzadas'
    };

    if (pageTitle) {
      pageTitle.textContent = sectionTitles[sectionName] || 'Dashboard';
    }

    // Mostrar/ocultar botones de acción
    if (crearPlatoBtn && crearMesaBtn) {
      crearPlatoBtn.classList.add('d-none');
      crearMesaBtn.classList.add('d-none');

      switch(sectionName) {
        case 'menu':
          crearPlatoBtn.classList.remove('d-none');
          break;
        case 'mesas':
          crearMesaBtn.classList.remove('d-none');
          break;
        // Para pedidos no mostramos botones de creación
      }
    }

    // Cargar componentes específicos cuando se navega a esa sección
    if (sectionName === 'pedidos') {
      loadPedidosComponent();
    }

    // Anunciar cambio de sección
    const sectionNames = {
      dashboard: 'Dashboard principal',
      menu: 'Gestión de menú',
      mesas: 'Gestión de mesas',
      reservas: 'Gestión de reservas',
      pedidos: 'Gestión de pedidos',
      estadisticas: 'Estadísticas avanzadas'
    };

    announceToScreenReader(`Navegando a ${sectionNames[sectionName] || 'sección'}`);

    // Cerrar sidebar en móvil
    if (window.innerWidth < 992) {
      const sidebar = page.querySelector('#adminSidebar');
      const overlay = page.querySelector('#sidebarOverlay');
      const toggleBtn = page.querySelector('#toggleSidebar');
      
      if (sidebar) sidebar.classList.remove('show');
      if (overlay) overlay.classList.remove('show');
      if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
    }

    // Inicializar estadísticas cuando se navega a esa sección
    if (sectionName === 'estadisticas') {
      setTimeout(() => {
        estadisticasAvanzadas.initialize();
      }, 100);
    }

    // Inicializar las reservas cuando se navega a esa sección
    if (sectionName === 'reservas') {
      setTimeout(() => {
        listaReservasAdmin.initialize();
      }, 100);
    }
  }

  function loadPedidosComponent() {
    const pedidosContainer = page.querySelector('#historial-pedidos-container');
    if (pedidosContainer) {
      // Limpiar contenedor
      pedidosContainer.innerHTML = `
        <div class="text-center py-4">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando pedidos...</span>
          </div>
          <p class="mt-2 text-muted">Cargando historial de pedidos...</p>
        </div>
      `;
      
      // Inicializar componente de pedidos
      setTimeout(() => {
        const historialComponent = new HistorialPedidosAdminComponent();
        historialComponent.initialize();
      }, 100);
    }
  }

  return page;
}