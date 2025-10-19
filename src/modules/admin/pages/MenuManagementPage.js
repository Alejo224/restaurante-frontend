// src/modules/admin/pages/MenuManagementPage.js
import { PlatoList } from '../../menu/components/PlatoList.js';
import { router } from '../../../router.js';
import { logout } from '../../auth/userService.js';

export function MenuManagementPage() {
  const page = document.createElement('div');
  
  page.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" id="homeLink">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias - Admin
        </a>
        <div>
          <button class="btn btn-outline-warning btn-sm me-2" id="addPlatoBtn">
            <i class="bi bi-plus-circle me-1"></i>
            Agregar Plato
          </button>
          <button class="btn btn-outline-light btn-sm me-2" id="backBtn">
            <i class="bi bi-arrow-left me-1"></i>
            Volver
          </button>
          <button class="btn btn-outline-danger btn-sm" id="logoutBtn">
            <i class="bi bi-box-arrow-right me-1"></i>
            Salir
          </button>
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
            Gestión de Menú - Administrador
          </h1>
          <p class="text-muted mb-4">Administra los platos del restaurante</p>
          
          <!-- Componente de lista de platos -->
          <div id="plato-list-container"></div>
        </div>
      </div>
    </div>
  `;

  // Agregar el componente de lista de platos en MODO ADMIN
  const container = page.querySelector('#plato-list-container');
  container.appendChild(PlatoList(true)); // 👈 true = vista de admin

  // Event listeners
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  page.querySelector('#backBtn').addEventListener('click', () => {
    router.navigate('/');
  });

  page.querySelector('#logoutBtn').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
    }
  });

  page.querySelector('#addPlatoBtn').addEventListener('click', () => {
    alert('Funcionalidad de agregar plato - Próximamente');
  });

  return page;
}