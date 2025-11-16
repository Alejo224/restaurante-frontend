// src/modules/pedidos/services/AdminPedidosService.js
import { createPedidosService } from './PedidosService.js';

const API_BASE = 'http://localhost:8080/api';

export function createAdminPedidosService() {
  const baseService = createPedidosService();

  return {
    ...baseService,

    async obtenerTodosLosPedidos() {
      const token = localStorage.getItem("user_token") || localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_BASE}/pedidos/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },

    async actualizarEstadoPedido(pedidoId, nuevoEstado) {
      const token = localStorage.getItem("user_token") || localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_BASE}/reserva/${pedidoId}/estado`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },

    // NUEVO: Método para eliminar pedido
    async eliminarPedido(pedidoId) {
      const token = localStorage.getItem("user_token") || localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_BASE}/reserva/${pedidoId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    },

    // NUEVO: Método para marcar como pagado (conveniencia)
    async marcarComoPagado(pedidoId) {
      return await this.actualizarEstadoPedido(pedidoId, 'PENDIENTE');
    },

    // NUEVO: Método para cancelar pedido (conveniencia)
    async cancelarPedido(pedidoId) {
      return await this.actualizarEstadoPedido(pedidoId, 'CANCELADO');
    },

    // NUEVO: Método para completar pedido (conveniencia)
    async completarPedido(pedidoId) {
      return await this.actualizarEstadoPedido(pedidoId, 'COMPLETADO');
    },

    // Métodos específicos para admin que extienden los existentes
    obtenerOpcionesEstado(estadoActual) {
      const estados = [
        { value: 'BORRADOR', text: 'Por Pagar' },
        { value: 'PENDIENTE', text: 'Pendiente' },
        { value: 'COMPLETADO', text: 'Completado' },
        { value: 'CANCELADO', text: 'Cancelado' }
      ];

      return estados.map(estado => 
        `<option value="${estado.value}" ${estado.value === estadoActual ? 'selected' : ''}>
          ${estado.text}
        </option>`
      ).join('');
    },

    // Sobrescribir el método de contadores para incluir más estados si es necesario
    obtenerContadores(pedidos) {
      return pedidos.reduce(
        (counts, { estadoPedidoEnum }) => {
          counts[estadoPedidoEnum.toLowerCase()] =
            (counts[estadoPedidoEnum.toLowerCase()] || 0) + 1;
          counts.all++;
          return counts;
        },
        { all: 0, borrador: 0, pendiente: 0, completado: 0, cancelado: 0 }
      );
    }

  };
}