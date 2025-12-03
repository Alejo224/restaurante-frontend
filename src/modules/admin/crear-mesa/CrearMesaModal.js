// src/modules/admin/crear-mesa/CrearMesaModal.js

// 🔹 Importar funciones de autenticación si ya las tienes en tu sistema
// (ajusta la ruta si tu proyecto la tiene diferente)
import { getToken, isAuthenticated, isAdmin, canCreate } from '../../auth/userService.js';

export function CrearMesaModal() {
  // Verificar si ya existe un modal abierto
  if (document.querySelector('#modalFondo')) return;

  const modalHTML = `
    <div id="modalFondo" style="
      position: fixed; 
      top: 0; left: 0; 
      width: 100%; height: 100%;
      background-color: rgba(0,0,0,0.5);
      display: flex; justify-content: center; align-items: center;
      z-index: 1000;
    ">
      <div id="crearMesaForm" style="
        background: white;
        border-radius: 15px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.2);
        padding: 25px;
        width: 360px;
        animation: aparecer 0.3s ease-out;
      ">
        <h4 style="text-align:center; margin-bottom:15px; color:#333;">🪑 Registrar Nueva Mesa</h4>
        <div class="form-group mb-3">
          <label for="nombreMesaInput" style="font-weight:500;">Nombre / Número</label>
          <input type="text" id="nombreMesaInput" class="form-control" placeholder="Ej: Mesa 4" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-top: 5px;
          "/>
        </div>
        <div class="form-group mb-3">
          <label for="capacidadInput" style="font-weight:500;">Capacidad</label>
          <input type="number" id="capacidadInput" class="form-control" placeholder="Ej: 4 personas" min="1" style="
            width: 100%;
            padding: 8px;
            border: 1px solid #ccc;
            border-radius: 8px;
            margin-top: 5px;
          "/>
        </div>
        <div style="display:flex; justify-content:center; gap:10px; margin-top:15px;">
          <button id="guardarMesaBtn" style="
            background-color: #28a745;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            transition: 0.2s;
          ">💾 Guardar</button>
          <button id="cancelarMesaBtn" style="
            background-color: #dc3545;
            color: white;
            border: none;
            border-radius: 8px;
            padding: 8px 16px;
            cursor: pointer;
            transition: 0.2s;
          ">✖ Cancelar</button>
        </div>
      </div>
    </div>

    <style>
      @keyframes aparecer {
        from { transform: scale(0.8); opacity: 0; }
        to { transform: scale(1); opacity: 1; }
      }
    </style>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHTML);

  const modalFondo = document.querySelector('#modalFondo');

  // Cerrar modal al hacer clic fuera del cuadro
  modalFondo.addEventListener('click', (e) => {
    if (e.target.id === 'modalFondo') modalFondo.remove();
  });

  // Botón cancelar
  document.querySelector('#cancelarMesaBtn').addEventListener('click', () => {
    modalFondo.remove();
  });

  // Botón guardar
  document.querySelector('#guardarMesaBtn').addEventListener('click', async () => {
    const nombreMesa = document.querySelector('#nombreMesaInput').value.trim();
    const capacidad = parseInt(document.querySelector('#capacidadInput').value);

    // ✅ Validar campos
    if (!nombreMesa || isNaN(capacidad) || capacidad <= 0) {
      alert('Por favor completa todos los campos correctamente.');
      return;
    }

    // ✅ Validar autenticación y permisos
    if (!isAuthenticated()) {
      alert('⚠️ No estás autenticado. Inicia sesión nuevamente.');
      window.location.href = '/login.html';
      return;
    }

    if (!canCreate() || !isAdmin()) {
      alert('🚫 No tienes permisos para crear mesas.');
      return;
    }

    try {
      const token = getToken(); // ✅ Obtener token correctamente
      const res = await fetch('https://gestion-restaurante-api.onrender.com/api/mesas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // ✅ "Bearer" con mayúscula
        },
        body: JSON.stringify({
          nombreMesa,
          capacidad,
          estado: true
        })
      });

      // ✅ Manejar errores del backend
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al registrar la mesa');
      }

      // ✅ Manejar respuesta vacía o JSON
      const text = await res.text();
      const nuevaMesa = text ? JSON.parse(text) : null;

      alert(
        nuevaMesa
          ? `✅ Mesa "${nuevaMesa.nombreMesa}" registrada correctamente!`
          : '✅ Mesa registrada correctamente!'
      );

      // Cerrar modal y actualizar lista
      modalFondo.remove();
      if (typeof actualizarMesas === 'function') {
        actualizarMesas();
      }
    } catch (error) {
      console.error(error);
      alert('Ocurrió un error: ' + error.message);
    }
  });
}
