// src/modules/menu/pages/MenuPublicPage.js
import { PlatoList } from '../components/PlatoList.js';
import { router } from '../../../router.js';
import { logout, isAuthenticated, getCurrentUser } from '../../auth/userService.js';
import { CarritoOffcanvas } from '../../carrito/components/CarritoOffcanvas.js';
import { CarritoButton } from '../../carrito/components/CarritoButton.js';

export function MenuPublicPage() {
  const page = document.createElement('div');
  page.setAttribute('role', 'main');
  page.setAttribute('aria-label', 'Menú del restaurante Sabores & Delicias');
  
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
          ${authenticated ? `
            <!-- Botón del carrito en el navbar -->
            <button 
              class="btn btn-outline-light btn-sm position-relative" 
              id="carritoNavBtn"
              data-bs-toggle="offcanvas" 
              data-bs-target="#carritoOffcanvas"
              aria-label="Ver carrito de compras"
              aria-expanded="false"
              aria-controls="carritoOffcanvas"
            >
              <i class="bi bi-cart3" aria-hidden="true"></i>
              <span class="badge bg-danger rounded-pill position-absolute top-0 start-100 translate-middle" 
                    id="carritoBadge" 
                    style="display: none;"
                    aria-live="polite">
                0
              </span>
            </button>
          ` : ''}
          
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
    
    <!-- Espacio para el navbar fijo -->
    <div style="height: 80px;" aria-hidden="true"></div>
    
    <!-- Contenido Principal -->
    <div class="container my-4" id="main-content" tabindex="-1">
      <div class="row">
        <div class="col-12">
          <header>
            <h1 class="fw-bold text-dark mb-1">
              <i class="bi bi-menu-button me-2" aria-hidden="true"></i>
              Nuestro Menú
            </h1>
            <p class="text-muted mb-4">Descubre nuestros deliciosos platos y especialidades culinarias</p>
          </header>
          
          ${!authenticated ? `
            <div class="alert alert-info alert-dismissible fade show" role="alert" aria-live="polite">
              <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
              <strong>¡Hola!</strong> Inicia sesión para hacer pedidos y disfrutar de promociones exclusivas.
              <button type="button" class="btn-close" data-bs-dismiss="alert" 
                      aria-label="Cerrar mensaje informativo"></button>
            </div>
          ` : `
            <div class="alert alert-success alert-dismissible fade show" role="alert" aria-live="polite">
              <i class="bi bi-check-circle me-2" aria-hidden="true"></i>
              <strong>¡Bienvenido ${displayName}!</strong> Explora nuestro menú y agrega tus platos favoritos al carrito.
              <button type="button" class="btn-close" data-bs-dismiss="alert" 
                      aria-label="Cerrar mensaje de bienvenida"></button>
            </div>
          `}
          
          <!-- Contenedor para la lista de platos -->
          <section aria-labelledby="platos-heading">
            <h2 id="platos-heading" class="visually-hidden">Lista de platos disponibles</h2>
            <div id="plato-list-container" aria-live="polite"></div>
          </section>
        </div>
      </div>
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

      /* Alto contraste */
      @media (prefers-contrast: high) {
        .btn-outline-light {
          border-color: #fff;
          color: #fff;
        }
        
        .btn-outline-light:hover {
          background-color: #fff;
          color: #000;
        }
      }

      /* Movimiento reducido */
      @media (prefers-reduced-motion: reduce) {
        .alert {
          transition: none;
        }
      }

      /* Mejoras de enfoque para navbar */
      .navbar-dark .btn:focus-visible {
        outline-color: #fff;
      }
    </style>
  `;

  // Función para anuncios de screen reader
  function announceToScreenReader(message) {
    const announcer = page.querySelector('#ariaAnnouncer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  // Cargar componentes de forma asíncrona para mejor rendimiento
  setTimeout(() => {
    // Agregar lista de platos
    const container = page.querySelector('#plato-list-container');
    if (container) {
      container.appendChild(PlatoList(false));
      announceToScreenReader('Lista de platos cargada correctamente');
    }

    // Agregar carrito solo si está autenticado
    if (authenticated) {
      // Agregar offcanvas del carrito
      const carritoOffcanvas = CarritoOffcanvas();
      if (carritoOffcanvas) {
        page.appendChild(carritoOffcanvas);
      }
      
      // Agregar botón flotante del carrito
      const carritoButton = CarritoButton();
      if (carritoButton) {
        page.appendChild(carritoButton);
      }
      
      // Actualizar badge del navbar
      actualizarBadgeNavbar();
      
      // Escuchar eventos de actualización del carrito
      window.addEventListener('carritoActualizado', actualizarBadgeNavbar);
    }
  }, 100);

  // ========================================
  // EVENT LISTENERS OPTIMIZADOS
  // ========================================

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

  // Focus management para accesibilidad
  setTimeout(() => {
    const mainContent = page.querySelector('#main-content');
    if (mainContent) {
      mainContent.focus();
    }
  }, 200);

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
        // Fallback: limpiar localStorage y redirigir
        localStorage.clear();
        router.navigate('/login');
      }
    } else {
      announceToScreenReader('Cierre de sesión cancelado');
    }
  }

  // Función para actualizar el badge del navbar
  function actualizarBadgeNavbar() {
    import('../../carrito/carritoService.js')
      .then(({ obtenerCantidadTotal }) => {
        const badge = document.getElementById('carritoBadge');
        if (badge) {
          const cantidad = obtenerCantidadTotal();
          if (cantidad > 0) {
            badge.textContent = cantidad > 99 ? '99+' : cantidad;
            badge.style.display = 'inline-block';
            badge.setAttribute('aria-label', `${cantidad} items en el carrito`);
          } else {
            badge.style.display = 'none';
            badge.removeAttribute('aria-label');
          }
        }
      })
      .catch(error => {
        console.error('Error al cargar carritoService:', error);
      });
  }

  // Cleanup al desmontar el componente
  page.cleanup = () => {
    window.removeEventListener('carritoActualizado', actualizarBadgeNavbar);
  };

  return page;
}