// src/modules/admin/pages/CrearPlatoPage.js
import { crearPlato } from '../crear-plato/platosServices.js';
import { obtenerCategorias } from '../crear-plato/categoriaService.js';
import { router } from '../../../router.js';
import { getCurrentUser } from '../../auth/userService.js';

export function CrearPlatoPage() {
  const page = document.createElement('div');
  page.setAttribute('role', 'main');
  page.setAttribute('aria-label', 'Crear nuevo plato');

  const user = getCurrentUser();
  const userName = user?.email?.split('@')[0] || 'Admin';

  page.innerHTML = `
    <!-- Layout con Sidebar -->
    <div class="admin-layout">
      <!-- Sidebar (mismo que en MenuManagementPage) -->
      <aside class="admin-sidebar bg-dark text-white" id="adminSidebar">
        <!-- Header del Sidebar -->
        <div class="sidebar-header p-3 border-bottom border-secondary">
          <div class="d-flex align-items-center">
            <i class="bi bi-egg-fried fs-3 me-2 text-warning"></i>
            <div>
              <h5 class="mb-0 fw-bold">Panel Admin</h5>
              <small class="text-muted">${userName}</small>
            </div>
          </div>
        </div>

        <!-- Navegación del Sidebar -->
        <nav class="sidebar-nav">
          <ul class="nav flex-column">
            <li class="nav-item">
              <a href="#/admin/panel" class="nav-link">
                <i class="bi bi-speedometer2 me-2"></i>
                <span>Dashboard</span>
              </a>
            </li>

            <li class="nav-item">
              <a href="#/admin/panel" class="nav-link active">
                <i class="bi bi-menu-button-wide me-2"></i>
                <span>Gestionar Menú</span>
              </a>
            </li>
            <!-- Otras opciones... -->
          </ul>
        </nav>

        <!-- Footer del Sidebar -->
        <div class="sidebar-footer mt-auto p-3 border-top border-secondary">
          <button class="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" id="logoutBtn">
            <i class="bi bi-box-arrow-right"></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <!-- Contenido Principal -->
      <main class="admin-content">
        <!-- Navbar Superior -->
        <nav class="navbar navbar-light bg-white border-bottom sticky-top shadow-sm">
          <div class="container-fluid">
            <!-- Toggle Sidebar (móvil) -->
            <button class="btn btn-outline-dark d-lg-none" id="toggleSidebar">
              <i class="bi bi-list fs-4"></i>
            </button>

            <!-- Breadcrumb -->
            <div class="d-flex align-items-center flex-grow-1 ms-3">
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb mb-0">
                  <li class="breadcrumb-item">
                    <a href="#/" class="text-decoration-none">
                      <i class="bi bi-house-door me-1"></i>
                      Inicio
                    </a>
                  </li>
                  <li class="breadcrumb-item">
                    <a href="#/admin/panel" class="text-decoration-none">
                      Panel Admin
                    </a>
                  </li>
                  <li class="breadcrumb-item active">
                    Crear Plato
                  </li>
                </ol>
              </nav>
            </div>

            <!-- Acción de volver -->
            <button class="btn btn-outline-secondary" id="volverBtn">
              <i class="bi bi-arrow-left me-1"></i>
              Volver
            </button>
          </div>
        </nav>

        <!-- Formulario de Crear Plato -->
        <div class="container-fluid p-4">
          <div class="row justify-content-center">
            <div class="col-lg-8 col-xl-6">
              <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                  <h3 class="mb-0">
                    <i class="bi bi-plus-circle me-2"></i>
                    Crear Nuevo Plato
                  </h3>
                </div>
                
                <div class="card-body">
                  <form id="form-crear-plato">
                    <!-- Nombre -->
                    <div class="mb-3">
                      <label for="nombre-plato" class="form-label fw-bold">
                        Nombre del Plato <span class="text-danger">*</span>
                      </label>
                      <input 
                        type="text" 
                        class="form-control" 
                        id="nombre-plato" 
                        placeholder="Ej: Lasaña de Carne" 
                        required
                        aria-describedby="nombre-help"
                      >
                      <div id="nombre-help" class="form-text">
                        Nombre descriptivo del plato
                      </div>
                    </div>

                    <!-- Descripción -->
                    <div class="mb-3">
                      <label for="descripcion-plato" class="form-label fw-bold">
                        Descripción <span class="text-danger">*</span>
                      </label>
                      <textarea 
                        class="form-control" 
                        id="descripcion-plato" 
                        rows="3" 
                        placeholder="Descripción detallada del plato..."
                        required
                        aria-describedby="descripcion-help"
                      ></textarea>
                      <div id="descripcion-help" class="form-text">
                        Describe los ingredientes y preparación
                      </div>
                    </div>

                    <!-- Precio -->
                    <div class="mb-3">
                      <label for="precio-plato" class="form-label fw-bold">
                        Precio <span class="text-danger">*</span>
                      </label>
                      <div class="input-group">
                        <span class="input-group-text">$</span>
                        <input 
                          type="number" 
                          class="form-control" 
                          id="precio-plato" 
                          min="0" 
                          step="0.01" 
                          placeholder="0.00" 
                          required
                          aria-describedby="precio-help"
                        >
                      </div>
                      <div id="precio-help" class="form-text">
                        Precio en pesos colombianos (COP)
                      </div>
                    </div>

                    <!-- Categoría -->
                    <div class="mb-3">
                      <label for="categoria-plato" class="form-label fw-bold">
                        Categoría <span class="text-danger">*</span>
                      </label>
                      <select 
                        class="form-select" 
                        id="categoria-plato" 
                        required
                        aria-describedby="categoria-help"
                      >
                        <option value="">Cargando categorías...</option>
                      </select>
                      <div id="categoria-help" class="form-text">
                        Seleccione la categoría del plato
                      </div>
                      <div class="spinner-border spinner-border-sm text-primary mt-2" id="categoria-spinner" role="status">
                        <span class="visually-hidden">Cargando...</span>
                      </div>
                    </div>

                    <!-- Imagen -->
                    <div class="mb-4">
                      <label for="imagen-plato" class="form-label fw-bold">
                        Imagen del Plato <span class="text-danger">*</span>
                      </label>
                      <input 
                        type="file" 
                        class="form-control" 
                        id="imagen-plato" 
                        accept=".jpg,.jpeg,.png" 
                        required
                        aria-describedby="imagen-help"
                      >
                      <div id="imagen-help" class="form-text">
                        Formatos aceptados: JPG, JPEG, PNG. Tamaño máximo: 5MB
                      </div>
                      <div id="preview-container" class="mt-2" style="display: none;">
                        <img id="imagen-preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;" alt="Vista previa de la imagen">
                      </div>
                    </div>

                    <!-- Botones -->
                    <div class="d-flex justify-content-between">
                      <button type="button" class="btn btn-secondary" id="cancelarBtn">
                        <i class="bi bi-x-circle me-1"></i>
                        Cancelar
                      </button>
                      <button type="submit" class="btn btn-primary" id="guardarBtn">
                        <i class="bi bi-save me-1"></i>
                        Guardar Plato
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Mensaje de éxito/error -->
              <div id="mensaje-container" class="mt-3"></div>
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- Overlay para sidebar móvil -->
    <div class="sidebar-overlay" id="sidebarOverlay"></div>
  `;

  // ========================================
  // FUNCIONALIDAD DEL COMPONENTE
  // ========================================

  let categorias = []; // Variable para almacenar las categorías

  // Inicializar eventos
  setTimeout(() => {
    setupEventListeners();
    setupImagePreview();
    cargarCategorias(); // <-- Cargar categorías al iniciar
  }, 100);

  async function cargarCategorias() {
    try {
      const categoriaSelect = page.querySelector('#categoria-plato');
      const spinner = page.querySelector('#categoria-spinner');
      
      categoriaSelect.innerHTML = '<option value="">Cargando categorías...</option>';
      categoriaSelect.disabled = true;
      
      console.log('🔄 Cargando categorías desde API...');
      
      // Obtener categorías desde la API
      categorias = await obtenerCategorias();
      
      // Ordenar categorías alfabéticamente
      categorias.sort((a, b) => a.nombreCategoria.localeCompare(b.nombreCategoria));
      
      // Limpiar y llenar el select
      categoriaSelect.innerHTML = '<option value="">Seleccione una categoría</option>';
      
      categorias.forEach(categoria => {
        const option = document.createElement('option');
        option.value = categoria.id;
        option.textContent = categoria.nombreCategoria;
        categoriaSelect.appendChild(option);
      });
      
      categoriaSelect.disabled = false;
      spinner.style.display = 'none';
      
      console.log('✅ Categorías cargadas:', categorias.length);
      
    } catch (error) {
      console.error('❌ Error al cargar categorías:', error);
      
      const categoriaSelect = page.querySelector('#categoria-plato');
      const spinner = page.querySelector('#categoria-spinner');
      
      categoriaSelect.innerHTML = `
        <option value="">Error al cargar categorías</option>
        <option value="1">Comida rapida</option>
        <option value="2">Comida rapida</option>
        <option value="3">Platos principales</option>
        <option value="4">Postre</option>
        <option value="5">Bebida</option>
      `;
      categoriaSelect.disabled = false;
      spinner.style.display = 'none';
      
      mostrarMensaje('⚠️ No se pudieron cargar las categorías. Usando valores predeterminados.', 'warning');
    }
  }

  function setupEventListeners() {
    // Botón Volver
    const volverBtn = page.querySelector('#volverBtn');
    if (volverBtn) {
      volverBtn.addEventListener('click', () => {
        router.navigate('/admin/panel');
      });
    }

    // Botón Cancelar
    const cancelarBtn = page.querySelector('#cancelarBtn');
    if (cancelarBtn) {
      cancelarBtn.addEventListener('click', () => {
        router.navigate('/admin/panel');
      });
    }

    // Formulario
    const form = page.querySelector('#form-crear-plato');
    if (form) {
      form.addEventListener('submit', handleSubmit);
    }

    // Toggle sidebar (móvil)
    const toggleBtn = page.querySelector('#toggleSidebar');
    const sidebar = page.querySelector('#adminSidebar');
    const overlay = page.querySelector('#sidebarOverlay');

    if (toggleBtn && sidebar && overlay) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show');
        overlay.classList.toggle('show');
      });

      overlay.addEventListener('click', () => {
        sidebar.classList.remove('show');
        overlay.classList.remove('show');
      });
    }

    // Logout
    const logoutBtn = page.querySelector('#logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
          localStorage.clear();
          router.navigate('/login');
        }
      });
    }

    // Enlaces del sidebar
    const navLinks = page.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        // Cerrar sidebar en móvil
        if (window.innerWidth < 992) {
          sidebar.classList.remove('show');
          overlay.classList.remove('show');
        }
      });
    });
  }

  function setupImagePreview() {
    const imagenInput = page.querySelector('#imagen-plato');
    const previewContainer = page.querySelector('#preview-container');
    const previewImage = page.querySelector('#imagen-preview');

    if (imagenInput && previewContainer && previewImage) {
      imagenInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
          // Validar tipo de archivo
          const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
          if (!tiposPermitidos.includes(file.type)) {
            mostrarMensaje('Tipo de archivo no válido. Use JPG, JPEG o PNG.', 'error');
            imagenInput.value = '';
            return;
          }
          
          // Validar tamaño (5MB máximo)
          if (file.size > 5 * 1024 * 1024) {
            mostrarMensaje('La imagen es muy grande. Máximo 5MB.', 'error');
            imagenInput.value = '';
            return;
          }
          
          const reader = new FileReader();
          reader.onload = (e) => {
            previewImage.src = e.target.result;
            previewContainer.style.display = 'block';
          };
          reader.readAsDataURL(file);
        } else {
          previewContainer.style.display = 'none';
        }
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Obtener valores
    const nombre = page.querySelector('#nombre-plato').value.trim();
    const descripcion = page.querySelector('#descripcion-plato').value.trim();
    const precio = page.querySelector('#precio-plato').value;
    const categoria = page.querySelector('#categoria-plato').value;
    const imagenInput = page.querySelector('#imagen-plato');
    const imagen = imagenInput.files[0];

    // Validaciones
    if (!nombre || !descripcion || !precio || !categoria || !imagen) {
      mostrarMensaje('Por favor, complete todos los campos obligatorios (*)', 'error');
      return;
    }

    if (parseFloat(precio) <= 0) {
      mostrarMensaje('El precio debe ser mayor a 0', 'error');
      return;
    }

    // Validar que se haya seleccionado una categoría válida
    if (!categoria || categoria === '') {
      mostrarMensaje('Por favor, seleccione una categoría', 'error');
      return;
    }

    // Validar tipo de imagen
    const tiposPermitidos = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!tiposPermitidos.includes(imagen.type)) {
      mostrarMensaje('Tipo de imagen no válido. Use JPG, JPEG o PNG.', 'error');
      return;
    }

    // Validar tamaño de imagen (5MB máximo)
    if (imagen.size > 5 * 1024 * 1024) {
      mostrarMensaje('La imagen no debe superar los 5MB', 'error');
      return;
    }

    try {
      // Deshabilitar botón mientras se procesa
      const guardarBtn = page.querySelector('#guardarBtn');
      const originalText = guardarBtn.innerHTML;
      guardarBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Guardando...';
      guardarBtn.disabled = true;

      // Preparar datos
      const platoData = {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        categoria: parseInt(categoria), // Enviar el ID de la categoría
        imagen
      };

      // Llamar al servicio
      const resultado = await crearPlato(platoData);
      
      // Mostrar éxito
      mostrarMensaje('✅ Plato creado exitosamente', 'success');
      
      // Limpiar formulario
      page.querySelector('#form-crear-plato').reset();
      page.querySelector('#preview-container').style.display = 'none';
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        router.navigate('/admin/panel');
      }, 2000);

    } catch (error) {
      console.error('Error al crear plato:', error);
      
      // Mostrar mensaje de error específico
      let mensajeError = 'Error al crear el plato';
      if (error.message.includes('401') || error.message.includes('403')) {
        mensajeError = 'Sesión expirada. Por favor, inicie sesión nuevamente.';
      } else if (error.message.includes('categoría')) {
        mensajeError = 'Error con la categoría seleccionada. Por favor, verifique.';
      } else if (error.message.includes('imagen')) {
        mensajeError = 'Error al procesar la imagen. Por favor, intente con otra.';
      }
      
      mostrarMensaje(`❌ ${mensajeError}`, 'error');
    } finally {
      // Rehabilitar botón
      const guardarBtn = page.querySelector('#guardarBtn');
      if (guardarBtn) {
        guardarBtn.innerHTML = '<i class="bi bi-save me-1"></i> Guardar Plato';
        guardarBtn.disabled = false;
      }
    }
  }

  function mostrarMensaje(texto, tipo) {
    const container = page.querySelector('#mensaje-container');
    if (!container) return;

    // Limpiar mensajes anteriores
    container.innerHTML = '';

    const alertClass = tipo === 'error' ? 'alert-danger' : 
                      tipo === 'success' ? 'alert-success' : 'alert-warning';

    const mensaje = document.createElement('div');
    mensaje.className = `alert ${alertClass} alert-dismissible fade show`;
    mensaje.setAttribute('role', 'alert');
    mensaje.innerHTML = `
      ${texto}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    `;

    container.appendChild(mensaje);

    // Auto-eliminar después de 5 segundos
    setTimeout(() => {
      if (mensaje.parentNode) {
        const bsAlert = new bootstrap.Alert(mensaje);
        bsAlert.close();
      }
    }, 5000);
  }

  // Cleanup
  page.cleanup = () => {
    // Limpiar event listeners si es necesario
  };

  return page;
}