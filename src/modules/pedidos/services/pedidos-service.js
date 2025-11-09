class PedidosService {
    constructor() {
        this.baseURL = 'http://localhost:8080/api/pedidos';
    }

    async obtenerPedidos() {
        try {
            // ✅ Usar la función getToken() de tu módulo de autenticación
            const token = await this.obtenerTokenSeguro();
            
            if (!token) {
                throw new Error('No estás autenticado. Por favor inicia sesión.');
            }

            const response = await fetch(this.baseURL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error obteniendo pedidos:', error);
            throw error;
        }
    }

    async obtenerTokenSeguro() {
        // Intentar obtener el token de diferentes maneras
        try {
            // 1. Usar tu función exportada si está disponible
            if (typeof getToken === 'function') {
                return getToken();
            }
            
            // 2. Buscar en localStorage
            const token = localStorage.getItem('user_token');
            if (token) return token;
            
            // 3. Verificar si hay un usuario autenticado
            const userData = localStorage.getItem('user_data');
            if (userData) {
                const user = JSON.parse(userData);
                return user.token;
            }
            
            return null;
        } catch (error) {
            console.error('Error obteniendo token:', error);
            return null;
        }
    }

    formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    formatearMoneda(monto) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(monto);
    }

    obtenerIconoTipoServicio(tipoServicio) {
        const iconos = {
            'DOMICILIO': 'fas fa-truck',
            'RECOGER_PEDIDO': 'fas fa-store'
        };
        return iconos[tipoServicio] || 'fas fa-shopping-bag';
    }

    obtenerTextoEstado(estado) {
        const estados = {
            'BORRADOR': 'Por Pagar',
            'PENDIENTE': 'Pendiente',
            'COMPLETADO': 'Completado',
            'CANCELADO': 'Cancelado'
        };
        return estados[estado] || estado;
    }

    obtenerClaseBadgeEstado(estado) {
        const clases = {
            'BORRADOR': 'bg-warning text-dark',
            'PENDIENTE': 'bg-info text-white',
            'COMPLETADO': 'bg-success text-white',
            'CANCELADO': 'bg-danger text-white'
        };
        return clases[estado] || 'bg-secondary text-white';
    }
}