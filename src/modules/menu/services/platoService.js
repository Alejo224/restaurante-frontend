// src/modules/menu/services/platoService.js
const API_BASE = 'https://gestion-restaurante-api.onrender.com/api';

export const platoService = {
  // Obtener todos los platos
  async obtenerPlatos() {
    try {
      const response = await fetch(`${API_BASE}/platos`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Error al obtener platos');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPlatos:', error);
      throw error;
    }
  },

  // Crear plato
  async crearPlato(platoData) {
    try {
      const response = await fetch(`${API_BASE}/platos`, {
        method: 'POST',
        credentials: 'include',
        body: platoData // Puede ser FormData o JSON
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al crear plato');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en crearPlato:', error);
      throw error;
    }
  },

  // Actualizar plato
  async actualizarPlato(id, platoData) {
    try {
      const response = await fetch(`${API_BASE}/platos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(platoData)
      });

      if (!response.ok) throw new Error('Error al actualizar plato');
      return await response.json();
    } catch (error) {
      console.error('Error en actualizarPlato:', error);
      throw error;
    }
  },

  // Eliminar plato
  async eliminarPlato(id) {
    try {
      const response = await fetch(`${API_BASE}/platos/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) throw new Error('Error al eliminar plato');
      return await response.text();
    } catch (error) {
      console.error('Error en eliminarPlato:', error);
      throw error;
    }
  }
};