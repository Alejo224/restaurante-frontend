// src/modules/admin/pages/AdminDashboard.js
import { router } from '../../../router.js';
import { logout, getCurrentUser } from '../../auth/userService.js';
import { PlatoList } from '../../menu/components/PlatoList.js';

export function AdminDashboard() {
  const page = document.createElement('div');
  const user = getCurrentUser();
  const userName = user?.email?.split('@')[0] || 'Administrador';

  page.innerHTML = `
  <!-- Layout con Sidebar -->
  <div class="admin-layout" role="main">
    
    <!-- Sidebar - Navegación principal -->
    <aside class="admin-sidebar" id="adminSidebar" aria-label="Navegación principal">
      <!-- Header del Sidebar -->
      <header class="sidebar-header" role="banner">
        <div class="d-flex align-items-center">
          <i class="bi bi-egg-fried fs-3 me-2 text-warning" aria-hidden="true"></i>
          <div>
            <h1 class="h5 mb-0 fw-bold text-white">Panel Administrativo</h1>
            <small class="text-panel" aria-label="Usuario actual">${userName}</small>
          </div>
        </div>
      </header>

      <!-- Navegación del Sidebar -->
      <nav class="sidebar-nav" aria-label="Menú de administración">
        <ul class="nav flex-column" role="menubar">
          <!-- Dashboard -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link active" id="navDashboard" data-section="dashboard" role="menuitem" aria-current="page">
              <i class="bi bi-speedometer2 me-2" aria-hidden="true"></i>
              <span>Dashboard</span>
            </a>
          </li>

          <!-- Gestión de Menú -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navMenu" data-section="menu" role="menuitem">
              <i class="bi bi-menu-button-wide me-2" aria-hidden="true"></i>
              <span>Gestionar Menú</span>
            </a>
          </li>

          <!-- Gestión de Mesas -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navMesas" data-section="mesas" role="menuitem">
              <i class="bi bi-table me-2" aria-hidden="true"></i>
              <span>Gestionar Mesas</span>
            </a>
          </li>

          <!-- Gestión de Reservas -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link" id="navReservas" data-section="reservas" role="menuitem">
              <i class="bi bi-calendar-check me-2" aria-hidden="true"></i>
              <span>Gestionar Reservas</span>
            </a>
          </li>

          <li role="separator"><hr class="border-secondary my-2"></li>

          <!-- Pedidos (próximamente) -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link disabled" aria-disabled="true" role="menuitem">
              <i class="bi bi-receipt me-2" aria-hidden="true"></i>
              <span>Pedidos</span>
              <span class="badge bg-secondary ms-auto">Próximo</span>
            </a>
          </li>

          <!-- Facturación (próximamente) -->
          <li class="nav-item" role="none">
            <a href="#" class="nav-link disabled" aria-disabled="true" role="menuitem">
              <i class="bi bi-receipt-cutoff me-2" aria-hidden="true"></i>
              <span>Facturación</span>
              <span class="badge bg-secondary ms-auto">Próximo</span>
            </a>
          </li>
        </ul>
      </nav>

      <!-- Footer del Sidebar -->
      <footer class="sidebar-footer">
        <button class="btn btn-outline-danger w-100" id="logoutBtn" aria-label="Cerrar sesión">
          <i class="bi bi-box-arrow-right me-2" aria-hidden="true"></i>
          Cerrar Sesión
        </button>
      </footer>
    </aside>

    <!-- Contenido Principal -->
    <main class="admin-content" id="main-content" tabindex="-1">
      
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
            <button class="btn btn-primary d-none" id="crearPlatoBtn" aria-label="Crear nuevo plato">
              <i class="bi bi-plus-circle me-1" aria-hidden="true"></i>
              Crear Plato
            </button>
            <button class="btn btn-success d-none" id="crearMesaBtn" aria-label="Crear nueva mesa">
              <i class="bi bi-plus-circle me-1" aria-hidden="true"></i>
              Crear Mesa
            </button>
            <span class="text-muted small d-none d-md-inline" aria-label="Usuario conectado">
              <i class="bi bi-person-circle me-1" aria-hidden="true"></i>
              ${userName}
            </span>
          </div>
        </div>
      </header>

      <!-- Contenido dinámico -->
      <div class="container-fluid p-4">
        
        <!-- SECCIÓN DASHBOARD -->
        <section id="seccionDashboard" class="content-section" aria-labelledby="dashboard-heading">
          <header class="dashboard-welcome">
            <h3 id="dashboard-heading" class="fw-bold mb-2">
              Bienvenido al Panel de Administración, ${userName}
            </h3>
            <p class="mb-0 opacity-75">
              Gestiona tu restaurante desde este panel de control
            </p>
          </header>

          <!-- Cards principales de gestión -->
          <div class="dashboard-cards" role="list" aria-label="Opciones de gestión">
            
            <!-- Card: Gestionar Menú -->
            <article class="dashboard-card" data-navigate="menu" role="listitem" tabindex="0">
              <div class="dashboard-card-icon primary" aria-hidden="true">
                <i class="bi bi-menu-button-wide"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h4 class="dashboard-card-content">Gestionar Menú</h4>
              <p class="text-muted small mb-0 mt-2">
                Actualizar platos y precios
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

            <!-- Card: Gestionar Mesas -->
            <article class="dashboard-card" data-navigate="mesas" role="listitem" tabindex="0">
              <div class="dashboard-card-icon success" aria-hidden="true">
                <i class="bi bi-table"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h4 class="dashboard-card-content">Gestionar Mesas</h4>
              <p class="text-muted small mb-0 mt-2">
                Confirmar y organizar mesas
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

            <!-- Card: Gestionar Reservas -->
            <article class="dashboard-card" data-navigate="reservas" role="listitem" tabindex="0">
              <div class="dashboard-card-icon warning" aria-hidden="true">
                <i class="bi bi-calendar-check"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h4 class="dashboard-card-content">Gestionar Reservas</h4>
              <p class="text-muted small mb-0 mt-2">
                Ver y administrar reservas
              </p>
              <div class="dashboard-card-action">
                Ver más
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </div>
            </article>

            <!-- Card: Facturación (próximamente) -->
            <article class="dashboard-card" style="opacity: 0.6;" role="listitem" aria-disabled="true">
              <div class="dashboard-card-icon info" aria-hidden="true">
                <i class="bi bi-receipt-cutoff"></i>
              </div>
              <div class="dashboard-card-title">GESTIÓN</div>
              <h4 class="dashboard-card-content">Facturación</h4>
              <p class="text-muted small mb-0 mt-2">
                Generar y gestionar facturas
              </p>
              <span class="badge bg-secondary mt-2">Próximamente</span>
            </article>
          </div>

          <!-- Estadísticas rápidas -->
          <section aria-labelledby="estadisticas-heading">
            <header class="row mt-4">
              <div class="col-12">
                <h5 id="estadisticas-heading" class="fw-bold mb-3">Estadísticas de Hoy</h5>
              </div>
            </header>

            <div class="stats-grid" role="list" aria-label="Estadísticas del día">
              
              <!-- Reservas Hoy -->
              <article class="stat-card" role="listitem">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="stat-label">Reservas Hoy</div>
                    <div class="stat-value" aria-live="polite">12</div>
                  </div>
                  <div class="stat-icon bg-primary bg-opacity-10 text-primary" aria-hidden="true">
                    <i class="bi bi-calendar"></i>
                  </div>
                </div>
              </article>

              <!-- Mesas Ocupadas -->
              <article class="stat-card" role="listitem">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="stat-label">Mesas Ocupadas</div>
                    <div class="stat-value" aria-live="polite">8/15</div>
                  </div>
                  <div class="stat-icon bg-success bg-opacity-10 text-success" aria-hidden="true">
                    <i class="bi bi-table"></i>
                  </div>
                </div>
              </article>

              <!-- Ingresos Hoy -->
              <article class="stat-card" role="listitem">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="stat-label">Ingresos Hoy</div>
                    <div class="stat-value" aria-live="polite">$1,234</div>
                  </div>
                  <div class="stat-icon bg-warning bg-opacity-10 text-warning" aria-hidden="true">
                    <i class="bi bi-cash-stack"></i>
                  </div>
                </div>
              </article>

              <!-- Platos Disponibles -->
              <article class="stat-card" role="listitem">
                <div class="d-flex align-items-center justify-content-between">
                  <div>
                    <div class="stat-label">Platos Activos</div>
                    <div class="stat-value" aria-live="polite">45</div>
                  </div>
                  <div class="stat-icon bg-info bg-opacity-10 text-info" aria-hidden="true">
                    <i class="bi bi-menu-button"></i>
                  </div>
                </div>
              </article>
            </div>
          </section>
        </section>

        <!-- SECCIÓN GESTIONAR MENÚ -->
        <section id="seccionMenu" class="content-section" style="display: none;" aria-labelledby="menu-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 id="menu-heading" class="fw-bold mb-1">
                <i class="bi bi-menu-button-wide me-2 text-primary" aria-hidden="true"></i>
                Gestión de Menú
              </h2>
              <p class="text-muted mb-0">Administra los platos del restaurante</p>
            </div>
          </header>
          
          <!-- Componente de lista de platos -->
          <div id="plato-list-container" role="region" aria-label="Lista de platos"></div>
        </section>

        <!-- SECCIÓN GESTIONAR MESAS -->
        <section id="seccionMesas" class="content-section" style="display: none;" aria-labelledby="mesas-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 id="mesas-heading" class="fw-bold mb-1">
                <i class="bi bi-table me-2 text-success" aria-hidden="true"></i>
                Gestión de Mesas
              </h2>
              <p class="text-muted mb-0">Administra las mesas del restaurante</p>
            </div>
          </header>

          <div class="alert alert-info" role="status">
            <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
            <strong>Esperando:</strong> Aquí va el componente de gestión de mesas (MesasList.js)
          </div>
        </section>

        <!-- SECCIÓN GESTIONAR RESERVAS -->
        <section id="seccionReservas" class="content-section" style="display: none;" aria-labelledby="reservas-heading">
          <header class="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 id="reservas-heading" class="fw-bold mb-1">
                <i class="bi bi-calendar-check me-2 text-warning" aria-hidden="true"></i>
                Gestión de Reservas
              </h2>
              <p class="text-muted mb-0">Ver y administrar reservas de clientes</p>
            </div>
          </header>

          <div class="alert alert-warning" role="status">
            <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
            <strong>Próximamente:</strong> Aquí verás las reservas realizadas por los clientes
          </div>
        </section>
      </div>
    </main>
  </div>

  <!-- Overlay para móvil -->
  <div class="sidebar-overlay" id="sidebarOverlay" aria-hidden="true"></div>
`;

  // ========================================
  // CARGAR COMPONENTE DE PLATOS
  // ========================================
  setTimeout(() => {
    const platoContainer = page.querySelector('#plato-list-container');
    if (platoContainer) {
      platoContainer.appendChild(PlatoList(true)); // true = modo admin con CRUD
    }
  }, 100);

  // ========================================
  // EVENT LISTENERS
  // ========================================

  // Toggle Sidebar (móvil)
  const sidebar = page.querySelector('#adminSidebar');
  const overlay = page.querySelector('#sidebarOverlay');
  const toggleBtn = page.querySelector('#toggleSidebar');

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      overlay.classList.toggle('show');
    });
  }

  overlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    overlay.classList.remove('show');
  });

  // Navegación entre secciones
  const navLinks = page.querySelectorAll('.sidebar-nav .nav-link:not(.disabled)');
  const sections = {
    dashboard: page.querySelector('#seccionDashboard'),
    menu: page.querySelector('#seccionMenu'),
    mesas: page.querySelector('#seccionMesas'),
    reservas: page.querySelector('#seccionReservas')
  };

  // Botones de acción dinámicos
  const crearPlatoBtn = page.querySelector('#crearPlatoBtn');
  const crearMesaBtn = page.querySelector('#crearMesaBtn');

  function navigateToSection(sectionName) {
    // Actualizar nav links
    navLinks.forEach(l => l.classList.remove('active'));
    const activeLink = page.querySelector(`[data-section="${sectionName}"]`);
    if (activeLink) activeLink.classList.add('active');

    // Mostrar sección
    Object.values(sections).forEach(s => s.style.display = 'none');
    if (sections[sectionName]) {
      sections[sectionName].style.display = 'block';
    }

    // Actualizar título y botones según la sección
    const pageTitle = page.querySelector('#pageTitle');
    
    switch(sectionName) {
      case 'dashboard':
        pageTitle.textContent = 'Dashboard';
        crearPlatoBtn.classList.add('d-none');
        crearMesaBtn.classList.add('d-none');
        break;
      
      case 'menu':
        pageTitle.textContent = 'Gestionar Menú';
        crearPlatoBtn.classList.remove('d-none');
        crearMesaBtn.classList.add('d-none');
        break;
      
      case 'mesas':
        pageTitle.textContent = 'Gestionar Mesas';
        crearPlatoBtn.classList.add('d-none');
        crearMesaBtn.classList.remove('d-none');
        break;
      
      case 'reservas':
        pageTitle.textContent = 'Gestionar Reservas';
        crearPlatoBtn.classList.add('d-none');
        crearMesaBtn.classList.add('d-none');
        break;
    }

    // Cerrar sidebar en móvil
    if (window.innerWidth < 992) {
      sidebar.classList.remove('show');
      overlay.classList.remove('show');
    }
  }

  // Click en nav links del sidebar
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      if (section) navigateToSection(section);
    });
  });

  // Click en dashboard cards
  page.querySelectorAll('.dashboard-card[data-navigate]').forEach(card => {
    card.addEventListener('click', () => {
      const section = card.dataset.navigate;
      if (section) navigateToSection(section);
    });
  });

  // Botón Crear Plato
  crearPlatoBtn.addEventListener('click', () => {
    console.log('Abriendo página de crear plato...');
    window.open('src/modules/admin/crear-plato/index.html', '_blank');
  });

  // Botón Crear Mesa (placeholder para tu compañero)
  crearMesaBtn.addEventListener('click', () => {
    alert('Funcionalidad de crear mesa - Hola mundo');
  });

  // Logout
  page.querySelector('#logoutBtn').addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        localStorage.clear();
        router.navigate('/login');
      }
    }
  });

  return page;
}

