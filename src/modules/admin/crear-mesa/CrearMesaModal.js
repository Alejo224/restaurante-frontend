// src/modules/admin/crear-mesa/CrearMesaModal.js

import { crearMesa } from '../../Mesa/mesaService.js';
export function CrearMesaModal() {
  // Crear contenedor del modal
  const modal = document.createElement('div');
  modal.classList.add('modal-overlay');
  modal.innerHTML = `
    <div class="modal">
      <h2>Crear nueva mesa</h2>
      <form id="formCrearMesa">
        <label for="numero">Número de mesa:</label>
        <input type="number" id="numero" name="numero" required />

        <label for="capacidad">Capacidad:</label>
        <input type="number" id="capacidad" name="capacidad" required />

        <button type="submit">Crear</button>
        <button type="button" id="cerrarModal">Cancelar</button>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  // Cerrar modal
  modal.querySelector('#cerrarModal').addEventListener('click', () => {
    modal.remove();
  });

  // Enviar formulario
  modal.querySelector('#formCrearMesa').addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevaMesa = {
      numero: e.target.numero.value,
      capacidad: e.target.capacidad.value,
    };

    try {
      await crearMesa(nuevaMesa);
      alert('✅ Mesa creada con éxito!');
      modal.remove();
    } catch (error) {
      alert('❌ Error al crear la mesa: ' + error.message);
    }
  });
}