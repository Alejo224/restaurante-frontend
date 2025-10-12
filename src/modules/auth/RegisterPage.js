// src/pages/RegisterPage.js
import { RegisterForm } from './RegisterForm.js';
import { router } from '../../router.js';

export function RegisterPage() {
  const page = document.createElement('div');
  
  page.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" id="homeLink">
          <i class="bi bi-cup-hot-fill me-2"></i>
          Restaurante Elegante
        </a>
        <div class="navbar-nav ms-auto">
          <button class="btn btn-outline-light" id="backToHomeBtn">
            <i class="bi bi-arrow-left me-1"></i>
            Volver al Inicio
          </button>
        </div>
      </div>
    </nav>

    <!-- Contenido del registro -->
    <div class="container my-5">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div id="register-form-container"></div>
        </div>
      </div>
    </div>
  `;

  // Agregar el formulario de registro
  const formContainer = page.querySelector('#register-form-container');
  const registerForm = RegisterForm();
  formContainer.appendChild(registerForm);

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