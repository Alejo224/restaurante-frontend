// src/modules/admin/actualizar-plato/ActualizarPlatoPage.js
import { obtenerPlatoPorId, actualizarPlato, obtenerCategorias } from '../../admin/crear-plato/platosServices.js';
import { getCurrentUser, logout } from '../../auth/userService.js';
import { router } from '../../../router.js';

export function ActualizarPlatoPage(platoId) {
  const page = document.createElement('div');
  const user = getCurrentUser();
  const userName = user?.email?.split('@')[0] || 'Admin';

  page.innerHTML = `
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#" id="homeLink">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias - Admin ${userName}
        </a>
        <div>
          <button class="btn btn-outline-warning btn-sm me-2" id="actualizarPlatoBtn">
            <i class="bi bi-check-circle me-1"></i>
            Actualizar Plato
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
    
    <div style="height: 80px;"></div>
    
    <div class="container my-4">
      <div class="row">
        <div class="col-12">
          <h1 class="fw-bold text-dark mb-1">
            <i class="bi bi-pencil-square me-2"></i>
            Actualizar Plato
          </h1>
          <p class="text-muted mb-4">Modifica los datos del plato</p>
          
          <!-- Contenedor principal -->
          <div class="main-content">
            <!-- Contenedor de los botones -->
            <div class="grupotsBotns">
              <button id="btn-actualizar-plato" type="submit"> 
                <i class="bi bi-check-circle me-1"></i>
                Actualizar Plato 
              </button>
              <button id="btn-volver-menu" type="submit"> 
                <i class="bi bi-arrow-left me-1"></i>
                ← Volver al Menú 
              </button>
            </div>

            <!-- Contenedor de todo el lado derecho -->
            <div class="content_Derecho">
              <!-- Sección de actualizar plato -->
              <div id="actualizar-plato" class="content_section">
                <h2>Actualizar Plato</h2>
                <div class="content_plato">
                  <div class="data_plato">
                    <label for="nombre-plato">Nombre del plato</label>
                    <input type="text" id="nombre-plato" placeholder="Nombre del plato" required>

                    <label for="imagen-plato">Imagen del plato (deja vacío para mantener la actual)</label>
                    <input type="file" id="imagen-plato" accept=".jpg, .jpeg, .png">
                    
                    <!-- Vista previa de imagen actual -->
                    <div id="imagen-actual-container" class="mb-3">
                      <label>Imagen actual:</label>
                      <div id="imagen-preview" class="mt-2"></div>
                    </div>

                    <label for="descripcion-plato">Descripción del plato</label>
                    <input type="text" id="descripcion-plato" placeholder="Descripción" required>

                    <label for="precio-plato">Precio</label>
                    <input type="number" id="precio-plato" placeholder="Precio" step="0.01" required>

                    <h3>Categoría</h3>
                    <select id="categoria-plato" required>
                      <option value="">Cargando categorías...</option>
                    </select>

                    <!-- Estado del plato -->
                    <h3 class="mt-3">Disponibilidad</h3>
                    <div class="form-check">
                      <input class="form-check-input" type="checkbox" id="disponible-plato" checked>
                      <label class="form-check-label" for="disponible-plato">
                        Plato disponible
                      </label>
                    </div>

                    <button id="btn-actualizar" type="submit" class="btn-actualizar">
                      <i class="bi bi-check-lg me-1"></i>
                      Actualizar Plato
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <div id="loadingOverlay" class="loading-overlay" style="display: none;">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p>Actualizando plato...</p>
    </div>
  `;

  // Inicializar la página
  initializePage(page, platoId);

  return page;
}

// Función para inicializar la página
async function initializePage(page, platoId) {
  try {
    showLoading(page, true);
    
    // Cargar categorías
    await loadCategorias(page);
    
    // Cargar datos del plato
    await loadPlatoData(page, platoId);
    
    showLoading(page, false);
    
    // Agregar event listeners
    setupEventListeners(page, platoId);
    
  } catch (error) {
    showLoading(page, false);
    alert('Error al cargar la página: ' + error.message);
  }
}

// Cargar categorías en el select
async function loadCategorias(page) {
  try {
    const categorias = await obtenerCategorias();
    const select = page.querySelector('#categoria-plato');
    
    select.innerHTML = '<option value="">Selecciona una categoría</option>';
    categorias.forEach(categoria => {
      select.innerHTML += `
        <option value="${categoria.id}">${categoria.nombreCategoria}</option>
      `;
    });
    
  } catch (error) {
    console.error('Error cargando categorías:', error);
    throw new Error('No se pudieron cargar las categorías');
  }
}

// Cargar datos del plato
async function loadPlatoData(page, platoId) {
  try {
    const plato = await obtenerPlatoPorId(platoId);
    
    // Llenar formulario con datos actuales
    page.querySelector('#nombre-plato').value = plato.nombre || '';
    page.querySelector('#descripcion-plato').value = plato.descripcion || '';
    page.querySelector('#precio-plato').value = plato.precio || '';
    page.querySelector('#categoria-plato').value = plato.categoria?.id || '';
    page.querySelector('#disponible-plato').checked = plato.disponible !== false;
    
    // Mostrar imagen actual
    const imagenPreview = page.querySelector('#imagen-preview');
    if (plato.imagenUrl) {
      imagenPreview.innerHTML = `
        <img src="http://localhost:8080${plato.imagenUrl}" 
             alt="${plato.nombre}" 
             style="max-width: 200px; max-height: 150px; border-radius: 8px;">
        <p class="text-muted small mt-1">Imagen actual del plato</p>
      `;
    } else {
      imagenPreview.innerHTML = '<p class="text-muted">No hay imagen actual</p>';
    }
    
  } catch (error) {
    console.error('Error cargando datos del plato:', error);
    throw new Error('No se pudieron cargar los datos del plato');
  }
}

// Configurar event listeners
function setupEventListeners(page, platoId) {
  // Botón de actualizar
  page.querySelector('#btn-actualizar').addEventListener('click', () => {
    updatePlato(page, platoId);
  });

  // Botón de volver
  page.querySelector('#btn-volver-menu').addEventListener('click', () => {
    router.navigate('/admin/menu');
  });

  // Botón de back en nav
  page.querySelector('#backBtn').addEventListener('click', () => {
    router.navigate('/admin/menu');
  });

  // Home link
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  // Logout
  page.querySelector('#logoutBtn').addEventListener('click', async () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      try {
        await logout();
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        localStorage.clear();
        router.navigate('/login');
      }
    }
  });
}

// Función para actualizar el plato
async function updatePlato(page, platoId) {
  const formData = getFormData(page);
  
  if (!validateForm(formData)) {
    return;
  }

  try {
    showLoading(page, true);
    
    await actualizarPlato(platoId, formData);
    
    showLoading(page, false);
    alert('¡Plato actualizado correctamente!');
    router.navigate('/admin/menu');
    
  } catch (error) {
    showLoading(page, false);
    alert('Error al actualizar el plato: ' + error.message);
  }
}

// Obtener datos del formulario
function getFormData(page) {
  return {
    nombre: page.querySelector('#nombre-plato').value,
    descripcion: page.querySelector('#descripcion-plato').value,
    precio: page.querySelector('#precio-plato').value,
    categoria: page.querySelector('#categoria-plato').value,
    imagen: page.querySelector('#imagen-plato').files[0] || null,
    disponible: page.querySelector('#disponible-plato').checked
  };
}

// Validar formulario
function validateForm(data) {
  if (!data.nombre.trim()) {
    alert('El nombre del plato es obligatorio');
    return false;
  }
  
  if (!data.descripcion.trim()) {
    alert('La descripción del plato es obligatoria');
    return false;
  }
  
  if (!data.precio || parseFloat(data.precio) <= 0) {
    alert('El precio debe ser mayor a 0');
    return false;
  }
  
  if (!data.categoria) {
    alert('Debes seleccionar una categoría');
    return false;
  }
  
  return true;
}

// Mostrar/ocultar loading
function showLoading(page, show) {
  const overlay = page.querySelector('#loadingOverlay');
  overlay.style.display = show ? 'flex' : 'none';
}