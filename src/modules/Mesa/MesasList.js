
 // src/modules/Mesa/components/MesaList.js
import { obtenerMesas, cambiarEstadoMesa, eliminarMesa,  } from './mesaService.js';

export async function MesasList() {
  const container = document.createElement('div');
  container.innerHTML = `
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="fw-bold text-dark">
        <i class="bi bi-table me-2"></i>
        Listado de Mesas
      </h4>
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

  container.querySelector('#refreshBtn').addEventListener('click', () => {
    loadMesas(container);
  });

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
            
            <h5 class="fw-bold text-primary">${mesa.nombreMesa}</h5>
            <p><strong>Capacidad:</strong> ${mesa.capacidad || 'N/A'}</p>

            <!-- ESTADO CON SWITCH -->
            <div class="d-flex align-items-center justify-content-between mt-3">
              <div>
                <strong>Estado:</strong>
                <span id="estado-${mesa.id}" class="${mesa.estado ? 'text-success' : 'text-danger'} ms-1">
                  ${mesa.estado ? 'Disponible' : 'No Disponible'}
                </span>
              </div>

              <!-- SWITCH -->
              <div class="form-check form-switch">
                <input 
                  class="form-check-input mesa-switch" 
                  type="checkbox" 
                  data-id="${mesa.id}"
                  ${mesa.estado ? 'checked' : ''}
                >
              </div>
            </div>

            <!-- BOTÓN ELIMINAR -->
            <button 
              class="btn btn-sm btn-danger w-100 mt-3 eliminar-mesa-btn" 
              data-id="${mesa.id}"
            >
              <i class="bi bi-trash me-1"></i> Eliminar Mesa
            </button>

          </div>
        </div>
      `).join('');

      // Eventos Switch
      mesasContainer.querySelectorAll(".mesa-switch").forEach(sw => {
        sw.addEventListener("change", async (e) => {
          const idMesa = e.target.dataset.id;
          const nuevoEstado = e.target.checked;

          try {
            await cambiarEstadoMesa(idMesa, nuevoEstado);
            document.querySelector(`#estado-${idMesa}`).textContent = nuevoEstado ? "Disponible" : "No Disponible";
            document.querySelector(`#estado-${idMesa}`).className = nuevoEstado ? "text-success" : "text-danger";
          } catch (error) {
            alert("Error al cambiar estado: " + error.message);
          }
        });
      });

      // Evento eliminar
      mesasContainer.querySelectorAll(".eliminar-mesa-btn").forEach(btn => {
        btn.addEventListener("click", async (e) => {
          const id = e.target.dataset.id;

          if (!confirm("¿Seguro que deseas eliminar esta mesa?")) return;

          try {
            await eliminarMesa(id);
            alert("Mesa eliminada correctamente");
            loadMesas(container);
          } catch (error) {
            alert("Error al eliminar mesa: " + error.message);
          }
        });
      });

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



