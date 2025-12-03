// src/modules/pedidos/services/PedidosService.js
const API_BASE = 'https://gestion-restaurante-api.onrender.com/api';

export function createPedidosService() {

  return {
    async obtenerPedidos() {
      const token = localStorage.getItem("user_token") || localStorage.getItem("authToken");
      
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await fetch(`${API_BASE}/pedidos`, {
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

    obtenerContadores(pedidos) {
      return pedidos.reduce(
        (counts, { estadoPedidoEnum }) => {
          counts[estadoPedidoEnum.toLowerCase()] =
            (counts[estadoPedidoEnum.toLowerCase()] || 0) + 1;
          counts.all++;
          return counts;
        },
        { all: 0, borrador: 0, pendiente: 0, completado: 0 }
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
      };
      return estados[estado] || estado;
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
    },

    async cancelarPedido(pedidoId, motivoCancelacion) {
      const token = localStorage.getItem("user_token") || localStorage.getItem("authToken");

      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      console.log("Cancelando pedido:", pedidoId, "Motivo:", motivoCancelacion);

      const response = await fetch(`${API_BASE}/pedidos/${pedidoId}/cancelar`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          motivoCancelacion
          })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      console.log("Pedido cancelado con éxito:", pedidoId);
      return await response.json();
    }
  };
}
