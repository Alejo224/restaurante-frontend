// src/modules/menu/services/platoService.js
const API_BASE = 'http://localhost:8080/api';

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

  // Eliminar plato
  async eliminarPlato(id) {
    try {
      const token = localStorage.getItem('jwtToken');
      
      const response = await fetch(`${API_BASE}/platos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Error al eliminar plato');
      }

      // Si la respuesta es exitosa pero no tiene contenido
      if (response.status === 204) {
        return { success: true, message: 'Plato eliminado correctamente' };
      }

      return await response.json();
    } catch (error) {
      console.error('Error en eliminarPlato:', error);
      throw error;
    }
  }
};