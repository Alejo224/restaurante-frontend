
// src/modules/auth/LoginPage.js
import { LoginForm } from './LoginForm.js';
import { router } from '../../router.js';

export function LoginPage() {
  const page = document.createElement('div');
  page.classList.add('auth-container');
  
  page.innerHTML = `
    <!-- Navbar fixed -->
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" id="homeLink">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias
        </a>
        <button class="btn btn-outline-light btn-sm" id="backToHomeBtn">
          <i class="bi bi-arrow-left me-1"></i>
          Volver al Inicio
        </button>
      </div>
    </nav>

    <!-- Contenedor del formulario CON CLASE NUEVA -->
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-md-6 col-lg-5">
          <div class="auth-form-container"> <!-- 👈 CLASE NUEVA -->
            <div id="login-form-container"></div>
          </div>
        </div>
      </div>
    </div>
  `;

  // Agregar el formulario
  const formContainer = page.querySelector('#login-form-container');
  formContainer.appendChild(LoginForm());

  // Event listeners para navegación
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  page.querySelector('#backToHomeBtn').addEventListener('click', () => {
    router.navigate('/');
  });

  return page;
}