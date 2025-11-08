  // src/modules/carrito/components/CarritoOffcanvas.js
  // Componente deslizante del carrito de compras
  
  import {
    obtenerCarrito,
    calcularTotal,
    calcularSubtotal,
    incrementarCantidad,
    decrementarCantidad,
    eliminarDelCarrito,
    vaciarCarrito,
    carritoEstaVacio
  } from '../carritoService.js';

 

  const contenedor = document.getElementById('app');

  // Mostrar carrito por defecto
  contenedor.innerHTML = CarritoOffcanvas();
  
  export function CarritoOffcanvas() {
    const offcanvas = document.createElement('div');

    offcanvas.innerHTML = `
      <!-- Offcanvas del Carrito -->
      <div class="offcanvas offcanvas-end" tabindex="-1" id="carritoOffcanvas" aria-labelledby="carritoOffcanvasLabel">
        <!-- Header -->
        <div class="offcanvas-header bg-primary text-white">
          <h5 class="offcanvas-title" id="carritoOffcanvasLabel">
            <i class="bi bi-cart3 me-2"></i>
            Mi Carrito
          </h5>
          <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>

        <!-- Body -->
        <div class="offcanvas-body p-0 d-flex flex-column">
          <!-- Estado vacío -->
          <div id="carritoVacio" class="flex-grow-1 flex-column align-items-center justify-content-center p-4" style="display: none !important;">
            <i class="bi bi-cart-x display-1 text-muted mb-3"></i>
            <h5 class="text-muted">Tu carrito está vacío</h5>
            <p class="text-center text-muted">Agrega algunos platos deliciosos para comenzar</p>
            
            <button class="btn btn-primary mt-3" data-bs-dismiss="offcanvas">
              <i class="bi bi-arrow-left me-2"></i>
              Volver al Menú
            </button>
          </div>

          <!-- Lista de items -->
          <div id="carritoItems" class="flex-grow-1 overflow-auto p-3" style="display: none !important;">
            <!-- Los items se renderizan aquí dinámicamente -->
          </div>

        

          <!-- Footer con total y acciones -->
          <div id="carritoFooter" class="border-top p-3 bg-light" style="display: none !important;">
            <!-- Subtotales -->
            <div class="mb-3">
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">Subtotal:</span>
                <span class="fw-bold" id="carritoSubtotal">$0</span>
              </div>
              
              <div class="d-flex justify-content-between mb-2">
                <span class="text-muted">IVA (19%):</span>
                <span id="carritoIVA">$0</span>
              </div>
              <hr>
              <div class="d-flex justify-content-between">
                <span class="h5 mb-0">Total:</span>
                <span class="h5 mb-0 text-primary" id="carritoTotal">$0</span>
              </div>
              
            </div>
             <!-- Boton para que el usuario escoja el tipo de servicio -->
            <div class="mb-1 text-left">
                <a href="src/modules/tipo servicio/tipo.html" class="btn btn-primary" type="button">
                  <i class="bi bi-gear me-2"></i>
                   Elegir tipo de servicio
                </a>
            </div>

            <!-- Botones de acción -->
            <div class="d-grid gap-2">
              <button class="btn btn-success btn-lg" id="btnProcederPago">
                <i class="bi bi-credit-card me-2"></i>
                Proceder al Pago
              </button>
              <button class="btn btn-outline-danger btn-sm" id="btnVaciarCarrito">
                <i class="bi bi-trash me-2"></i>
                Vaciar Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Esperar a que el offcanvas esté en el DOM antes de renderizar
    setTimeout(() => {
      const offcanvasElement = document.getElementById('carritoOffcanvas');
      if (offcanvasElement) {
        // Renderizar cuando el offcanvas se muestre
        offcanvasElement.addEventListener('shown.bs.offcanvas', () => {
          console.log('🔓 Offcanvas abierto, renderizando...');
          renderizarCarrito();
        });

        // Renderizar inmediatamente si ya está visible
        renderizarCarrito();
        setupEventListeners();
      }
    }, 100);

    // Escuchar cambios en el carrito
    window.addEventListener('carritoActualizado', () => {
      console.log('🔔 Evento carritoActualizado recibido');
      renderizarCarrito();
    });

    // ✅ HOTFIX: Escuchar evento de apertura forzada
    window.addEventListener('abrirCarrito', () => {
      console.log('🔓 Evento abrirCarrito recibido, forzando renderizado...');
      setTimeout(renderizarCarrito, 200);
    });

    return offcanvas;
  }

  // ========================================
  // 🎨 RENDERIZADO
  // ========================================

  function renderizarCarrito() {
    const carrito = obtenerCarrito();
    const carritoVacio = document.getElementById('carritoVacio');
    const carritoItems = document.getElementById('carritoItems');
    const carritoFooter = document.getElementById('carritoFooter');

    // Verificar que los elementos existen
    if (!carritoItems || !carritoVacio || !carritoFooter) {
      console.warn('⚠️ Elementos del carrito no encontrados en el DOM, reintentando...');
      // Reintentar después de un breve delay
      setTimeout(renderizarCarrito, 200);
      return;
    }

    console.log('🛒 Renderizando carrito:', carrito.length, 'items');

    if (carritoEstaVacio()) {
      // Mostrar estado vacío
      carritoVacio.style.display = 'flex';
      carritoItems.style.display = 'none';
      carritoFooter.style.display = 'none';
      console.log('📭 Carrito vacío');
    } else {
      // Mostrar items
      carritoVacio.style.display = 'none';
      carritoItems.style.display = 'block';
      carritoFooter.style.display = 'block';

      console.log('📦 Renderizando', carrito.length, 'items');

      // Renderizar items
      carritoItems.innerHTML = carrito.map(item => crearItemHTML(item)).join('');

      // Actualizar totales
      actualizarTotales();

      // Agregar event listeners a los botones de cada item
      agregarEventListenersItems();
    }
  }

  function crearItemHTML(item) {
    const subtotal = calcularSubtotal(item);

    return `
      <div class="card mb-3 shadow-sm item-carrito" data-id="${item.id}">
        <div class="card-body p-2">
          <div class="row align-items-center">
            <!-- Imagen -->
            <div class="col-3">
              <img 
                src="http://localhost:8080${item.imagenUrl}" 
                class="img-fluid rounded"
                alt="${item.nombre}"
                style="height: 60px; width: 60px; object-fit: cover;"
                onerror="this.src='https://via.placeholder.com/60?text=?'"
              >
            </div>
            
            <!-- Info del plato -->
            <div class="col-9">
              <div class="d-flex justify-content-between align-items-start mb-1">
                <h6 class="mb-0 fw-bold" style="font-size: 0.9rem;">${item.nombre}</h6>
                <button class="btn btn-sm btn-link text-danger p-0 ms-2 btn-eliminar" data-id="${item.id}">
                  <i class="bi bi-x-lg"></i>
                </button>
              </div>
              
              <p class="text-muted small mb-2" style="font-size: 0.75rem;">
                $${item.precio.toLocaleString()} c/u
              </p>
              
              <!-- Controles de cantidad -->
              <div class="d-flex justify-content-between align-items-center">
                <div class="btn-group btn-group-sm" role="group">
                  <button class="btn btn-outline-secondary btn-decrementar" data-id="${item.id}">
                    <i class="bi bi-dash"></i>
                  </button>
                  <button class="btn btn-outline-secondary" disabled style="min-width: 40px;">
                    ${item.cantidad}
                  </button>
                  <button class="btn btn-outline-secondary btn-incrementar" data-id="${item.id}">
                    <i class="bi bi-plus"></i>
                  </button>
                </div>
                
                <span class="fw-bold text-primary">
                  $${subtotal.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function actualizarTotales() {
    const carrito = obtenerCarrito();
    const subtotal = calcularTotal(carrito);
    const iva = subtotal * 0.19; // 19% IVA
    const total = subtotal + iva;

    const subtotalEl = document.getElementById('carritoSubtotal');
    const ivaEl = document.getElementById('carritoIVA');
    const totalEl = document.getElementById('carritoTotal');

    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    if (ivaEl) ivaEl.textContent = `$${iva.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `$${total.toLocaleString()}`;
  }

  // ========================================
  // 🎯 EVENT LISTENERS
  // ========================================

  function setupEventListeners() {
    // Botón de vaciar carrito
    const btnVaciar = document.getElementById('btnVaciarCarrito');
    if (btnVaciar) {
      btnVaciar.addEventListener('click', handleVaciarCarrito);
    }

    // Botón de proceder al pago
    const btnPago = document.getElementById('btnProcederPago');
    if (btnPago) {
      btnPago.addEventListener('click', handleProcederPago);
    }
  }

  function agregarEventListenersItems() {
    // Botones de incrementar
    document.querySelectorAll('.btn-incrementar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platoId = parseInt(e.currentTarget.dataset.id);
        incrementarCantidad(platoId);
      });
    });

    // Botones de decrementar
    document.querySelectorAll('.btn-decrementar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platoId = parseInt(e.currentTarget.dataset.id);
        decrementarCantidad(platoId);
      });
    });

    // Botones de eliminar
    document.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const platoId = parseInt(e.currentTarget.dataset.id);
        const item = obtenerCarrito().find(i => i.id === platoId);

        if (confirm(`¿Eliminar "${item?.nombre}" del carrito?`)) {
          eliminarDelCarrito(platoId);
        }
      });
    });
  }

  // ========================================
  // 🔧 HANDLERS
  // ========================================

  function handleVaciarCarrito() {
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      vaciarCarrito();
      mostrarToast('Carrito vaciado', 'info');
    }
  }

  function handleProcederPago() {
    const carrito = obtenerCarrito();

    if (carritoEstaVacio()) {
      mostrarToast('Tu carrito está vacío', 'warning');
      return;
    }

    console.log('🛒 Procediendo al pago con:', carrito);

    // Aquí puedes redirigir a la página de pago
    // Por ejemplo: router.navigate('/checkout');

    mostrarToast('Funcionalidad de pago - Próximamente', 'info');

    // Cerrar el offcanvas
    const offcanvasElement = document.getElementById('carritoOffcanvas');
    const offcanvas = bootstrap.Offcanvas.getInstance(offcanvasElement);
    if (offcanvas) offcanvas.hide();
  }

  function mostrarToast(mensaje, tipo = 'success') {
    const iconos = {
      success: 'check-circle-fill',
      warning: 'exclamation-triangle-fill',
      info: 'info-circle-fill',
      danger: 'x-circle-fill'
    };

    const toast = document.createElement('div');
    toast.className = `alert alert-${tipo} alert-dismissible fade show position-fixed`;
    toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    toast.innerHTML = `
      <i class="bi bi-${iconos[tipo]} me-2"></i>
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 3000);
  }