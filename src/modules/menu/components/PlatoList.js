// src/modules/menu/components/PlatoList.js
import { platoService } from '../services/platoService.js';
import { eliminarPlato } from '../../admin/crear-plato/platosServices.js';
import { agregarAlCarrito } from '../../carrito/carritoService.js';

export function PlatoList(isAdminView = false) {
  const container = document.createElement('div');
  container.setAttribute('role', isAdminView ? 'main' : 'region');
  container.setAttribute('aria-label', isAdminView ? 'Lista de platos registrados' : 'Lista de platos disponibles');
  
  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 fw-bold text-dark m-0">
        <i class="bi bi-list-ul me-2" aria-hidden="true"></i>
        ${isAdminView ? 'Platos Registrados' : 'Nuestros Platos'}
      </h2>
      ${isAdminView ? `
        <button class="btn btn-primary btn-sm" id="refreshBtn" aria-label="Actualizar lista de platos">
          <i class="bi bi-arrow-clockwise me-1" aria-hidden="true"></i>
          Actualizar
        </button>
      ` : ''}
    </div>

    <!-- Estado de carga -->
    <div id="loadingState" class="text-center py-5" role="status" aria-live="polite">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando platos...</span>
      </div>
      <p class="text-muted mt-2">Cargando platos...</p>
    </div>

    <!-- Lista de platos -->
    <div id="platosContainer" class="row" style="display: none;" aria-live="polite"></div>

    <!-- Estado vacío -->
    <div id="emptyState" class="text-center py-5" style="display: none;" role="status" aria-live="polite">
      <i class="bi bi-inbox display-4 text-muted" aria-hidden="true"></i>
      <h3 class="h5 text-muted mt-3">${isAdminView ? 'No hay platos registrados' : 'No hay platos disponibles'}</h3>
      <p class="text-muted">${isAdminView ? 'Comienza agregando el primer plato al menú.' : 'Todos nuestros platos están temporalmente agotados. ¡Vuelve pronto!'}</p>
    </div>

    <!-- Estado de error -->
    <div id="errorState" class="alert alert-danger" style="display: none;" role="alert" aria-live="assertive">
      <i class="bi bi-exclamation-triangle me-2" aria-hidden="true"></i>
      <span id="errorMessage"></span>
      <button type="button" class="btn-close ms-2" data-bs-dismiss="alert" aria-label="Cerrar mensaje de error"></button>
    </div>

    <!-- Área de anuncios para accesibilidad -->
    <div class="visually-hidden" aria-live="polite" aria-atomic="true">
      <div id="ariaAnnouncer"></div>
    </div>
  `;

  // Cargar platos al inicializar
  setTimeout(() => loadPlatos(container, isAdminView), 0);

  // Solo agregar botón de actualizar si es vista de admin
  if (isAdminView) {
    const refreshBtn = container.querySelector('#refreshBtn');
    refreshBtn.addEventListener('click', () => {
      announceToScreenReader(container, 'Actualizando lista de platos...');
      loadPlatos(container, isAdminView);
    });
  }

  return container;
}

// ========== FUNCIONES AUXILIARES MEJORADAS ==========

// Función para anuncios de screen reader
function announceToScreenReader(container, message) {
  const announcer = container.querySelector('#ariaAnnouncer');
  if (announcer) {
    announcer.textContent = message;
  }
}

// Función para mostrar estado de carga
function showLoading(container) {
  container.querySelector('#loadingState').style.display = 'block';
  container.querySelector('#platosContainer').style.display = 'none';
  container.querySelector('#emptyState').style.display = 'none';
  container.querySelector('#errorState').style.display = 'none';
}

// Función para mostrar error
function showError(container, message) {
  container.querySelector('#loadingState').style.display = 'none';
  container.querySelector('#platosContainer').style.display = 'none';
  container.querySelector('#emptyState').style.display = 'none';
  
  const errorState = container.querySelector('#errorState');
  errorState.querySelector('#errorMessage').textContent = message;
  errorState.style.display = 'block';
  
  announceToScreenReader(container, `Error: ${message}`);
}

// Función para cargar y mostrar los platos
async function loadPlatos(container, isAdminView = false) {
  showLoading(container);
  
  try {
    const platos = await platoService.obtenerPlatos();
    renderPlatos(container, platos, isAdminView);
  } catch (error) {
    showError(container, error.message);
  }
}

// Función para renderizar la lista de platos
function renderPlatos(container, platos, isAdminView = false) {
  const platosContainer = container.querySelector('#platosContainer');
  const emptyState = container.querySelector('#emptyState');
  
  // Ocultar estados
  container.querySelector('#loadingState').style.display = 'none';
  container.querySelector('#errorState').style.display = 'none';

  // ✅ FILTRAR PLATOS: Si no es admin, mostrar solo los disponibles
  let platosAMostrar = platos;
  if (!isAdminView) {
    platosAMostrar = platos.filter(plato => plato.disponible === true);
    console.log(`👤 Vista usuario: Mostrando ${platosAMostrar.length} de ${platos.length} platos (solo disponibles)`);
  } else {
    console.log(`👨‍💼 Vista admin: Mostrando todos los ${platos.length} platos`);
  }

  if (!platosAMostrar || platosAMostrar.length === 0) {
    platosContainer.style.display = 'none';
    emptyState.style.display = 'block';
    
    // Mensaje específico según la vista
    const emptyTitle = emptyState.querySelector('h3');
    const emptyMessage = emptyState.querySelector('p');
    
    if (isAdminView) {
      emptyTitle.textContent = 'No hay platos registrados';
      emptyMessage.textContent = 'Comienza agregando el primer plato al menú.';
    } else {
      emptyTitle.textContent = 'No hay platos disponibles';
      emptyMessage.textContent = 'Todos nuestros platos están temporalmente agotados. ¡Vuelve pronto!';
    }
    
    announceToScreenReader(container, emptyTitle.textContent);
    return;
  }

  // Mostrar container y generar HTML de platos
  platosContainer.style.display = 'flex';
  emptyState.style.display = 'none';

  platosContainer.innerHTML = platosAMostrar.map(plato => `
    <div class="col-md-6 col-lg-4 mb-4" role="listitem">
      <article class="card border-0 shadow-sm card-hover h-100 ${!plato.disponible && !isAdminView ? 'opacity-50' : ''}"
               aria-labelledby="plato-title-${plato.id}" aria-describedby="plato-desc-${plato.id}">
        <!-- Imagen del plato -->
        <div class="position-relative">
          <img 
            src="https://gestion-restaurante-api.onrender.com${plato.imagenUrl}" 
            class="card-img-top" 
            alt="${plato.nombre}"
            style="height: 200px; object-fit: cover;"
            loading="lazy"
            onerror="this.src='https://via.placeholder.com/300x200/6c757d/ffffff?text=Imagen+No+Disponible'"
          >
          <!-- Badge de estado (solo para admin o si no está disponible) -->
          ${(isAdminView || !plato.disponible) ? `
            <span class="position-absolute top-0 end-0 m-2 badge ${plato.disponible ? 'bg-success' : 'bg-danger'}">
              ${plato.disponible ? 'Disponible' : 'No Disponible'}
              <span class="visually-hidden">Estado: ${plato.disponible ? 'disponible' : 'no disponible'}</span>
            </span>
          ` : ''}
          
          <!-- Overlay para platos no disponibles en vista usuario -->
          ${!plato.disponible && !isAdminView ? `
            <div class="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 d-flex align-items-center justify-content-center">
              <span class="text-white fw-bold">NO DISPONIBLE</span>
            </div>
          ` : ''}
        </div>

        <div class="card-body d-flex flex-column">
          <!-- Información del plato -->
          <h3 id="plato-title-${plato.id}" class="h5 card-title text-dark fw-bold mb-2">${plato.nombre}</h3>
          <p id="plato-desc-${plato.id}" class="card-text text-muted flex-grow-1 mb-3">${plato.descripcion || 'Sin descripción'}</p>
          
          <!-- Precio y categoría -->
          <div class="mb-3">
            <span class="fw-bold text-primary h5" aria-label="Precio: $${plato.precio?.toLocaleString() || '0'} pesos colombianos">
              COP $ ${plato.precio?.toLocaleString() || '0'}
            </span>
            <span class="badge bg-light text-dark border ms-2" aria-label="Categoría: ${plato.categoria?.nombreCategoria || 'Sin categoría'}">
              ${plato.categoria?.nombreCategoria || 'Sin categoría'}
            </span>
          </div>

          <!-- Botones diferentes según la vista -->
          ${isAdminView ? `
            <div class="mt-auto">
              <div class="btn-group w-100" role="group" aria-label="Acciones para ${plato.nombre}">
                <button type="button" class="btn btn-outline-primary btn-sm edit-plato" 
                        data-id="${plato.id}" data-name="${plato.nombre}"
                        aria-label="Editar ${plato.nombre}">
                  <i class="bi bi-pencil me-1" aria-hidden="true"></i>Editar
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm delete-plato" 
                        data-id="${plato.id}" data-name="${plato.nombre}"
                        aria-label="Eliminar ${plato.nombre}">
                  <i class="bi bi-trash me-1" aria-hidden="true"></i>Eliminar
                </button>
              </div>
            </div>
          ` : `
            <!-- Botón de agregar al carrito (solo si está disponible) -->
            ${plato.disponible ? `
              <div class="mt-auto">
                <button type="button" class="btn btn-primary w-100 add-to-cart" 
                        data-id="${plato.id}" data-name="${plato.nombre}"
                        aria-label="Agregar ${plato.nombre} al carrito por $${plato.precio?.toLocaleString() || '0'}">
                  <i class="bi bi-cart-plus me-1" aria-hidden="true"></i>Agregar al Carrito
                </button>
              </div>
            ` : `
              <div class="mt-auto">
                <button type="button" class="btn btn-outline-secondary w-100" disabled
                        aria-label="${plato.nombre} no disponible">
                  <i class="bi bi-slash-circle me-1" aria-hidden="true"></i>No Disponible
                </button>
              </div>
            `}
          `}
        </div>
      </article>
    </div>
  `).join('');

  // Anunciar carga completada
  announceToScreenReader(container, `Lista cargada con ${platosAMostrar.length} platos`);

  // Agregar eventos según el tipo de vista
  if (isAdminView) {
    addAdminEventListeners(container, platosAMostrar);
  } else {
    addUserEventListeners(container, platosAMostrar);
  }
}

// Función para agregar eventos de administrador
function addAdminEventListeners(container, platos) {
  const platosContainer = container.querySelector('#platosContainer');
  
  // Event delegation para mejor rendimiento
  platosContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.edit-plato') || e.target.closest('.delete-plato');
    if (!target) return;

    const platoId = target.dataset.id;
    const platoName = target.dataset.name;
    const plato = platos.find(p => p.id == platoId);

    if (target.classList.contains('edit-plato')) {
      announceToScreenReader(container, `Editando plato: ${platoName}`);
      editarPlato(plato);
    } else if (target.classList.contains('delete-plato')) {
      handleDeletePlato(container, platoId, platoName, platos);
    }
  });

  // Soporte para teclado
  platosContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('.edit-plato') || e.target.closest('.delete-plato');
      if (!target) return;

      e.preventDefault();
      const platoId = target.dataset.id;
      const platoName = target.dataset.name;
      const plato = platos.find(p => p.id == platoId);

      if (target.classList.contains('edit-plato')) {
        editarPlato(plato);
      } else if (target.classList.contains('delete-plato')) {
        handleDeletePlato(container, platoId, platoName, platos);
      }
    }
  });
}

// Función para manejar eliminación de platos
async function handleDeletePlato(container, platoId, platoName, platos) {
  if (confirm(`¿Estás seguro de que quieres eliminar "${platoName}"? Esta acción no se puede deshacer.`)) {
    try {
      announceToScreenReader(container, `Eliminando plato: ${platoName}`);
      await eliminarPlato(platoId);
      announceToScreenReader(container, `Plato ${platoName} eliminado correctamente`);
      showToast(`${platoName} eliminado correctamente`, 'success');
      // Recargar la lista después de eliminar
      loadPlatos(container, true);
    } catch (error) {
      announceToScreenReader(container, `Error al eliminar plato: ${error.message}`);
      showToast(`Error al eliminar plato: ${error.message}`, 'danger');
    }
  }
}

// Función para agregar eventos de usuario normal
function addUserEventListeners(container, platos) {
  const platosContainer = container.querySelector('#platosContainer');
  
  // Event delegation para agregar al carrito
  platosContainer.addEventListener('click', (e) => {
    const target = e.target.closest('.add-to-cart');
    if (!target) return;

    const platoId = target.dataset.id;
    const platoName = target.dataset.name;
    const plato = platos.find(p => p.id == platoId);
    
    // Doble verificación de disponibilidad
    if (plato && plato.disponible) {
      announceToScreenReader(container, `Agregando ${platoName} al carrito`);
      agregarAlCarrito(plato);
      showToast(`${platoName} agregado al carrito`, 'success');
    } else {
      announceToScreenReader(container, `${platoName} no está disponible`);
      showToast('Este plato ya no está disponible', 'warning');
    }
  });

  // Soporte para teclado
  platosContainer.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      const target = e.target.closest('.add-to-cart');
      if (!target) return;

      e.preventDefault();
      const platoId = target.dataset.id;
      const platoName = target.dataset.name;
      const plato = platos.find(p => p.id == platoId);
      
      if (plato && plato.disponible) {
        agregarAlCarrito(plato);
        showToast(`${platoName} agregado al carrito`, 'success');
      } else {
        showToast('Este plato ya no está disponible', 'warning');
      }
    }
  });
}

// Función para editar plato
function editarPlato(plato) {
  console.log('🔄 Redirigiendo a edición del plato:', plato);
  
  if (plato && plato.id) {
    // Redirección directa al archivo HTML de actualización
    window.location.href = `/restaurante-frontend/src/modules/admin/actualizar-plato/index.html?id=${plato.id}`;
  } else {
    showToast('Error: No se puede editar el plato. ID no disponible.', 'danger');
  }
}

// Función para mostrar notificaciones mejorada
function showToast(message, type = 'info') {
  // Verificar si ya existe un toast
  const existingToast = document.querySelector('.global-toast');
  if (existingToast) {
    existingToast.remove();
  }

  // Crear toast element
  const toast = document.createElement('div');
  toast.className = `global-toast alert alert-${type} alert-dismissible fade show position-fixed`;
  toast.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'assertive');
  toast.setAttribute('aria-atomic', 'true');
  
  const icons = {
    success: 'check-circle',
    danger: 'exclamation-triangle',
    warning: 'exclamation-circle',
    info: 'info-circle'
  };
  
  toast.innerHTML = `
    <i class="bi bi-${icons[type] || 'info-circle'} me-2" aria-hidden="true"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar notificación"></button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remover después de 4 segundos
  setTimeout(() => {
    if (toast.parentNode) {
      toast.remove();
    }
  }, 4000);
}

// CSS adicional para mejoras de accesibilidad y rendimiento
const style = document.createElement('style');
style.textContent = `
  .card-hover {
    transition: all 0.2s ease-in-out;
    will-change: transform;
  }
  
  .card-hover:hover,
  .card-hover:focus-within {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
  }
  
  .btn:focus-visible,
  .card:focus-visible {
    outline: 3px solid #0d6efd;
    outline-offset: 2px;
  }
  
  .global-toast {
    animation: slideInRight 0.3s ease-out;
  }
  
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  /* Alto contraste */
  @media (prefers-contrast: high) {
    .card {
      border: 2px solid #000 !important;
    }
    
    .badge {
      border: 1px solid #000;
    }
  }
  
  /* Movimiento reducido */
  @media (prefers-reduced-motion: reduce) {
    .card-hover {
      transition: none;
    }
    
    .global-toast {
      animation: none;
    }
  }
  
  /* Mejoras de rendimiento para imágenes */
  .card-img-top {
    content-visition: auto;
  }
`;
document.head.appendChild(style);