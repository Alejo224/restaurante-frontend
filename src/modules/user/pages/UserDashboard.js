// src/modules/user/pages/UserDashboard.js
import { router } from '../../../router.js';
import { logout, getCurrentUser } from '../../auth/userService.js';


export function UserDashboard() {
  const page = document.createElement('div');
  const user = getCurrentUser();
  const userName = user?.email?.split('@')[0] || 'Usuario';
  
  // Capitalizar primera letra
  const displayName = userName.charAt(0).toUpperCase() + userName.slice(1);

  page.innerHTML = `
    <!-- Enlace para saltar navegación -->
    <a href="#main-content" class="btn btn-primary visually-hidden-focusable position-absolute top-0 start-0 m-2" 
       style="z-index: 9999;" tabindex="0">
      Saltar al contenido principal
    </a>

    <!-- Header Principal -->
    <header class="navbar navbar-light bg-white border-bottom shadow-sm" role="banner">
      <div class="container">
        <!-- Logo/Marca -->
        <a class="navbar-brand fw-bold" href="#" id="brandLink" 
           aria-label="Sabores & Delicias - Ir al inicio" tabindex="0">
          <i class="bi bi-egg-fried me-2 text-warning" aria-hidden="true"></i>
          Sabores & Delicias
        </a>
        
        <!-- Controles de Usuario -->
        <div class="d-flex align-items-center gap-3">
          <span class="text-muted small d-none d-md-inline" aria-label="Usuario conectado: ${displayName}">
            <i class="bi bi-person-circle me-1" aria-hidden="true"></i>
            ${displayName}
          </span>
          <button class="btn btn-outline-danger btn-sm" id="logoutBtn" 
                  aria-label="Cerrar sesión de ${displayName}" tabindex="0">
            <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i>
            Salir
          </button>
        </div>
      </div>
    </header>

    <!-- Contenido Principal -->
    <main class="container py-5" id="main-content" tabindex="-1">
      
      <!-- Sección de Bienvenida -->
      <section class="text-center mb-5" aria-labelledby="welcome-heading">
        <header>
          <h1 id="welcome-heading" class="fw-bold mb-2">Bienvenido, ${displayName}</h1>
          <p class="text-muted lead">¿Qué te gustaría hacer hoy?</p>
        </header>
      </section>

      <!-- Sección de Acciones Principales -->
      <section class="mb-5" aria-labelledby="actions-heading">
        <h2 id="actions-heading" class="h4 fw-bold text-center mb-4">Opciones Disponibles</h2>
        
        <div class="row g-4 justify-content-center">
          
          <!-- Card: Ver Menú -->
          <div class="col-md-6 col-lg-3">
            <button class="user-action-card w-100 border-0 bg-transparent p-0" 
                    id="cardMenu" 
                    tabindex="0" 
                    aria-labelledby="menu-title menu-desc"
                    data-action="menu">
              <div class="user-action-icon bg-danger bg-opacity-10" aria-hidden="true">
                <i class="bi bi-menu-button-wide text-danger"></i>
              </div>
              <h3 id="menu-title" class="user-action-title h5">Ver Menú</h3>
              <p id="menu-desc" class="user-action-description">Explora nuestros deliciosos platos</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </button>
          </div>

          <!-- Card: Hacer Reserva -->
          <div class="col-md-6 col-lg-3">
            <button class="user-action-card w-100 border-0 bg-transparent p-0" 
                    id="cardReserva" 
                    tabindex="0" 
                    aria-labelledby="reserva-title reserva-desc"
                    data-action="reserva">
              <div class="user-action-icon bg-primary bg-opacity-10" aria-hidden="true">
                <i class="bi bi-calendar-check text-primary"></i>
              </div>
              <h3 id="reserva-title" class="user-action-title h5">Hacer Reserva</h3>
              <p id="reserva-desc" class="user-action-description">Reserva tu mesa favorita</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </button>
          </div>

          <!-- Card: Mis Reservas -->
          <div class="col-md-6 col-lg-3">
            <button class="user-action-card w-100 border-0 bg-transparent p-0" 
                    id="cardMisReservas" 
                    tabindex="0" 
                    aria-labelledby="misreservas-title misreservas-desc"
                    data-action="mis-reservas">
              <div class="user-action-icon bg-success bg-opacity-10" aria-hidden="true">
                <i class="bi bi-clock-history text-success"></i>
              </div>
              <h3 id="misreservas-title" class="user-action-title h5">Mis Reservas</h3>
              <p id="misreservas-desc" class="user-action-description">Gestiona tus reservas activas</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </button>
          </div>

          <!-- Card: Historial de Pedidos -->
          <div class="col-md-6 col-lg-3">
            <button class="user-action-card w-100 border-0 bg-transparent p-0" 
                    id="cardHistorial" 
                    tabindex="0" 
                    aria-labelledby="historial-title historial-desc"
                    data-action="historial">
              <div class="user-action-icon bg-warning bg-opacity-10" aria-hidden="true">
                <i class="bi bi-receipt text-warning"></i>
              </div>
              <h3 id="historial-title" class="user-action-title h5">Historial</h3>
              <p id="historial-desc" class="user-action-description">Consulta tus pedidos anteriores</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </button>
          </div>
        </div>
      </section>

      <!-- Sección de Información del Restaurante -->
      <section aria-labelledby="info-heading">
        <header class="row mb-4">
          <div class="col-12">
            <h2 id="info-heading" class="fw-bold text-center h4">Información del Restaurante</h2>
          </div>
        </header>

        <div class="row g-4">
          
          <!-- Horario -->
          <div class="col-md-4">
            <div class="info-card">
              <div class="d-flex align-items-center mb-3">
                <div class="info-icon bg-primary bg-opacity-10 text-primary me-3" aria-hidden="true">
                  <i class="bi bi-clock"></i>
                </div>
                <h3 class="mb-0 h6 fw-bold">Horario de Atención</h3>
              </div>
              <dl>
                <dt class="visually-hidden">Días de semana</dt>
                <dd class="text-muted small mb-1">Lunes a Viernes: 12:00 - 23:00</dd>
                
                <dt class="visually-hidden">Fines de semana</dt>
                <dd class="text-muted small mb-0">Sábados y Domingos: 11:00 - 00:00</dd>
              </dl>
            </div>
          </div>

          <!-- Ubicación -->
          <div class="col-md-4">
            <div class="info-card">
              <div class="d-flex align-items-center mb-3">
                <div class="info-icon bg-success bg-opacity-10 text-success me-3" aria-hidden="true">
                  <i class="bi bi-geo-alt"></i>
                </div>
                <h3 class="mb-0 h6 fw-bold">Nuestra Ubicación</h3>
              </div>
              <address class="text-muted small mb-2">
                Cra 45 #123-45, Tuluá, Valle del Cauca
              </address>
              <button class="small text-primary text-decoration-none border-0 bg-transparent p-0" 
                      id="mapButton"
                      aria-label="Ver ubicación en mapa de Sabores & Delicias">
                Ver en el mapa
              </button>
            </div>
          </div>

          <!-- Contacto -->
          <div class="col-md-4">
            <div class="info-card">
              <div class="d-flex align-items-center mb-3">
                <div class="info-icon bg-warning bg-opacity-10 text-warning me-3" aria-hidden="true">
                  <i class="bi bi-telephone"></i>
                </div>
                <h3 class="mb-0 h6 fw-bold">Contacto Directo</h3>
              </div>
              <a href="tel:+573224356789" class="text-muted small mb-2 d-block text-decoration-none">
                (57) 322 4356 7898
              </a>
              <a href="https://wa.me/573224356789" 
                class="small text-primary text-decoration-none"
                aria-label="Enviar mensaje por WhatsApp a Sabores & Delicias"
                target="_blank" rel="noopener noreferrer">
                Enviar WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Área de anuncios para lectores de pantalla -->
      <div class="visually-hidden" aria-live="polite" aria-atomic="true">
        <div id="ariaAnnouncer"></div>
      </div>
    </main>

    <!-- CSS optimizado para rendimiento -->
    <style>
      /* Estilos base optimizados */
      .user-action-card {
        background: white;
        border: 2px solid #f8f9fa;
        border-radius: 12px;
        padding: 2rem 1.5rem;
        text-align: center;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        position: relative;
        display: block;
        text-decoration: none;
        color: inherit;
      }
      
      .user-action-card:hover,
      .user-action-card:focus-visible {
        border-color: #0d6efd;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        outline: none;
      }
      
      .user-action-card:active {
        transform: translateY(0);
      }
      
      .user-action-icon {
        width: 64px;
        height: 64px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 1rem;
        font-size: 1.5rem;
      }
      
      .user-action-title {
        color: #2c3e50;
        margin-bottom: 0.5rem;
        font-weight: 600;
      }
      
      .user-action-description {
        color: #6c757d;
        font-size: 0.9rem;
        margin-bottom: 1rem;
      }
      
      .user-action-arrow {
        color: #0d6efd;
        font-size: 1.25rem;
      }
      
      .info-card {
        background: white;
        border: 1px solid #e9ecef;
        border-radius: 8px;
        padding: 1.5rem;
        height: 100%;
      }
      
      .info-icon {
        width: 40px;
        height: 40px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.1rem;
      }
      
      /* Mejoras de accesibilidad */
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
      .user-action-card:focus-visible,
      .navbar-brand:focus-visible {
        outline: 3px solid #0d6efd;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
      }
      
      /* Optimizaciones de rendimiento */
      .user-action-card {
        will-change: transform, box-shadow;
        contain: layout style;
      }
      
      /* Alto contraste */
      @media (prefers-contrast: high) {
        .user-action-card {
          border: 2px solid #000;
        }
        
        .btn {
          border: 2px solid currentColor;
        }
        
        .text-muted {
          color: #000 !important;
        }
      }
      
      /* Movimiento reducido */
      @media (prefers-reduced-motion: reduce) {
        .user-action-card {
          transition: none;
        }
      }
      
      /* Optimizaciones para móviles */
      @media (max-width: 768px) {
        .user-action-card {
          padding: 1.5rem 1rem;
        }
        
        .user-action-icon {
          width: 48px;
          height: 48px;
          font-size: 1.25rem;
        }
      }
    </style>
  `;

  // ========================================
  // OPTIMIZACIONES DE RENDIMIENTO Y ACCESIBILIDAD
  // ========================================

  // Función para anuncios de accesibilidad
  function announceToScreenReader(message) {
    const announcer = page.querySelector('#ariaAnnouncer');
    if (announcer) {
      announcer.textContent = message;
    }
  }

  // Debounce para evitar múltiples clics rápidos
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Manejador unificado para las cards de acción
  function handleActionCardClick(action) {
    announceToScreenReader(`Navegando a ${action}`);
    
    switch (action) {
      case 'menu':
        router.navigate('/menu');
        break;
      case 'reserva':
        announceToScreenReader('Funcionalidad de reserva - Próximamente');
        alert('Funcionalidad de reserva - Próximamente');
        break;
      case 'mis-reservas':
        announceToScreenReader('Mis Reservas - Próximamente');
        alert('Mis Reservas - Próximamente');
        break;
      case 'historial':
        router.navigate('/historial-pedidos');
        break;
      default:
        console.warn('Acción no reconocida:', action);
    }
  }

  // ========================================
  // EVENT LISTENERS OPTIMIZADOS
  // ========================================

  // Usar event delegation para mejor rendimiento
  page.addEventListener('click', debounce((e) => {
    const target = e.target;
    
    // Brand link - Volver al home
    if (target.id === 'brandLink' || target.closest('#brandLink')) {
      e.preventDefault();
      announceToScreenReader('Navegando al inicio');
      router.navigate('/');
      return;
    }
    
    // Logout
    if (target.id === 'logoutBtn' || target.closest('#logoutBtn')) {
      e.preventDefault();
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        announceToScreenReader('Cerrando sesión');
        logout().catch(error => {
          console.error('Error al cerrar sesión:', error);
          localStorage.clear();
          router.navigate('/login');
        });
      }
      return;
    }
    
    // Map button
    if (target.id === 'mapButton' || target.closest('#mapButton')) {
      e.preventDefault();
      announceToScreenReader('Mostrando ubicación en mapa - Funcionalidad próxima');
      alert('Funcionalidad de mapa - Próximamente');
      return;
    }
    
    // Action cards usando data attributes
    const actionCard = target.closest('[data-action]');
    if (actionCard) {
      e.preventDefault();
      const action = actionCard.getAttribute('data-action');
      handleActionCardClick(action);
      return;
    }
  }, 150));

  // Soporte para teclado en las cards
  page.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target;
      const actionCard = target.closest('[data-action]');
      
      if (actionCard) {
        e.preventDefault();
        const action = actionCard.getAttribute('data-action');
        handleActionCardClick(action);
      }
    }
  });

  // Card: Ver Menú
  page.querySelector('#cardMenu').addEventListener('click', () => {
    router.navigate('/menu');
  });

  // Card: Hacer Reserva
  page.querySelector('#cardReserva').addEventListener('click', () => {
    // Aquí irá la funcionalidad de reserva de tu compañero
    router.navigate('/reservar')
  });

  // Card: Mis Reservas
  page.querySelector('#cardMisReservas').addEventListener('click', () => {
     router.navigate('/reservar/mis-reservas');
  });

  // Card: Historial de Pedidos
  page.querySelector('#cardHistorial').addEventListener('click', () => {
  
    router.navigate('/historial-pedidos');
  });

  return page;
}