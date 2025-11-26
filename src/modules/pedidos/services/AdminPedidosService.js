// src/modules/admin/services/AdminPedidosService.js
const API_BASE = 'http://localhost:8080/api';

export function createAdminPedidosService() {
  return {
    //  Obtener todos los pedidos (admin)
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

    // Cancelar pedido (admin)
    async cancelarPedido(pedidoId, motivoCancelacion) {
      const token = localStorage.getItem("user_token") || localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      console.log('❌ [ADMIN] Cancelando pedido:', pedidoId, 'Motivo:', motivoCancelacion);

      const response = await fetch(`${API_BASE}/pedidos/${pedidoId}/cancelar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motivoCancelacion: motivoCancelacion
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error cancelando pedido:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      console.log('✅ [ADMIN] Pedido cancelado exitosamente');
      return await response.json();
    },

    // Actualizar estado del pedido
    async actualizarEstadoPedido(pedidoId, nuevoEstado) {
      const token = localStorage.getItem("user_token") || localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      console.log('🔄 [ADMIN] Actualizando estado del pedido:', pedidoId, '->', nuevoEstado);

      const response = await fetch(`${API_BASE}/pedidos/${pedidoId}/estado`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nuevoEstado: nuevoEstado
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error actualizando estado:', errorText);
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      console.log('✅ [ADMIN] Estado actualizado exitosamente');
      return await response.json();
    },

    // Marcar como pagado
    async marcarComoPagado(pedidoId) {
      return this.actualizarEstadoPedido(pedidoId, 'PENDIENTE');
    },

    // Métodos de utilidad (los mismos que el servicio normal)
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
    },

    obtenerClaseBadgeEstado(estado) {
      const states = {
        BORRADOR: "bg-warning text-dark",
        PENDIENTE: "bg-info text-white",
        COMPLETADO: "bg-success text-white",
        CANCELADO: "bg-danger text-white",
      };
      return states[estado] || "bg-secondary text-white";
    },

    obtenerTextoEstado(estado) {
      const estados = {
        BORRADOR: "Por Pagar",
        PENDIENTE: "Pendiente",
        COMPLETADO: "Completado",
        CANCELADO: "Cancelado",
      };
      return estados[estado] || estado;
    },

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

    obtenerIconoTipoServicio(tipo) {
      const iconos = {
        DOMICILIO: "bi bi-truck",
        RECOGER_PEDIDO: "bi bi-shop",
      };
      return iconos[tipo] || "bi bi-bag";
    },

    obtenerTextoTipoServicio(tipo) {
      const tipos = {
        DOMICILIO: "Entrega a Domicilio",
        RECOGER_PEDIDO: "Recoger en Tienda",
      };
      return tipos[tipo] || tipo;
    },

    formatearMoneda(monto) {
      return new Intl.NumberFormat("es-CO", {
        style: "currency",
        currency: "COP",
      }).format(monto);
    },

    formatearFecha(fechaISO) {
      const fecha = new Date(fechaISO);
      return fecha.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
  };
}