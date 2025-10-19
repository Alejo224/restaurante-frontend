// src/modules/menu/pages/MenuPublicPage.js
import { PlatoList } from '../components/PlatoList.js';
import { router } from '../../../router.js';

export function MenuPublicPage() {
  const page = document.createElement('div');
  
  page.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" id="homeLink">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias
        </a>
        <div>
          <button class="btn btn-outline-light btn-sm me-2" id="backBtn">
            <i class="bi bi-arrow-left me-1"></i>
            Volver
          </button>
          <button class="btn btn-outline-warning btn-sm" id="logoutBtn">
            <i class="bi bi-box-arrow-right me-1"></i>
            Cerrar Sesión
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
            Nuestro Menú
          </h1>
          <p class="text-muted mb-4">Descubre nuestros deliciosos platos</p>
          
          <!-- Componente de lista de platos -->
          <div id="plato-list-container"></div>
        </div>
      </div>
    </div>
  `;

  // Agregar el componente de lista de platos
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

  page.querySelector('#logoutBtn').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('usuario');
      router.navigate('/');
    }
  });

  return page;
}