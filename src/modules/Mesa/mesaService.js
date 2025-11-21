    // src/modules/Mesa/mesaService.js
import { getToken, isAuthenticated } from '../auth/userService.js';

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

  if (!(options.body instanceof FormData) && !options.headers?.['Content-Type']) {
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
 * 📋 Obtener mesas
 */
export async function obtenerMesas() {
  try {
    console.log('📡 Solicitando mesas al backend...');

    const response = await fetchWithAuth(API_URL);
    if (!response.ok) {
      throw new Error('Error al obtener mesas: ${response.status}');
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
 * 🔄 Cambiar estado de mesa
 */
   
export async function cambiarEstadoMesa(id, nuevoEstado) {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`,{
      method: "PUT",
      body: JSON.stringify({ estado: nuevoEstado })
    });

    if (!response.ok) {
      throw new Error("Error al actualizar el estado");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Error al cambiar estado:", error);
    throw error;
  }
}

/**
 * 🗑️ Eliminar mesa
 */
export async function eliminarMesa(id) {
  try {
    const response = await fetchWithAuth(`${API_URL}/${id}`, {
      method: "DELETE"
    });

    if (!response.ok) {
      throw new Error("Error al eliminar la mesa");
    }

    return true;
  } catch (error) {
    console.error("❌ Error al eliminar mesa:", error);
    throw error; 
  }
}