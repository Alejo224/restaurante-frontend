// src/modules/admin/actualizar-plato/ActualizarPlato.js
import { obtenerPlatoPorId, actualizarPlato, obtenerCategorias } from '../../admin/crear-plato/platosServices.js';
import { getCurrentUser, logout, isAuthenticated } from '../../auth/userService.js';

class ActualizarPlato {
  constructor() {
    this.platoId = this.getPlatoIdFromURL();
    
    // Verificar autenticación
    if (!isAuthenticated()) {
      this.redirectToLogin();
      return;
    }
    
    this.init();
  }

  getPlatoIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
      this.showError('❌ Error: No se especificó el ID del plato');
      return null;
    }
    
    console.log('🔄 Cargando plato ID:', id);
    return id;
  }

  redirectToLogin() {
    alert('🔒 Debes iniciar sesión para acceder a esta página');
    window.location.href = '../../auth/login.html';
  }

  async init() {
    try {
      await this.render();
      await this.loadData();
      this.setupEventListeners();
    } catch (error) {
      console.error('❌ Error inicializando:', error);
      this.showError('Error al cargar la página: ' + error.message);
    }
  }

  async render() {
    const user = getCurrentUser();
    const userName = user?.email?.split('@')[0] || 'Admin';

    document.body.innerHTML = `
      <nav class="navbar navbar-dark bg-dark fixed-top">
        <div class="container">
          <a class="navbar-brand fw-bold" href="../../../../index.html" id="homeLink">
            <i class="bi bi-egg-fried me-2"></i>
            Sabores & Delicias - Admin ${userName}
          </a>
          <div>
            <button class="btn btn-outline-light btn-sm me-2" id="backBtn">
              <i class="bi bi-arrow-left me-1"></i>
              Volver al Menú
            </button>
            <button class="btn btn-outline-danger btn-sm" id="logoutBtn">
              <i class="bi bi-box-arrow-right me-1"></i>
              Salir
            </button>
          </div>
        </div>
      </nav>
      
      <div style="height: 80px;"></div>
      
      <div class="container my-4">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10">
            <div class="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 class="fw-bold text-dark mb-1">
                  <i class="bi bi-pencil-square me-2"></i>
                  Actualizar Plato
                </h1>
                <p class="text-muted mb-0">Modifica los datos del plato</p>
              </div>
              <div class="text-end">
                <div class="btn-group">
                  <button id="btn-volver-menu" class="btn btn-secondary">
                    <i class="bi bi-arrow-left me-1"></i>
                    Volver
                  </button>
                  <button id="btn-actualizar" class="btn btn-success">
                    <i class="bi bi-check-circle me-1"></i>
                    Actualizar
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado de carga -->
            <div id="loadingState" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Cargando datos del plato...</span>
              </div>
              <p class="text-muted mt-2">Cargando datos del plato...</p>
            </div>

            <!-- Contenido principal -->
            <div id="mainContent" class="card shadow-sm border-0" style="display: none;">
              <div class="card-body p-4">
                <div class="row">
                  <div class="col-md-8">
                    <!-- Información básica -->
                    <div class="mb-4">
                      <h5 class="fw-bold text-dark mb-3">
                        <i class="bi bi-info-circle me-2"></i>
                        Información del Plato
                      </h5>
                      
                      <div class="mb-3">
                        <label for="nombre-plato" class="form-label fw-semibold">Nombre del plato *</label>
                        <input type="text" id="nombre-plato" class="form-control form-control-lg" 
                               placeholder="Ej: Lomo Saltado" required>
                      </div>

                      <div class="mb-3">
                        <label for="descripcion-plato" class="form-label fw-semibold">Descripción *</label>
                        <textarea id="descripcion-plato" class="form-control" 
                                  placeholder="Describe el plato..." rows="3" required></textarea>
                      </div>

                      <div class="row">
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="precio-plato" class="form-label fw-semibold">Precio *</label>
                            <div class="input-group">
                              <span class="input-group-text">COP $</span>
                              <input type="number" id="precio-plato" class="form-control" 
                                     placeholder="0.00" step="0.01" min="0" required>
                            </div>
                          </div>
                        </div>
                        <div class="col-md-6">
                          <div class="mb-3">
                            <label for="categoria-plato" class="form-label fw-semibold">Categoría *</label>
                            <select id="categoria-plato" class="form-select" required>
                              <option value="">Cargando categorías...</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div class="form-check form-switch mb-3">
                        <input class="form-check-input" type="checkbox" id="disponible-plato" checked>
                        <label class="form-check-label fw-semibold" for="disponible-plato">
                          Plato disponible
                        </label>
                      </div>
                    </div>
                  </div>

                  <div class="col-md-4">
                    <!-- Imagen -->
                    <div class="mb-4">
                      <h5 class="fw-bold text-dark mb-3">
                        <i class="bi bi-image me-2"></i>
                        Imagen del Plato
                      </h5>
                      
                      <div class="mb-3">
                        <label for="imagen-plato" class="form-label fw-semibold">
                          Nueva imagen (opcional)
                        </label>
                        <input type="file" id="imagen-plato" class="form-control" 
                               accept=".jpg, .jpeg, .png">
                        <div class="form-text">
                          Deja vacío para mantener la imagen actual
                        </div>
                      </div>

                      <div class="border rounded p-3 bg-light">
                        <label class="form-label fw-semibold">Imagen actual:</label>
                        <div id="imagen-preview" class="text-center mt-2">
                          <div class="spinner-border spinner-border-sm" role="status">
                            <span class="visually-hidden">Cargando imagen...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Botón de actualizar -->
                <div class="text-center mt-4">
                  <button id="btn-actualizar-final" class="btn btn-primary btn-lg px-5">
                    <i class="bi bi-check-lg me-2"></i>
                    Actualizar Plato
                  </button>
                </div>
              </div>
            </div>

            <!-- Estado de error -->
            <div id="errorState" class="alert alert-danger text-center" style="display: none;">
              <i class="bi bi-exclamation-triangle me-2"></i>
              <span id="errorMessage"></span>
              <div class="mt-3">
                <button class="btn btn-outline-danger btn-sm me-2" id="retryBtn">
                  <i class="bi bi-arrow-clockwise me-1"></i>
                  Reintentar
                </button>
                <button class="btn btn-secondary btn-sm" id="backErrorBtn">
                  <i class="bi bi-arrow-left me-1"></i>
                  Volver al Menú
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading overlay -->
      <div id="loadingOverlay" class="loading-overlay" style="display: none;">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Actualizando plato...</span>
        </div>
        <p class="mt-2 fw-semibold">Actualizando plato...</p>
      </div>

      <!-- Toast para notificaciones -->
      <div id="toastContainer" class="position-fixed top-0 end-0 p-3" style="z-index: 1055;"></div>
    `;
  }

  async loadData() {
    if (!this.platoId) return;

    try {
      this.showLoading(true);
      
      // Cargar categorías y datos del plato en paralelo
      await Promise.all([
        this.loadCategorias(),
        this.loadPlatoData()
      ]);
      
      this.showLoading(false);
      this.showMainContent(true);
      
    } catch (error) {
      this.showLoading(false);
      this.showError('Error al cargar los datos: ' + error.message);
    }
  }

  async loadCategorias() {
    try {
      const categorias = await obtenerCategorias();
      const select = document.querySelector('#categoria-plato');
      
      select.innerHTML = '<option value="">Selecciona una categoría</option>';
      categorias.forEach(categoria => {
        select.innerHTML += `
          <option value="${categoria.id}">${categoria.nombreCategoria}</option>
        `;
      });
      
    } catch (error) {
      console.error('❌ Error cargando categorías:', error);
      throw new Error('No se pudieron cargar las categorías');
    }
  }

  async loadPlatoData() {
    try {
      const plato = await obtenerPlatoPorId(this.platoId);
      console.log('📋 Datos del plato cargados:', plato);
      
      // Llenar formulario con datos actuales
      document.querySelector('#nombre-plato').value = plato.nombre || '';
      document.querySelector('#descripcion-plato').value = plato.descripcion || '';
      document.querySelector('#precio-plato').value = plato.precio || '';
      document.querySelector('#categoria-plato').value = plato.categoria?.id || '';
      document.querySelector('#disponible-plato').checked = plato.disponible !== false;
      
      // Mostrar imagen actual
      const imagenPreview = document.querySelector('#imagen-preview');
      if (plato.imagenUrl) {
        const imageUrl = `https://gestion-restaurante-api.onrender.com${plato.imagenUrl}`;
        imagenPreview.innerHTML = `
          <img src="${imageUrl}" 
               alt="${plato.nombre}" 
               class="img-fluid rounded shadow-sm"
               style="max-height: 200px; object-fit: cover;"
               onerror="this.style.display='none'; this.parentElement.innerHTML='<p class=\\'text-muted\\'>Error al cargar imagen</p>'">
          <p class="text-muted small mt-2">Imagen actual del plato</p>
        `;
      } else {
        imagenPreview.innerHTML = `
          <div class="text-muted py-4">
            <i class="bi bi-image display-4 d-block"></i>
            <small>No hay imagen disponible</small>
          </div>
        `;
      }
      
    } catch (error) {
      console.error('❌ Error cargando datos del plato:', error);
      throw new Error('No se pudieron cargar los datos del plato: ' + error.message);
    }
  }

  setupEventListeners() {
    // Botón de actualizar principal
    document.querySelector('#btn-actualizar-final').addEventListener('click', () => {
      this.updatePlato();
    });

    // Botón de actualizar en header
    document.querySelector('#btn-actualizar').addEventListener('click', () => {
      this.updatePlato();
    });

    // Botones de volver
    document.querySelector('#btn-volver-menu').addEventListener('click', () => {
      this.goBack();
    });

    document.querySelector('#backBtn').addEventListener('click', () => {
      this.goBack();
    });

    document.querySelector('#backErrorBtn')?.addEventListener('click', () => {
      this.goBack();
    });

    // Logout
    document.querySelector('#logoutBtn').addEventListener('click', async () => {
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        try {
          await logout();
        } catch (error) {
          console.error('Error al cerrar sesión:', error);
          localStorage.clear();
          window.location.href = '../../auth/login.html';
        }
      }
    });

    // Reintentar en caso de error
    document.querySelector('#retryBtn')?.addEventListener('click', () => {
      this.loadData();
    });

    // Enter key en formulario
    document.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.updatePlato();
      }
    });
  }

  async updatePlato() {
    const formData = this.getFormData();
    
    if (!this.validateForm(formData)) {
      return;
    }

    try {
      this.showOverlay(true);
      console.log('📤 Enviando datos de actualización:', formData);
      
      const platoActualizado = await actualizarPlato(this.platoId, formData);
      console.log('✅ Plato actualizado:', platoActualizado);
      
      this.showOverlay(false);
      this.showToast('¡Plato actualizado correctamente!', 'success');
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        this.goBack();
      }, 2000);
      
    } catch (error) {
      this.showOverlay(false);
      console.error('❌ Error actualizando plato:', error);
      this.showToast('Error al actualizar el plato: ' + error.message, 'error');
    }
  }

  getFormData() {
    return {
      nombre: document.querySelector('#nombre-plato').value.trim(),
      descripcion: document.querySelector('#descripcion-plato').value.trim(),
      precio: document.querySelector('#precio-plato').value,
      categoria: document.querySelector('#categoria-plato').value,
      imagen: document.querySelector('#imagen-plato').files[0] || null,
      disponible: document.querySelector('#disponible-plato').checked
    };
  }

  validateForm(data) {
    const errors = [];

    if (!data.nombre) {
      errors.push('El nombre del plato es obligatorio');
    }

    if (!data.descripcion) {
      errors.push('La descripción del plato es obligatoria');
    }

    if (!data.precio || parseFloat(data.precio) <= 0) {
      errors.push('El precio debe ser mayor a 0');
    }

    if (!data.categoria) {
      errors.push('Debes seleccionar una categoría');
    }

    if (errors.length > 0) {
      this.showToast(errors.join('<br>'), 'error');
      return false;
    }

    return true;
  }

  goBack() {
    // Intentar volver a la página anterior
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback: ir a la página de gestión de menú
      window.location.href = '../pages/MenuManagementPage.html';
    }
  }

  showLoading(show) {
    const loadingState = document.querySelector('#loadingState');
    const mainContent = document.querySelector('#mainContent');
    const errorState = document.querySelector('#errorState');
    
    loadingState.style.display = show ? 'block' : 'none';
    mainContent.style.display = show ? 'none' : 'block';
    errorState.style.display = 'none';
  }

  showMainContent(show) {
    const mainContent = document.querySelector('#mainContent');
    mainContent.style.display = show ? 'block' : 'none';
  }

  showError(message) {
    const errorState = document.querySelector('#errorState');
    const errorMessage = document.querySelector('#errorMessage');
    const loadingState = document.querySelector('#loadingState');
    const mainContent = document.querySelector('#mainContent');
    
    errorMessage.innerHTML = message;
    errorState.style.display = 'block';
    loadingState.style.display = 'none';
    mainContent.style.display = 'none';
  }

  showOverlay(show) {
    const overlay = document.querySelector('#loadingOverlay');
    overlay.style.display = show ? 'flex' : 'none';
  }

  showToast(message, type = 'info') {
    const toastContainer = document.querySelector('#toastContainer');
    const toastId = 'toast-' + Date.now();
    
    const bgClass = type === 'success' ? 'bg-success' : 
                   type === 'error' ? 'bg-danger' : 'bg-info';
    
    const toastHTML = `
      <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0" role="alert">
        <div class="d-flex">
          <div class="toast-body">
            <i class="bi bi-${type === 'success' ? 'check-circle' : 'exclamation-triangle'} me-2"></i>
            ${message}
          </div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    `;
    
    toastContainer.insertAdjacentHTML('beforeend', toastHTML);
    
    const toastElement = document.getElementById(toastId);
    const toast = new bootstrap.Toast(toastElement, { delay: 4000 });
    toast.show();
    
    // Remover del DOM después de ocultar
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }
}

// Inicializar cuando se cargue el DOM
document.addEventListener('DOMContentLoaded', () => {
  new ActualizarPlato();
});