// src/modules/pedidos/components/TipoServicioPage.js
import { CarritoOffcanvas } from '../carrito/components/CarritoOffcanvas.js';
import { getToken, isAuthenticated } from '../auth/userService.js';

const API_BASE_URL = 'https://gestion-restaurante-api.onrender.com';

export function TipoServicioPage() {
  const page = document.createElement('div');
  page.setAttribute('role', 'main');
  page.setAttribute('aria-label', 'Selección de tipo de servicio');

  page.innerHTML = `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h2 class="h4 mb-0">
                <i class="bi bi-truck me-2"></i>
                Tipo de Servicio
              </h2>
            </div>
            
            <div class="card-body">
              <form id="form-tipo-servicio">
                <!-- Tipo de servicio -->
                <div class="mb-4">
                  <legend class="form-label fw-bold mb-3">Tipo de Servicio:</legend>
                  
                  <div class="form-check mb-2">
                    <input class="form-check-input" type="radio" name="tipoServicio" 
                           id="recoger-restaurante" value="RECOGER_PEDIDO">
                    <label class="form-check-label d-flex align-items-center" for="recoger-restaurante">
                      <i class="bi bi-shop me-2 fs-5 text-primary"></i>
                      Recoger en el Restaurante
                    </label>
                    <div class="form-text ms-4">
                      Retire su pedido directamente en nuestro local
                    </div>
                  </div>
                  
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" name="tipoServicio" 
                           id="entrega-domicilio" value="DOMICILIO">
                    <label class="form-check-label d-flex align-items-center" for="entrega-domicilio">
                      <i class="bi bi-truck me-2 fs-5 text-primary"></i>
                      Entrega a Domicilio
                    </label>
                    <div class="form-text ms-4">
                      Envío directo a la dirección que nos indique
                    </div>
                  </div>
                </div>

                <!-- Datos de contacto (solo para domicilio) -->
                <div id="datos-domicilio" style="display: none;">
                  <div class="mb-3">
                    <label for="direccion" class="form-label fw-bold">
                      Dirección de Entrega <span class="text-danger">*</span>
                    </label>
                    <input type="text" class="form-control" id="direccion" 
                           placeholder="Ingrese la dirección de entrega" required>
                    <div class="form-text">
                      Calle, número, barrio, ciudad
                    </div>
                  </div>
                  
                  <div class="mb-4">
                    <label for="telefono" class="form-label fw-bold">
                      Número de Teléfono <span class="text-danger">*</span>
                    </label>
                    <input type="tel" class="form-control" id="telefono" 
                           placeholder="Ingrese su número de contacto" required>
                    <div class="form-text">
                      Para coordinar la entrega
                    </div>
                  </div>
                </div>
                
                <!-- Botones -->
                <div class="d-flex justify-content-between">
                  <button type="button" class="btn btn-outline-secondary" id="btn-volver">
                    <i class="bi bi-arrow-left me-1"></i>
                    Volver
                  </button>
                  <button type="submit" class="btn btn-primary" id="btn-confirmar">
                    <i class="bi bi-check-circle me-1"></i>
                    Confirmar y Ver Carrito
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Mensajes de error/éxito -->
    <div id="mensaje-container" class="toast-container position-fixed top-0 end-0 p-3"></div>
  `;

  // Inicializar eventos
  setTimeout(() => {
    setupEventListeners();
  }, 100);

  function setupEventListeners() {
    // Radio buttons para mostrar/ocultar campos
    const recogerRadio = page.querySelector('#recoger-restaurante');
    const domicilioRadio = page.querySelector('#entrega-domicilio');
    const datosDomicilio = page.querySelector('#datos-domicilio');
    
    recogerRadio.addEventListener('change', () => {
      datosDomicilio.style.display = 'none';
      // Deshabilitar campos no requeridos
      page.querySelector('#direccion').required = false;
    });
    
    domicilioRadio.addEventListener('change', () => {
      datosDomicilio.style.display = 'block';
      // Habilitar campos requeridos
      page.querySelector('#direccion').required = true;
    });

    // Botón volver
    const btnVolver = page.querySelector('#btn-volver');
    btnVolver.addEventListener('click', () => {
      window.history.back();
    });

    // Formulario
    const form = page.querySelector('#form-tipo-servicio');
    form.addEventListener('submit', handleSubmit);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Validar autenticación
    if (!isAuthenticated()) {
      mostrarMensaje('Debe iniciar sesión para realizar un pedido', 'error');
      return;
    }

    // Validar campos
    const validacion = verificarcampos();
    if (!validacion.valido) {
      mostrarMensaje(validacion.mensaje || 'Por favor complete todos los campos', 'error');
      return;
    }

    try {
      console.log("✅ Validación correcta, preparando datos del pedido");

      // Obtener datos del carrito
      const datosCarrito = await obtenerDatosCarrito();
      if (!datosCarrito) {
        mostrarMensaje('Error al obtener datos del carrito', 'error');
        return;
      }

      console.log("✅ Datos del carrito obtenidos correctamente");

      // Combinar datos del servicio con datos del carrito
      const pedidoData = {
        ...validacion.datos,
        ...datosCarrito,
        fechaPedido: new Date().toISOString(),
        estadoPedidoEnum: "BORRADOR",
        // Si es recoger en restaurante, limpiar dirección
        ...(validacion.datos.tipoServicio === 'RECOGER_PEDIDO' && { direccionEntrega: null })
      };

      // Verificar estructura
      verificarEstructuraPedido(pedidoData);

      console.log("📄 Datos completos del pedido:", pedidoData);

      // Guardar en localStorage
      localStorage.setItem('pedidoPendiente', JSON.stringify(pedidoData));
      console.log("💾 Pedido guardado en localStorage");

      // Abrir el carrito con botón de confirmar
      abrirCarritoConConfirmar(pedidoData);
      
      mostrarMensaje('Datos guardados. Revise su carrito para confirmar el pedido', 'success');
      
    } catch (error) {
      console.error('Error:', error);
      mostrarMensaje('Error al procesar la solicitud', 'error');
    }
  }

  function verificarcampos() {
    const tipoServicio = page.querySelector('input[name="tipoServicio"]:checked');
    
    if (!tipoServicio) {
      return { valido: false, mensaje: 'Por favor seleccione un tipo de servicio' };
    }

    const datos = {
      tipoServicio: tipoServicio.value
    };

    // Si es domicilio, validar campos adicionales
    if (tipoServicio.value === 'DOMICILIO') {
      const direccion = page.querySelector('#direccion').value.trim();
      const telefono = page.querySelector('#telefono').value.trim();
      
      if (!direccion || !telefono) {
        return { valido: false, mensaje: 'Por favor complete todos los campos para entrega a domicilio' };
      }
      
      datos.direccionEntrega = direccion;
      datos.telefonoContacto = telefono;
    }

    return { valido: true, datos };
  }

  async function obtenerDatosCarrito() {
    try {
      // Importar funciones del carrito dinámicamente
      const carritoModule = await import('../carrito/carritoService.js');
      
      const carrito = carritoModule.obtenerCarrito();
      
      if (!carrito || carrito.length === 0) {
        mostrarMensaje('El carrito está vacío', 'error');
        return null;
      }

      // Calcular subtotales y totales
      const detallePedidoRequestList = carrito.map(item => ({
        platoId: item.id,
        platoNombre: item.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.precio,
        subtotal: item.precio * item.cantidad,
        notas: item.notas || ""
      }));

      const subtotal = detallePedidoRequestList.reduce((sum, item) => sum + item.subtotal, 0);
      const iva = subtotal * 0.19;
      const total = subtotal + iva;

      return {
        detallePedidoRequestList: detallePedidoRequestList,
        subtotal: parseFloat(subtotal.toFixed(2)),
        iva: parseFloat(iva.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        notas: ""
      };

    } catch (error) {
      console.error('❌ Error al obtener datos del carrito:', error);
      return null;
    }
  }

  function verificarEstructuraPedido(pedidoData) {
    console.log("🔍 VERIFICANDO ESTRUCTURA DEL PEDIDO:");
    console.log("   tipoServicio:", pedidoData.tipoServicio);
    console.log("   fechaPedido:", pedidoData.fechaPedido);
    console.log("   estadoPedidoEnum:", pedidoData.estadoPedidoEnum);
    console.log("   subtotal:", pedidoData.subtotal);
    console.log("   iva:", pedidoData.iva);
    console.log("   total:", pedidoData.total);
    console.log("   direccionEntrega:", pedidoData.direccionEntrega);
    console.log("   telefonoContacto:", pedidoData.telefonoContacto);
    
    if (pedidoData.detallePedidoRequestList) {
      console.log("   detallePedidoRequestList - Número de items:", pedidoData.detallePedidoRequestList.length);
    }
  }

  function abrirCarritoConConfirmar(pedidoData) {
    // Crear o mostrar carrito offcanvas
    let offcanvas = document.getElementById('carritoOffcanvas');
    
    if (!offcanvas) {
      const carrito = CarritoOffcanvas();
      document.body.appendChild(carrito);
      offcanvas = document.getElementById('carritoOffcanvas');
    }
    
    // Agregar botón de confirmar pedido al carrito
    setTimeout(() => {
      const carritoBody = document.querySelector('.offcanvas-body');
      if (carritoBody && !document.getElementById('btn-confirmar-pedido')) {
        const botonConfirmar = crearBotonConfirmarPedido(pedidoData);
        carritoBody.appendChild(botonConfirmar);
      }
    }, 300);
    
    // Mostrar el offcanvas
    const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
    bsOffcanvas.show();
  }

  function crearBotonConfirmarPedido(pedidoData) {
  const container = document.createElement('div');
  container.id = 'confirmarPedidoContainer';
  container.className = 'border-top p-3 bg-white';
  
  container.innerHTML = `
    <div class="d-grid gap-2">
      <button class="btn btn-success btn-lg" id="btnConfirmarPedidoFinal">
        <i class="bi bi-check-circle me-2"></i>
        Confirmar Pedido
      </button>
      <div class="d-flex justify-content-between align-items-center mt-2">
        <small class="text-muted">
          <i class="bi bi-${pedidoData.tipoServicio === 'DOMICILIO' ? 'truck' : 'shop'} me-1"></i>
          ${pedidoData.tipoServicio === 'DOMICILIO' ? 'Entrega a domicilio' : 'Recoger en restaurante'}
        </small>
        <span class="fw-bold text-success">$${pedidoData.total?.toLocaleString() || '0'}</span>
      </div>
    </div>
  `;
  
  // Agregar event listener
  setTimeout(() => {
    const btnConfirmar = document.getElementById('btnConfirmarPedidoFinal');
    if (btnConfirmar) {
      btnConfirmar.addEventListener('click', async () => {
        await confirmarPedido(pedidoData);
      });
    }
  }, 100);
  
  return container;
}

// Y en abrirCarritoConConfirmar:
function abrirCarritoConConfirmar(pedidoData) {
  let offcanvas = document.getElementById('carritoOffcanvas');
  
  if (!offcanvas) {
    const carrito = CarritoOffcanvas();
    document.body.appendChild(carrito);
    offcanvas = document.getElementById('carritoOffcanvas');
  }
  
  // Agregar botón de confirmar pedido al carrito
  setTimeout(() => {
    const carritoBody = document.querySelector('.offcanvas-body');
    if (carritoBody) {
      // Remover botón existente
      const existente = document.getElementById('confirmarPedidoContainer');
      if (existente) existente.remove();
      
      // Agregar nuevo botón
      const botonConfirmar = crearBotonConfirmarPedido(pedidoData);
      const footer = document.getElementById('carritoFooter');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(botonConfirmar, footer);
      }
    }
  }, 300);
  
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
  bsOffcanvas.show();
}

  async function confirmarPedido(pedidoData) {
    try {
      console.log('🚀 Confirmando pedido...');
      
      const token = getToken();
      if (!token) {
        mostrarMensaje('Sesión expirada. Por favor, inicie sesión nuevamente.', 'error');
        return;
      }

      // Asegurar que el tipo de servicio sea correcto
      if (pedidoData.tipoServicio === 'RECOGER') {
        pedidoData.tipoServicio = 'RECOGER_PEDIDO';
      }

      // Validar platos antes de enviar
      if (pedidoData.detallePedidoRequestList && pedidoData.detallePedidoRequestList.length > 0) {
        await validarPlatosCarrito(pedidoData.detallePedidoRequestList);
      } else {
        throw new Error('El carrito está vacío');
      }

      console.log('📦 Enviando pedido:', pedidoData);

      const response = await fetch(`${API_BASE_URL}/api/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(pedidoData)
      });

      if (!response.ok) {
        let errorMessage;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || `Error ${response.status}`;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const pedidoCreado = await response.json();
      console.log('✅ Pedido creado exitosamente:', pedidoCreado);
      
      // Limpiar almacenamiento
      limpiarAlmacenamiento();
      
      // Cerrar carrito
      const offcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('carritoOffcanvas'));
      if (offcanvas) offcanvas.hide();
      
      mostrarMensaje('✅ Pedido confirmado exitosamente', 'success');
      
      // Redirigir a historial de pedidos después de 2 segundos
      setTimeout(() => {
        window.location.hash = '/historial-pedidos';
      }, 2000);

    } catch (error) {
      console.error('❌ Error al confirmar pedido:', error);
      mostrarMensaje(`Error: ${error.message}`, 'error');
    }
  }

  async function validarPlatosCarrito(detallePedidoRequestList) {
    try {
      console.log('🔍 Validando platos del carrito...');
      
      const token = getToken();
      if (!token) {
        throw new Error('No hay token disponible para validación');
      }

      for (const detalle of detallePedidoRequestList) {
        const response = await fetch(`${API_BASE_URL}/api/platos/${detalle.platoId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(`Plato no encontrado con id: ${detalle.platoId}`);
          } else {
            throw new Error(`Error al validar plato ${detalle.platoId}: ${response.status}`);
          }
        }
      }
      
      console.log('✅ Todos los platos son válidos');
      return true;
      
    } catch (error) {
      console.error('❌ Error en validación de platos:', error);
      throw error;
    }
  }

  function limpiarAlmacenamiento() {
    // Limpiar carrito
    const carritoModule = window.carritoService;
    if (carritoModule && carritoModule.vaciarCarrito) {
      carritoModule.vaciarCarrito();
    }
    
    // Limpiar localStorage
    localStorage.removeItem('pedidoPendiente');
    
    // Disparar evento de actualización
    window.dispatchEvent(new CustomEvent('carritoActualizado'));
    
    console.log('🧹 Almacenamiento limpiado');
  }

  function mostrarMensaje(texto, tipo) {
    const container = page.querySelector('#mensaje-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${tipo === 'error' ? 'danger' : 'success'} border-0`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'assertive');
    toast.setAttribute('aria-atomic', 'true');
    
    toast.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          ${texto}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    container.appendChild(toast);
    
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 5000);
  }

  return page;
}