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
    <!-- Header Principal -->
    <header class="navbar navbar-light bg-white border-bottom shadow-sm" role="banner">
      <div class="container">
        <!-- Logo/Marca -->
        <a class="navbar-brand fw-bold" href="#" id="brandLink" aria-label="Sabores & Delicias - Ir al inicio">
          <i class="bi bi-egg-fried me-2 text-warning" aria-hidden="true"></i>
          Sabores & Delicias
        </a>
        
        <!-- Controles de Usuario -->
        <div class="d-flex align-items-center gap-3" role="toolbar" aria-label="Controles de usuario">
          <span class="text-muted small d-none d-md-inline" aria-label="Usuario conectado: ${displayName}">
            <i class="bi bi-person-circle me-1" aria-hidden="true"></i>
            ${displayName}
          </span>
          <button class="btn btn-outline-danger btn-sm" id="logoutBtn" aria-label="Cerrar sesión">
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
        <h2 id="actions-heading" class="visually-hidden">Acciones principales</h2>
        
        <div class="row g-4 justify-content-center" role="list" aria-label="Opciones de acción">
          
          <!-- Card: Ver Menú -->
          <article class="col-md-6 col-lg-3" role="listitem">
            <div class="user-action-card" id="cardMenu" tabindex="0" role="button" aria-labelledby="menu-title menu-desc">
              <div class="user-action-icon bg-danger bg-opacity-10" aria-hidden="true">
                <i class="bi bi-menu-button-wide text-danger"></i>
              </div>
              <h3 id="menu-title" class="user-action-title h5">Ver Menú</h3>
              <p id="menu-desc" class="user-action-description">Explora nuestros deliciosos platos</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </div>
          </article>

          <!-- Card: Hacer Reserva -->
          <article class="col-md-6 col-lg-3" role="listitem">
            <div class="user-action-card" id="cardReserva" tabindex="0" role="button" aria-labelledby="reserva-title reserva-desc">
              <div class="user-action-icon bg-primary bg-opacity-10" aria-hidden="true">
                <i class="bi bi-calendar-check text-primary"></i>
              </div>
              <h3 id="reserva-title" class="user-action-title h5">Hacer Reserva</h3>
              <p id="reserva-desc" class="user-action-description">Reserva tu mesa favorita</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </div>
          </article>

          <!-- Card: Mis Reservas -->
          <article class="col-md-6 col-lg-3" role="listitem">
            <div class="user-action-card" id="cardMisReservas" tabindex="0" role="button" aria-labelledby="misreservas-title misreservas-desc">
              <div class="user-action-icon bg-success bg-opacity-10" aria-hidden="true">
                <i class="bi bi-clock-history text-success"></i>
              </div>
              <h3 id="misreservas-title" class="user-action-title h5">Mis Reservas</h3>
              <p id="misreservas-desc" class="user-action-description">Gestiona tus reservas activas</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </div>
          </article>

          <!-- Card: Historial de Pedidos -->
          <article class="col-md-6 col-lg-3" role="listitem">
            <div class="user-action-card" id="cardHistorial" tabindex="0" role="button" aria-labelledby="historial-title historial-desc">
              <div class="user-action-icon bg-warning bg-opacity-10" aria-hidden="true">
                <i class="bi bi-receipt text-warning"></i>
              </div>
              <h3 id="historial-title" class="user-action-title h5">Historial</h3>
              <p id="historial-desc" class="user-action-description">Consulta tus pedidos anteriores</p>
              <div class="user-action-arrow" aria-hidden="true">
                <i class="bi bi-arrow-right"></i>
              </div>
            </div>
          </article>
        </div>
      </section>

      <!-- Sección de Información del Restaurante -->
      <section aria-labelledby="info-heading">
        <header class="row mb-4">
          <div class="col-12">
            <h2 id="info-heading" class="fw-bold text-center h4">Información del Restaurante</h2>
          </div>
        </header>

        <div class="row g-4" role="list" aria-label="Información de contacto y horarios">
          
          <!-- Horario -->
          <article class="col-md-4" role="listitem">
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
          </article>

          <!-- Ubicación -->
          <article class="col-md-4" role="listitem">
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
              <a href="#" class="small text-primary text-decoration-none" aria-label="Ver ubicación en mapa">
                Ver en el mapa
                <span class="visually-hidden">de Sabores & Delicias</span>
              </a>
            </div>
          </article>

          <!-- Contacto -->
          <article class="col-md-4" role="listitem">
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
                aria-label="Enviar mensaje por WhatsApp">
                Enviar WhatsApp
                <span class="visually-hidden">a Sabores & Delicias</span>
              </a>
            </div>
          </article>
        </div>
      </section>

      <!-- Sección de Accesibilidad (Oculta visualmente) -->
      <section aria-labelledby="keyboard-heading" class="mt-5">
        <h2 id="keyboard-heading" class="visually-hidden">Accesibilidad por Teclado</h2>
        <div class="visually-hidden" aria-live="polite">
          <p>Use la tecla Tab para navegar entre las opciones y Enter para seleccionar.</p>
        </div>
      </section>
    </main>

    <!-- Navegación de Emergencia para Lectores de Pantalla -->
    <nav class="visually-hidden" aria-label="Navegación rápida">
      <h2>Navegación Rápida</h2>
      <ul>
        <li><a href="#main-content">Saltar al contenido principal</a></li>
        <li><a href="#actions-heading">Ir a acciones principales</a></li>
        <li><a href="#info-heading">Ir a información del restaurante</a></li>
      </ul>
    </nav>
  `;

  // ========================================
  // EVENT LISTENERS
  // ========================================

  // Brand link - Volver al home
  page.querySelector('#brandLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  // Logout
  page.querySelector('#logoutBtn').addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        localStorage.clear();
        router.navigate('/login');
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
    alert('Funcionalidad de reserva - Próximamente');
    // router.navigate('/reservar');
  });

  // Card: Mis Reservas
  page.querySelector('#cardMisReservas').addEventListener('click', () => {
    alert('Mis Reservas - Próximamente');
    // router.navigate('/mis-reservas');
  });

  // Card: Historial de Pedidos
  page.querySelector('#cardHistorial').addEventListener('click', () => {
    console.log('🔄 Abriendo página historial de pedido...');
    window.open(' /restaurante-frontend/src/modules/pedidos/historial-pedidos.html', '_blank');
  });

  return page;
}