class HistorialPedidos {
    constructor() {
        this.pedidosService = new PedidosService();
        this.pedidos = [];
        this.filtroActual = 'all';
        this.init();
    }

    async init() {
        // ✅ Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.inicializarComponente();
            });
        } else {
            this.inicializarComponente();
        }
    }

    async inicializarComponente() {
        try {
            // ✅ Verificar que los elementos existan
            if (!this.verificarElementosDOM()) {
                console.error('❌ No se encontraron los elementos del DOM necesarios');
                return;
            }

            await this.cargarPedidos();
            this.setupEventListeners();
        } catch (error) {
            console.error('Error inicializando historial:', error);
        }
    }

    verificarElementosDOM() {
        const elementosRequeridos = [
            'lista-pedidos-container',
            'loading-spinner', 
            'sin-pedidos',
            'count-all',
            'count-borrador',
            'count-pendiente',
            'count-completado'
        ];

        for (const id of elementosRequeridos) {
            if (!document.getElementById(id)) {
                console.error(`❌ Elemento no encontrado: #${id}`);
                return false;
            }
        }

        console.log('✅ Todos los elementos del DOM encontrados');
        return true;
    }

    async cargarPedidos() {
        try {
            this.mostrarLoading(true);
            this.ocultarSinPedidos();
            this.limpiarContainer();

            this.pedidos = await this.pedidosService.obtenerPedidos();
            this.renderizarPedidos();
            this.actualizarContadores();
        } catch (error) {
            this.mostrarError('Error al cargar los pedidos: ' + error.message);
        } finally {
            this.mostrarLoading(false);
        }
    }

    renderizarPedidos() {
        const container = document.getElementById('lista-pedidos-container');
        
        if (!container) {
            console.error('❌ Container no encontrado');
            return;
        }

        if (this.pedidos.length === 0) {
            this.mostrarSinPedidos();
            return;
        }

        const pedidosFiltrados = this.filtrarPedidos(this.pedidos);
        
        if (pedidosFiltrados.length === 0) {
            this.mostrarSinPedidosFiltro();
            return;
        }

        const componenteHTML = this.generarComponenteLista(pedidosFiltrados);
        container.innerHTML = componenteHTML;
    }

    filtrarPedidos(pedidos) {
        if (this.filtroActual === 'all') {
            return pedidos;
        }
        return pedidos.filter(pedido => pedido.estadoPedidoEnum === this.filtroActual);
    }

    generarComponenteLista(pedidos) {
        // ✅ Verificar si el template existe
        const template = document.getElementById('pedido-template');
        if (!template) {
            console.error('❌ Template de pedido no encontrado');
            return '<div class="alert alert-warning">Error: Template no encontrado</div>';
        }

        let html = '<div class="pedidos-list">';

        pedidos.forEach(pedido => {
            let pedidoHTML = template.innerHTML;
            
            // Reemplazar placeholders con datos reales
            pedidoHTML = pedidoHTML
                .replace(/{id}/g, pedido.id)
                .replace(/{estado}/g, pedido.estadoPedidoEnum)
                .replace(/{estado-badge}/g, this.pedidosService.obtenerClaseBadgeEstado(pedido.estadoPedidoEnum))
                .replace(/{estado-texto}/g, this.pedidosService.obtenerTextoEstado(pedido.estadoPedidoEnum))
                .replace(/{total}/g, this.pedidosService.formatearMoneda(pedido.total))
                .replace(/{fecha}/g, this.pedidosService.formatearFecha(pedido.fechaPedido))
                .replace(/{tipo-icono}/g, this.pedidosService.obtenerIconoTipoServicio(pedido.tipoServicio))
                .replace(/{tipo-servicio}/g, this.obtenerTextoTipoServicio(pedido.tipoServicio))
                .replace(/{info-especifica}/g, this.generarInfoEspecifica(pedido))
                .replace(/{cantidad-productos}/g, pedido.detalles.length)
                .replace(/{lista-productos}/g, this.generarListaProductos(pedido.detalles))
                .replace(/{notas-section}/g, this.generarNotasSection(pedido.notas))
                .replace(/{btn-pagar-class}/g, pedido.estadoPedidoEnum === 'BORRADOR' ? 'btn-primary' : 'btn-outline-primary')
                .replace(/{btn-pagar-disabled}/g, pedido.estadoPedidoEnum !== 'BORRADOR' ? 'disabled' : '');

            html += pedidoHTML;
        });

        html += '</div>';
        return html;
    }

    obtenerTextoTipoServicio(tipoServicio) {
        const tipos = {
            'DOMICILIO': 'Entrega a Domicilio',
            'RECOGER_PEDIDO': 'Recoger en Tienda'
        };
        return tipos[tipoServicio] || tipoServicio;
    }

    generarInfoEspecifica(pedido) {
        if (pedido.tipoServicio === 'DOMICILIO') {
            return `
                <div class="info-domicilio">
                    <small class="text-muted">
                        <i class="fas fa-map-marker-alt me-1"></i>
                        ${pedido.direccionEntrega || 'Sin dirección'}
                    </small>
                    <br>
                    <small class="text-muted">
                        <i class="fas fa-phone me-1"></i>
                        ${pedido.telefonoContacto || 'Sin teléfono'}
                    </small>
                </div>
            `;
        } else if (pedido.tipoServicio === 'RECOGER_PEDIDO') {
            return `
                <div class="info-recoger">
                    <small class="text-muted">
                        <i class="fas fa-clock me-1"></i>
                        Hora de recogida: ${pedido.horaRecogida ? this.pedidosService.formatearFecha(pedido.horaRecogida) : 'No especificada'}
                    </small>
                    <br>
                    <small class="text-muted">
                        <i class="fas fa-phone me-1"></i>
                        ${pedido.telefonoContacto || 'Sin teléfono'}
                    </small>
                </div>
            `;
        }
        return '';
    }

    generarListaProductos(detalles) {
        if (!detalles || !Array.isArray(detalles)) {
            return '<div class="text-muted">No hay productos</div>';
        }

        return detalles.map(detalle => `
            <div class="d-flex justify-content-between align-items-center py-1 border-bottom">
                <div>
                    <span class="fw-medium">${detalle.cantidad || 0}x ${detalle.platoNombre || 'Producto'}</span>
                    ${detalle.notas ? `<br><small class="text-muted">${detalle.notas}</small>` : ''}
                </div>
                <span class="text-end">
                    <div class="fw-medium">${this.pedidosService.formatearMoneda(detalle.subtotal || 0)}</div>
                    <small class="text-muted">${this.pedidosService.formatearMoneda(detalle.precioUnitario || 0)} c/u</small>
                </span>
            </div>
        `).join('');
    }

    generarNotasSection(notas) {
        if (!notas) return '';
        return `
            <div class="alert alert-light border mb-3">
                <small class="fw-semibold">Notas especiales:</small>
                <p class="mb-0 small">${notas}</p>
            </div>
        `;
    }

    setupEventListeners() {
        // Filtros
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.aplicarFiltro(e.target.dataset.filter);
            });
        });
    }

    aplicarFiltro(filtro) {
        // Actualizar botones activos
        document.querySelectorAll('[data-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filtro);
        });

        this.filtroActual = filtro;
        this.renderizarPedidos();
    }

    actualizarContadores() {
        if (!this.pedidos || !Array.isArray(this.pedidos)) {
            console.warn('⚠️ No hay pedidos para contar');
            return;
        }

        const counts = {
            'all': this.pedidos.length,
            'BORRADOR': this.pedidos.filter(p => p.estadoPedidoEnum === 'BORRADOR').length,
            'PENDIENTE': this.pedidos.filter(p => p.estadoPedidoEnum === 'PENDIENTE').length,
            'COMPLETADO': this.pedidos.filter(p => p.estadoPedidoEnum === 'COMPLETADO').length
        };

        Object.keys(counts).forEach(key => {
            const element = document.getElementById(`count-${key.toLowerCase()}`);
            if (element) {
                element.textContent = counts[key];
            }
        });
    }

    mostrarLoading(mostrar) {
        const spinner = document.getElementById('loading-spinner');
        if (spinner) {
            spinner.style.display = mostrar ? 'block' : 'none';
        }
    }

    mostrarSinPedidos() {
        const sinPedidos = document.getElementById('sin-pedidos');
        const container = document.getElementById('lista-pedidos-container');
        
        if (sinPedidos) sinPedidos.classList.remove('d-none');
        if (container) container.innerHTML = '';
    }

    mostrarSinPedidosFiltro() {
        const container = document.getElementById('lista-pedidos-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-info text-center">
                    <i class="fas fa-info-circle me-2"></i>
                    No hay pedidos con el filtro aplicado.
                </div>
            `;
        }
    }

    ocultarSinPedidos() {
        const sinPedidos = document.getElementById('sin-pedidos');
        if (sinPedidos) sinPedidos.classList.add('d-none');
    }

    limpiarContainer() {
        const container = document.getElementById('lista-pedidos-container');
        if (container) container.innerHTML = '';
    }

    mostrarError(mensaje) {
        const container = document.getElementById('lista-pedidos-container');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${mensaje}
                </div>
            `;
        }
    }
}

// Funciones globales para los botones
function pagarPedido(pedidoId) {
    console.log('Iniciando pago del pedido:', pedidoId);
    alert(`Redirigiendo al pago del pedido #${pedidoId} (Próximo sprint)`);
}

function verDetallePedido(pedidoId) {
    console.log('Viendo detalle del pedido:', pedidoId);
    alert(`Mostrando detalle del pedido #${pedidoId}`);
}

// ✅ Inicialización segura
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Inicializando Historial de Pedidos...');
    new HistorialPedidos();
});