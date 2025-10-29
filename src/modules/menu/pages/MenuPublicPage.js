// src/modules/menu/pages/MenuPublicPage.js
import { PlatoList } from '../components/PlatoList.js';
import { router } from '../../../router.js';
import { logout, isAuthenticated, getCurrentUser } from '../../auth/userService.js';

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
        <div>
          <button class="btn btn-outline-light btn-sm me-2" id="backBtn">
            <i class="bi bi-arrow-left me-1"></i>
            Volver
          </button>
          
          ${authenticated ? `
            <!-- Usuario autenticado: Mostrar botón de logout -->
            <button class="btn btn-outline-warning btn-sm" id="logoutBtn">
              <i class="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          ` : `
            <!-- Usuario NO autenticado: Mostrar botones de login/registro -->
            <button class="btn btn-outline-success btn-sm me-2" id="loginBtn">
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

  // Agregar el componente de lista de platos (modo público)
  const container = page.querySelector('#plato-list-container');
  container.appendChild(PlatoList(false));

  // Event listeners
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  page.querySelector('#backBtn').addEventListener('click', () => {
    router.navigate('/');
  });

  // ✅ LOGOUT ACTUALIZADO - Solo si está autenticado
  const logoutBtn = page.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        console.log('👋 Cerrando sesión...');
        logout(); // Esta función ya es async internamente
      }
    });
  }

  // ✅ BOTONES DE LOGIN/REGISTER - Solo si NO está autenticado
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

  return page;
}
