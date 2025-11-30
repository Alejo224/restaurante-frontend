// src/services/estadisticasAvanzadasService.js
import { fetchWithAuth } from '../auth/userService.js';

const API_BASE = 'http://localhost:8080/api';

export const estadisticasAvanzadasService = {
  // Obtener resumen general del dashboard
  async obtenerResumenGeneral() {
    try {
      const response = await fetchWithAuth(`${API_BASE}/dashboard/resumen`);
      
      if (!response.ok) throw new Error('Error al obtener resumen general');
    
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerResumenGeneral:', error);
      throw error;
    }
  },

  // Obtener ventas por rango de fechas
  async obtenerVentasPorFecha(inicio, fin) {
    try {
      const params = new URLSearchParams({
        inicio: inicio.toISOString().split('T')[0],
        fin: fin.toISOString().split('T')[0]
      });

      const response = await fetchWithAuth(`${API_BASE}/dashboard/ventas?${params}`);
      
      if (!response.ok) throw new Error('Error al obtener ventas por fecha');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerVentasPorFecha:', error);
      throw error;
    }
  },

  // Obtener platos populares
  async obtenerPlatosPopulares(limit = 10) {
    try {
      const response = await fetchWithAuth(`${API_BASE}/dashboard/top-platos?limit=${limit}`);
      
      if (!response.ok) throw new Error('Error al obtener platos populares');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerPlatosPopulares:', error);
      throw error;
    }
  },

  // Obtener distribución de pedidos por estado
  async obtenerDistribucionPedidos() {
    try {
      const response = await fetchWithAuth(`${API_BASE}/dashboard/pedidos-estados`);
      
      if (!response.ok) throw new Error('Error al obtener distribución de pedidos');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerDistribucionPedidos:', error);
      throw error;
    }
  },

  // Obtener estadísticas del día de hoy
  async obtenerEstadisticasHoy() {
    try {
      const response = await fetchWithAuth(`${API_BASE}/dashboard/estadisticas-hoy`);
      
      if (!response.ok) throw new Error('Error al obtener estadísticas de hoy');
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerEstadisticasHoy:', error);
      throw error;
    }
  }
};