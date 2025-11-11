// src/modules/Mesa/mesaService.js
import { getToken, isAuthenticated, isAdmin, canCreate, canUpdate, canDelete } from '../auth/userService.js';

const API_URL = "http://localhost:8080/api/mesas";

/**
 * 🔐 Helper para hacer fetch con autenticación
 */
async function fetchWithAuth(url, options = {}) {
  const token = getToken();

  if (!token || !isAuthenticated()) {
    throw new Error('No hay sesión activa. Por favor, inicia sesión.');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  // Si no se envía FormData, agregamos Content-Type JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('No tienes permisos o tu sesión ha expirado.');
  }

  return response;
}

/**
 * 📋 Obtener todas las mesas (solo para usuarios autenticados)
 */
export async function obtenerMesas() {
  try {
    console.log('📡 Solicitando mesas al backend...');

    const response = await fetchWithAuth(API_URL);
    if (!response.ok) {
      throw new Error(`Error al obtener mesas: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Mesas obtenidas:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al obtener las mesas:', error);
    throw error;
  }
}

/**
 * ➕ Crear una nueva mesa
 */
export async function crearMesa(mesaData) {
  try {
    const token = getToken();

    const response = await fetch('http://localhost:8080/api/mesas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(mesaData)
    });

    if (!response.ok) {
      throw new Error(`Error al crear la mesa: ${response.status}`);
    }

    const data = await response.json();
    console.log('✅ Mesa creada:', data);
    return data;
  } catch (error) {
    console.error('❌ Error al crear mesa:', error);
    throw error;
  }
}

/**
 * 🗑 Eliminar una mesa por ID (opcional)
 */
export async function eliminarMesa(id) {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Error al eliminar la mesa: ${response.status}`);
    }

    console.log(`🧹 Mesa con ID ${id} eliminada correctamente`);
  } catch (error) {
    console.error('❌ Error al eliminar la mesa:', error);
    throw error;
  }
}