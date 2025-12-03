// src/modules/admin/pages/MenuManagementPage.js
import { PlatoList } from '../../menu/components/PlatoList.js';
import { router } from '../../../router.js';
import { logout, getCurrentUser } from '../../auth/userService.js';

export function MenuManagementPage() {
  const page = document.createElement('div');
  const user = getCurrentUser();
  const userName = user?.email?.split('@')[0] || 'Admin';

  page.innerHTML = `
    <!-- Layout con Sidebar -->
    <div class="admin-layout">
      <!-- Sidebar -->
      <aside class="admin-sidebar bg-dark text-white" id="adminSidebar">
        <!-- Header del Sidebar -->
        <div class="sidebar-header p-3 border-bottom border-secondary">
          <div class="d-flex align-items-center">
            <i class="bi bi-egg-fried fs-3 me-2 text-warning"></i>
            <div>
              <h5 class="mb-0 fw-bold">Panel Admin</h5>
              <small class="text-muted">${userName}</small>
            </div>
          </div>
        </div>

        <!-- Navegación del Sidebar -->
        <nav class="sidebar-nav">
          <ul class="nav flex-column">
            <!-- Dashboard -->
            <li class="nav-item">
              <a href="#" class="nav-link active" id="navDashboard" data-section="dashboard">
                <i class="bi bi-speedometer2 me-2"></i>
                <span>Dashboard</span>
              </a>
            </li>

            <!-- Gestión de Menú -->
            <li class="nav-item">
              <a href="#" class="nav-link" id="navMenu" data-section="menu">
                <i class="bi bi-menu-button-wide me-2"></i>
                <span>Gestionar Menú</span>
              </a>
            </li>

            <!-- Gestión de Mesas -->
            <li class="nav-item">
              <a href="#" class="nav-link" id="navMesas" data-section="mesas">
                <i class="bi bi-table me-2"></i>
                <span>Gestionar Mesas</span>
              </a>
            </li>

            <!-- Gestión de Reservas -->
            <li class="nav-item">
              <a href="#" class="nav-link" id="navReservas" data-section="reservas">
                <i class="bi bi-calendar-check me-2"></i>
                <span>Gestionar Reservas</span>
              </a>
            </li>

            <li><hr class="border-secondary my-2"></li>

            <!-- Pedidos (próximamente) -->
            <li class="nav-item">
              <a href="#" class="nav-link disabled">
                <i class="bi bi-receipt me-2"></i>
                <span>Pedidos</span>
                <span class="badge bg-secondary ms-auto">Próximo</span>
              </a>
            </li>

            <!-- Facturación (próximamente) -->
            <li class="nav-item">
              <a href="#" class="nav-link disabled">
                <i class="bi bi-receipt-cutoff me-2"></i>
                <span>Facturación</span>
                <span class="badge bg-secondary ms-auto">Próximo</span>
              </a>
            </li>
          </ul>
        </nav>


        <!-- Footer del Sidebar -->
        <div class="sidebar-footer mt-auto p-3 border-top border-secondary">
          <button class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" id="logoutBtn">
            <i class="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <main class="admin-content">
        <!-- Navbar Superior -->
        <nav class="navbar navbar-light bg-white border-bottom sticky-top shadow-sm">
          <div class="container-fluid">
            <!-- Toggle Sidebar (móvil) -->
            <button class="btn btn-outline-dark d-lg-none" id="toggleSidebar">
              <i class="bi bi-list fs-4"></i>
            </button>

            <!-- Breadcrumb -->
            <div class="d-flex align-items-center flex-grow-1 ms-3">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <a href="#" id="homeLink" class="text-decoration-none">
                      <i class="bi bi-house-door me-1"></i>
                      Inicio
                    </a>
                  </li>
                  <li class="breadcrumb-item active" id="currentSection">Gestión de Menú</li>
                </ol>
              </nav>
            </div>

            <!-- Acciones rápidas -->
            <div class="d-flex gap-2">
              <button class="btn btn-primary" id="crearPlatoBtn">
                <i class="bi bi-plus-circle me-1"></i>
                Crear Plato
              </button>
            </div>
          </div>
        </nav>

        <!-- Contenido dinámico -->
        <div class="container-fluid p-4">
          <!-- Sección de Menú (activa por defecto) -->
          <div id="seccionMenu" class="content-section active">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 class="fw-bold mb-1">
                  <i class="bi bi-menu-button-wide me-2 text-primary"></i>
                  Gestión de Menú
                </h2>
                <p class="text-muted mb-0">Administra los platos del restaurante</p>
              </div>
            </div>
            
            <!-- Componente de lista de platos -->
            <div id="plato-list-container"></div>
          </div>

          <!-- Sección de Reservas/Mesas (oculta por defecto) -->
          <div id="seccionReservas" class="content-section" style="display: none;">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 class="fw-bold mb-1">
                  <i class="bi bi-table me-2 text-primary"></i>
                  Gestión de Mesas
                </h2>
                <p class="text-muted mb-0">Administra las mesas y reservas del restaurante</p>
              </div>
              <button class="btn btn-success" id="crearMesaBtn">
                <i class="bi bi-plus-circle me-1"></i>
                Crear Mesa
              </button>
            </div>

            <!-- Contenido de mesas (placeholder) -->
            <div class="alert alert-info">
              <i class="bi bi-info-circle me-2"></i>
              <strong>Próximamente:</strong> Aquí podrás gestionar las mesas del restaurante.
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Estilos CSS -->
  
  `;

  // Agregar overlay para móvil
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebarOverlay';
  page.appendChild(overlay);

  // Agregar el componente de lista de platos
  setTimeout(() => {
    const container = page.querySelector('#plato-list-container');
    if (container) {
      container.appendChild(PlatoList(true));
    }
  }, 100);

  // ========================================
  // EVENT LISTENERS
  // ========================================

  // Toggle Sidebar (móvil)
  const toggleSidebarBtn = page.querySelector('#toggleSidebar');
  const sidebar = page.querySelector('#adminSidebar');
  const sidebarOverlay = overlay;

  if (toggleSidebarBtn) {
    toggleSidebarBtn.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      sidebarOverlay.classList.toggle('show');
    });
  }

  // Cerrar sidebar al hacer click en overlay
  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('show');
    sidebarOverlay.classList.remove('show');
  });

  // Navegación entre secciones
  const navLinks = page.querySelectorAll('.sidebar-nav .nav-link:not(.disabled)');
  const sections = {
    menu: page.querySelector('#seccionMenu'),
    reservas: page.querySelector('#seccionReservas')
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;

      if (!section) return;

      // Actualizar nav links
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');

      // Mostrar sección correspondiente
      Object.values(sections).forEach(s => s.style.display = 'none');
      if (sections[section]) {
        sections[section].style.display = 'block';
      }

      // Actualizar breadcrumb
      const breadcrumb = page.querySelector('#currentSection');
      if (breadcrumb) {
        breadcrumb.textContent = link.querySelector('span').textContent;
      }

      // Actualizar botón de acción principal
      const crearPlatoBtn = page.querySelector('#crearPlatoBtn');
      const crearMesaBtn = page.querySelector('#crearMesaBtn');
      
      if (section === 'menu') {
        crearPlatoBtn.style.display = 'block';
      } else {
        crearPlatoBtn.style.display = 'none';
      }

      // Cerrar sidebar en móvil
      if (window.innerWidth < 992) {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
      }
    });
  });

  // Home link
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  // Logout
  page.querySelector('#logoutBtn').addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        console.log('👋 Cerrando sesión...');
        await logout();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        localStorage.clear();
        router.navigate('/login');
      }
    }
  });

  // Crear Plato
  page.querySelector('#crearPlatoBtn').addEventListener('click', () => {
    console.log('🔄 Abriendo página de crear plato...');
    router.navigate('/admin/platos/crear');
  });

  // Crear Mesa (placeholder)
  const crearMesaBtn = page.querySelector('#crearMesaBtn');
  if (crearMesaBtn) {
    crearMesaBtn.addEventListener('click', () => {
      alert('Funcionalidad de crear mesa - Próximamente');
    });
  }

  return page;
}