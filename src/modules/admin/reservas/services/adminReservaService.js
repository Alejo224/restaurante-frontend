// src/modules/admin/reservas/services/adminReservaService.js
import { fetchWithAuth, getCurrentUser } from '../../../auth/userService.js';

const API_BASE_URL = 'http://localhost:8080';

export const adminReservaService = {
  // Obtener todas las reservas (admin) - NUEVO ENDPOINT
  async obtenerTodasLasReservas() {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/reserva/all`);
      
      if (!response.ok) {
        throw new Error(`Error al obtener las reservas (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error en obtenerTodasLasReservas:', error);
      throw error;
    }
  },

  // Actualizar estado de reserva - NUEVO MÉTODO
  async actualizarEstadoReserva(reservaId, nuevoEstado) {
    try {
      const response = await fetchWithAuth(`${API_BASE_URL}/api/reserva/${reservaId}/estado`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        throw new Error(`Error al actualizar estado (${response.status})`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en actualizarEstadoReserva:', error);
      throw error;
    }
  },

  // Cancelar reserva - MÉTODO EXISTENTE
  async cancelarReserva(reservaId) {
    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token

    if (!token) {
        console.log("error token invalido");
        return [];
    }


    try {
        const response = await fetch(`${API_BASE_URL}/api/reserva/${reservaId}/cancelar`, {
            method: 'PUT', //Usamos el DELETE como en el postman para eliminar la reserva
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error al actualizar la reserva (${response.status}-${response.statusText})`);
        }

        if(response.status === 204){
            return { message: 'Reserva cancelada con exito' };
        }
        // Solo intenta leer JSON si tiene contenido
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };

    } catch (error) {
        console.error("Error en la llamada al API para cancelar la reserva", error);
        return null; // Devolvemos null en caso de error
    }
  },

  // Formatear fecha para mostrar - MÉTODO HELPER
  formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },

  // Formatear hora - MÉTODO HELPER
  formatearHora(horaString) {
    if (!horaString) return '';
    return horaString.substring(0, 5); // Extrae solo HH:MM
  },

  // Obtener clase CSS según estado - MÉTODO HELPER
  obtenerClaseEstado(estado) {
    const clases = {
      'CONFIRMADA': 'bg-success',
      'PENDIENTE': 'bg-warning',
      'CANCELADA': 'bg-danger',
      'COMPLETADA': 'bg-info'
    };
    return clases[estado] || 'bg-secondary';
  },

  // Obtener texto legible del estado - MÉTODO HELPER
  obtenerTextoEstado(estado) {
    const textos = {
      'CONFIRMADA': 'Confirmada',
      'PENDIENTE': 'Pendiente',
      'CANCELADA': 'Cancelada',
      'COMPLETADA': 'Completada'
    };
    return textos[estado] || estado;
  }
};