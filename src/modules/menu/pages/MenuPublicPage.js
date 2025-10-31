// src/modules/menu/pages/MenuPublicPage.js
import { PlatoList } from '../components/PlatoList.js';
import { router } from '../../../router.js';
import { logout, isAuthenticated, getCurrentUser } from '../../auth/userService.js';
import { CarritoOffcanvas } from '../../carrito/components/CarritoOffcanvas.js';
import { CarritoButton } from '../../carrito/components/CarritoButton.js';

export function MenuPublicPage() {
  const page = document.createElement('div');
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;
  const userName = user?.email?.split('@')[0] || 'Usuario';

  page.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" id="homeLink">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias ${authenticated ? `- ${userName}` : ''}
        </a>
        <button class="btn btn-outline-warning btn-sm me-2" id="crearPlatoBtn">
            <i class="bi bi-plus-circle me-1"></i>
            Crear Plato
        </button>
        <div class="d-flex align-items-center gap-2">
          ${authenticated ? `
            <!-- Botón del carrito en el navbar -->
            <button 
              class="btn btn-outline-light btn-sm position-relative" 
              id="carritoNavBtn"
              data-bs-toggle="offcanvas" 
              data-bs-target="#carritoOffcanvas"
            >
              <i class="bi bi-cart3"></i>
              <span class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle" id="carritoBadge" style="display: none;">
                0
              </span>
            </button>
          ` : ''}
          
          <button class="btn btn-outline-light btn-sm" id="backBtn">
            <i class="bi bi-arrow-left me-1"></i>
            Volver
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
    
    <!-- Espacio para navbar fixed -->
    <div style="height: 80px;"></div>
    
    <!-- Contenido principal -->
    <div class="container my-4">
      <div class="row">
        <div class="col-12">
          <h1 class="fw-bold text-dark mb-1">
            <i class="bi bi-menu-button me-2"></i>
            Nuestro Menú
          </h1>
          <p class="text-muted mb-4">Descubre nuestros deliciosos platos</p>
          
          ${!authenticated ? `
            <div class="alert alert-info alert-dismissible fade show" role="alert">
              <i class="bi bi-info-circle me-2"></i>
              <strong>¡Hola!</strong> Inicia sesión para hacer pedidos y disfrutar de promociones exclusivas.
              <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
          ` : ''}
          
          <!-- Componente de lista de platos -->
          <div id="plato-list-container"></div>
        </div>
      </div>
    </div>
  `;

  // Agregar componentes
  const container = page.querySelector('#plato-list-container');
  container.appendChild(PlatoList(false));

  // Agregar carrito solo si está autenticado
  if (authenticated) {
    // Agregar offcanvas del carrito
    page.appendChild(CarritoOffcanvas());
    
    // Agregar botón flotante del carrito
    page.appendChild(CarritoButton());

    // DEBUG: Mostrar estado del carrito en consola
    window.debugCarrito = () => {
      import('../../carrito/carritoService.js').then(({ obtenerCarrito, obtenerResumenCarrito }) => {
        console.log('🛒 Estado actual del carrito:');
        console.log('Items:', obtenerCarrito());
        console.log('Resumen:', obtenerResumenCarrito());
      });
    };
  
  
    // Actualizar badge del navbar
    actualizarBadgeNavbar();
    window.addEventListener('carritoActualizado', actualizarBadgeNavbar);
  }

  // Event listeners
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  page.querySelector('#backBtn').addEventListener('click', () => {
    router.navigate('/');
  });

  // LOGOUT ACTUALIZADO - Solo si está autenticado
  const logoutBtn = page.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        console.log('Cerrando sesión...');
        logout(); // Esta función ya es async internamente
      }
    });
  }

  // BOTONES DE LOGIN/REGISTER - Solo si NO está autenticado
  const loginBtn = page.querySelector('#loginBtn');
  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      router.navigate('/login');
    });
  }

  const registerBtn = page.querySelector('#registerBtn');
  if (registerBtn) {
    registerBtn.addEventListener('click', () => {
      router.navigate('/register');
    });
  }

  page.querySelector('#crearPlatoBtn').addEventListener('click', () => {
    window.open('src/modules/admin/crear-plato/index.html', '_blank');
  });

  return page;
}

// Función para actualizar el badge del navbar
function actualizarBadgeNavbar() {
  import('../../carrito/carritoService.js').then(({ obtenerCantidadTotal }) => {
    const badge = document.getElementById('carritoBadge');
    if (badge) {
      const cantidad = obtenerCantidadTotal();
      if (cantidad > 0) {
        badge.textContent = cantidad > 99 ? '99+' : cantidad;
        badge.style.display = 'inline-block';
      } else {
        badge.style.display = 'none';
      }
    }
  });
}