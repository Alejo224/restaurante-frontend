// src/modules/menu/components/PlatoList.js
import { platoService } from '../services/platoService.js';

export function PlatoList(isAdminView = false) {
  const container = document.createElement('div');
  
  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">
        <i class="bi bi-list-ul me-2"></i>
        ${isAdminView ? 'Platos Registrados' : 'Nuestros Platos'}
      </h4>
      ${isAdminView ? `
        <button class="btn btn-primary btn-sm" id="refreshBtn">
          <i class="bi bi-arrow-clockwise me-1"></i>
          Actualizar
        </button>
      ` : ''}
    </div>

    <!-- Estado de carga -->
    <div id="loadingState" class="text-center py-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando platos...</span>
      </div>
      <p class="text-muted mt-2">Cargando platos...</p>
    </div>

    <!-- Lista de platos -->
    <div id="platosContainer" class="row" style="display: none;"></div>

    <!-- Estado vacío -->
    <div id="emptyState" class="text-center py-5" style="display: none;">
      <i class="bi bi-inbox display-4 text-muted"></i>
      <h5 class="text-muted mt-3">No hay platos disponibles</h5>
      <p class="text-muted">${isAdminView ? 'Comienza agregando el primer plato al menú.' : 'Próximamente tendremos nuevos platos.'}</p>
    </div>

    <!-- Estado de error -->
    <div id="errorState" class="alert alert-danger" style="display: none;">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <span id="errorMessage"></span>
    </div>
  `;

  // Cargar platos al inicializar
  loadPlatos(container, isAdminView);

  // Solo agregar botón de actualizar si es vista de admin
  if (isAdminView) {
    container.querySelector('#refreshBtn').addEventListener('click', () => {
      loadPlatos(container, isAdminView);
    });
  }

  return container;
}

// ========== FUNCIONES AUXILIARES ==========

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

  if (!platos || platos.length === 0) {
    platosContainer.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }

  // Mostrar container y generar HTML de platos
  platosContainer.style.display = 'flex';
  emptyState.style.display = 'none';

  platosContainer.innerHTML = platos.map(plato => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card border-0 shadow-sm card-hover h-100">
        <!-- Imagen del plato -->
        <div class="position-relative">
          <img 
            src="http://localhost:8080${plato.imagenUrl}" 
            class="card-img-top" 
            alt="${plato.nombre}"
            style="height: 200px; object-fit: cover;"
            onerror="this.src='https://via.placeholder.com/300x200?text=Imagen+No+Disponible'"
          >
          <span class="position-absolute top-0 end-0 m-2 badge ${plato.disponible ? 'bg-success' : 'bg-danger'}">
            ${plato.disponible ? 'Disponible' : 'No Disponible'}
          </span>
        </div>

        <div class="card-body d-flex flex-column">
          <!-- Información del plato -->
          <h5 class="card-title text-dark fw-bold">${plato.nombre}</h5>
          <p class="card-text text-muted flex-grow-1">${plato.descripcion || 'Sin descripción'}</p>
          
          <!-- Precio y categoría -->
          <div class="mb-2">
            <span class="fw-bold text-primary h5">$${plato.precio?.toLocaleString() || '0'}</span>
            <span class="badge bg-light text-dark ms-2">${plato.categoria?.nombreCategoria || 'Sin categoría'}</span>
          </div>

          <!-- Botones diferentes según la vista -->
          ${isAdminView ? `
            <div class="mt-auto">
              <div class="btn-group w-100" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm edit-plato" data-id="${plato.id}">
                  <i class="bi bi-pencil me-1"></i>Editar
                </button>
                <button type="button" class="btn btn-outline-danger btn-sm delete-plato" data-id="${plato.id}">
                  <i class="bi bi-trash me-1"></i>Eliminar
                </button>
              </div>
            </div>
          ` : `
            <div class="mt-auto">
              <button class="btn btn-primary w-100 add-to-cart" data-id="${plato.id}">
                <i class="bi bi-cart-plus me-1"></i>Agregar al Carrito
              </button>
            </div>
          `}
        </div>
      </div>
    </div>
  `).join('');

  // Solo agregar eventos de admin si es vista de admin
  if (isAdminView) {
    addAdminEventListeners(container, platos);
  } else {
    addUserEventListeners(container, platos);
  }
}

// Función para agregar eventos de administrador
function addAdminEventListeners(container, platos) {
  const platosContainer = container.querySelector('#platosContainer');
  
  // Botones de editar
  platosContainer.querySelectorAll('.edit-plato').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const platoId = e.currentTarget.dataset.id;
      const plato = platos.find(p => p.id == platoId);
      editarPlato(plato);
    });
  });

  // Botones de eliminar
  platosContainer.querySelectorAll('.delete-plato').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const platoId = e.currentTarget.dataset.id;
      const plato = platos.find(p => p.id == platoId);
      
      if (confirm(`¿Estás seguro de que quieres eliminar "${plato.nombre}"?`)) {
        try {
          await platoService.eliminarPlato(platoId);
          // Recargar la lista después de eliminar
          location.reload(); // Recarga simple por ahora
        } catch (error) {
          alert('Error al eliminar plato: ' + error.message);
        }
      }
    });
  });
}

// Función para agregar eventos de usuario normal
function addUserEventListeners(container, platos) {
  const platosContainer = container.querySelector('#platosContainer');
  
  // Botones de agregar al carrito
  platosContainer.querySelectorAll('.add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const platoId = e.currentTarget.dataset.id;
      const plato = platos.find(p => p.id == platoId);
      agregarAlCarrito(plato);
    });
  });
}

// Función para editar plato (placeholder)
function editarPlato(plato) {
  console.log('Editar plato:', plato);
  alert(`Función de edición para: ${plato.nombre}\n\nEsta funcionalidad será implementada por el equipo de desarrollo.`);
}

// Función para agregar al carrito (placeholder)
function agregarAlCarrito(plato) {
  console.log('Agregar al carrito:', plato);
  showToast(`"${plato.nombre}" agregado al carrito`, 'success');
}

// Función para mostrar notificaciones
function showToast(message, type = 'info') {
  // Crear toast element
  const toast = document.createElement('div');
  toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  toast.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
  toast.innerHTML = `
    <i class="bi bi-${type === 'success' ? 'check-circle' : 'info-circle'} me-2"></i>
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
  `;
  
  document.body.appendChild(toast);
  
  // Auto-remover después de 3 segundos
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3000);
}