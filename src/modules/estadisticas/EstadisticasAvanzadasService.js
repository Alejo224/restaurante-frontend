// src/services/estadisticasAvanzadasService.js
import { fetchWithAuth } from '../auth/userService.js';

export class EstadisticasAvanzadasService {
  static async obtenerResumenGeneral() {
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/dashboard/resumen');
      if (!response.ok) throw new Error('Error al obtener resumen general');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo resumen general:', error);
      throw error;
    }
  }

  static async obtenerVentasPorFecha(inicio, fin) {
    try {
      const params = new URLSearchParams({
        inicio: inicio.toISOString().split('T')[0],
        fin: fin.toISOString().split('T')[0]
      });
      
      const response = await fetchWithAuth(`http://localhost:8080/api/dashboard/ventas?${params}`);
      if (!response.ok) throw new Error('Error al obtener ventas por fecha');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo ventas por fecha:', error);
      throw error;
    }
  }

  static async obtenerPlatosPopulares(limit = 10) {
    try {
      const response = await fetchWithAuth(`http://localhost:8080/api/dashboard/top-platos?limit=${limit}`);
      if (!response.ok) throw new Error('Error al obtener platos populares');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo platos populares:', error);
      throw error;
    }
  }

  static async obtenerDistribucionPedidos() {
    try {
      const response = await fetchWithAuth('http://localhost:8080/api/dashboard/pedidos-estados');
      if (!response.ok) throw new Error('Error al obtener distribución de pedidos');
      return await response.json();
    } catch (error) {
      console.error('Error obteniendo distribución de pedidos:', error);
      throw error;
    }
  }
}