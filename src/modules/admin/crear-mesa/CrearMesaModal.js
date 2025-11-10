// src/modules/admin/crear-mesa/CrearMesaModal.js

import { crearMesa } from '../../Mesa/mesaService.js';

// src/modules/admin/crear-mesa/CrearMesaModal.js
export function CrearMesaModal() {
  if (document.querySelector('#modalFondo')) return;

  const modalHTML = `
    <div id="modalFondo" style="position: fixed; top:0; left:0; width:100%; height:100%; background-color: rgba(0,0,0,0.5); display:flex; justify-content:center; align-items:center; z-index:1000;">
      <div id="crearMesaForm" style="background:white; border-radius:15px; box-shadow:0 5px 20px rgba(0,0,0,0.2); padding:25px; width:360px; animation: aparecer 0.3s ease-out;">
        <h4 style="text-align:center; margin-bottom:15px; color:#333;">🪑 Registrar Nueva Mesa</h4>
        <div class="form-group mb-3">
          <label for="nombreMesaInput" style="font-weight:500;">Nombre / Número</label>
          <input type="text" id="nombreMesaInput" class="form-control" placeholder="Ej: Mesa 4" />
        </div>
        <div class="form-group mb-3">
          <label for="capacidadInput" style="font-weight:500;">Capacidad</label>
          <input type="number" id="capacidadInput" class="form-control" placeholder="Ej: 4 personas" min="1"/>
        </div>
        <div style="display:flex; justify-content:center; gap:10px; margin-top:15px;">
          <button id="guardarMesaBtn" class="btn btn-success">💾 Guardar</button>
          <button id="cancelarMesaBtn" class="btn btn-danger">✖ Cancelar</button>
        </div>
      </div>
    </div>
    <style>
      @keyframes aparecer { from { transform: scale(0.8); opacity:0;} to { transform: scale(1); opacity:1;} }
    </style>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modalFondo = document.querySelector('#modalFondo');

  modalFondo.addEventListener('click', e => { if (e.target.id === 'modalFondo') modalFondo.remove(); });
  document.querySelector('#cancelarMesaBtn').addEventListener('click', () => modalFondo.remove());

  document.querySelector('#guardarMesaBtn').addEventListener('click', async () => {
    const nombreMesa = document.querySelector('#nombreMesaInput').value.trim();
    const capacidad = parseInt(document.querySelector('#capacidadInput').value);
    if (!nombreMesa || isNaN(capacidad) || capacidad <= 0) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/mesas', {
        method: 'POST',
        headers: { 'Content-Type':'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ nombreMesa, capacidad, estado: true })
      });
      if (!res.ok) throw new Error('Error al registrar la mesa');

      const nuevaMesa = await res.json();
      alert(`✅ Mesa "${nuevaMesa.nombreMesa}" registrada correctamente!`);
      modalFondo.remove();
      // Para refrescar la lista, podrías emitir un evento o recargar MesasList
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  });
}
