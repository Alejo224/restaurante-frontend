// src/modules/admin/pages/components/MesasList.js
import { obtenerMesas } from '../../../Mesa/mesaService.js';
import { CrearMesaModal } from '../../crear-mesa/CrearMesaModal.js';

export async function MesasList() {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">
        <i class="bi bi-table me-2"></i>
        Listado de Mesas
      </h4>
      <button class="btn btn-success btn-sm" id="crearMesaBtn">
        <i class="bi bi-plus-circle me-1"></i> Crear Mesa
      </button>
      <button class="btn btn-primary btn-sm" id="refreshBtn">
        <i class="bi bi-arrow-clockwise me-1"></i> Actualizar
      </button>
    </div>

    <div id="loadingState" class="text-center py-4">
      <div class="spinner-border text-primary" role="status"></div>
      <p class="text-muted mt-2">Cargando mesas...</p>
    </div>

    <div id="mesasContainer" class="row" style="display:none;"></div>

    <div id="errorState" class="alert alert-danger" style="display:none;">
      <i class="bi bi-exclamation-triangle me-2"></i>
      <span id="errorMessage"></span>
    </div>
  `;

  const crearMesaBtn = document.getElementById('crearMesaBtn');
if (crearMesaBtn) {
  crearMesaBtn.addEventListener('click', () => CrearMesaModal());
}

  const refreshBtn = container.querySelector('#refreshBtn');
  refreshBtn.addEventListener('click', () => loadMesas(container));

  await loadMesas(container);

  return container;
}

async function loadMesas(container) {
  const loading = container.querySelector('#loadingState');
  const mesasContainer = container.querySelector('#mesasContainer');
  const errorState = container.querySelector('#errorState');

  loading.style.display = 'block';
  mesasContainer.style.display = 'none';
  errorState.style.display = 'none';

  try {
    const mesas = await obtenerMesas();

    if (!mesas || mesas.length === 0) {
      mesasContainer.innerHTML = `
        <div class="text-center text-muted py-5">
          <i class="bi bi-inbox display-4"></i>
          <p class="mt-3">No hay mesas registradas.</p>
        </div>`;
    } else {
      mesasContainer.innerHTML = mesas.map(mesa => `
        <div class="col-md-4 mb-3">
          <div class="card border-0 shadow-sm p-3">
            <h5 class="fw-bold text-primary">Mesa #${mesa.id}</h5>
            <p><strong>Capacidad:</strong> ${mesa.capacidad || 'N/A'}</p>
            <p><strong>Estado:</strong> ${mesa.estado || 'False'}</p>
          </div>
        </div>
      `).join('');
    }

    loading.style.display = 'none';
    mesasContainer.style.display = 'flex';
  } catch (error) {
    console.error('❌ Error al cargar mesas:', error);
    loading.style.display = 'none';
    errorState.style.display = 'block';
    errorState.querySelector('#errorMessage').textContent = error.message;
  }
}
