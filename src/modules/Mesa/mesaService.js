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