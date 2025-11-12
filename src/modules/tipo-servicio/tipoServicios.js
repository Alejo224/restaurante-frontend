import { CarritoOffcanvas } from '../carrito/components/CarritoOffcanvas.js';
import { getToken, isAuthenticated } from '../auth/userService.js';

// Configuración del API
const API_BASE_URL = 'http://localhost:8080';

function getApiUrl(endpoint, id = null) {
    let url = `${API_BASE_URL}${endpoint}`;
    if (id !== null) {
        url += `/${id}`;
    }
    return url;
}

const recogerRestaurante = document.getElementById('recoger-restaurante');
const entregaDomicilio = document.getElementById('entrega-domicilio');
const direccionEntrega = document.getElementById('direccion');
const telefonoContacto = document.getElementById('telefono');
const btnIconoSalir = document.getElementById("icono-salir");
const btnConfirmar = document.getElementById('confirmar-btn');

// Inicialización de eventos
btnIconoSalir.addEventListener('click', () => {
    window.history.back();
});

btnConfirmar.addEventListener('click', async () => {
    console.log("🎯 Botón confirmar presionado");

    // Validar autenticación primero
    if (!isAuthenticated()) {
        mostrarError("Debe iniciar sesión para realizar un pedido.");
        return;
    }

    // Validar campos y obtener datos
    const validacion = verificarcampos();
    
    if (!validacion.valido) {
        console.log("❌ Validación fallida, no se abre el carrito");
        return;
    }

    console.log("✅ Validación correcta, preparando datos del pedido");

    // Obtener datos del carrito con la clave correcta
    const datosCarrito = await obtenerDatosCarrito();
    if (!datosCarrito) {
        console.error("❌ No se pudieron obtener datos del carrito");
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

    // Verificar estructura antes de continuar
    verificarEstructuraPedido(pedidoData);

    console.log("📄 Datos completos del pedido:", pedidoData);

    // Guardar en localStorage para usar en el carrito
    localStorage.setItem('pedidoPendiente', JSON.stringify(pedidoData));
    console.log("💾 Pedido guardado en localStorage");

    // Abrir el carrito
    let offcanvas = document.getElementById("carritoOffcanvas");
    if (!offcanvas) {
        console.log("🆕 Creando nuevo carrito offcanvas...");
        const generado = CarritoOffcanvas();
        // Agregar botón de confirmar al carrito
        const carritoContent = generado.querySelector('.offcanvas-body');
        const botonConfirmar = crearBotonConfirmarPedido();
        carritoContent.appendChild(botonConfirmar);
        
        document.body.appendChild(generado);
        console.log("✅ Carrito creado en el DOM");
    }
    
    const carrito = new bootstrap.Offcanvas("#carritoOffcanvas");
    carrito.show();
    console.log("🎪 Carrito offcanvas abierto");
});
// Event listeners para los radios
recogerRestaurante.addEventListener('change', suspenderBotones);
entregaDomicilio.addEventListener('change', suspenderBotones);

// Función para suspender/habilitar botones según selección
function suspenderBotones() {
    const campos = {
        domicilio: {
            radio: entregaDomicilio,
            campos: [direccionEntrega]
        },
        recoger: {
            radio: recogerRestaurante,
            campos: []
        }
    };

    // Función auxiliar para habilitar/deshabilitar campos 
    const toggleCampos = (elementos, deshabilitar) => {
        elementos.forEach(elemento => {
            elemento.disabled = deshabilitar;
            if (deshabilitar) {
                elemento.value = ''; // Limpiar campo cuando se deshabilita
            }
        });
    };

    // Resetear todo a habilitado primero
    Object.values(campos).forEach(tipo => {
        tipo.radio.disabled = false;
        toggleCampos(tipo.campos, false);
    });

    // Aplicar lógica según selección
    if (campos.recoger.radio.checked) {
        campos.domicilio.radio.disabled = true;
        toggleCampos(campos.domicilio.campos, true);
    } else if (campos.domicilio.radio.checked) {
        campos.recoger.radio.disabled = true;
    }
    console.log("Campos actualizados según selección");
}

// Función para verificar la estructura del pedido antes de enviar
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
    
    // Validar valores permitidos para tipoServicio
    const tiposPermitidos = ['DOMICILIO', 'RECOGER_PEDIDO'];
    if (!tiposPermitidos.includes(pedidoData.tipoServicio)) {
        console.log(`   🚨 TIPO DE SERVICIO INVÁLIDO: "${pedidoData.tipoServicio}"`);
        console.log(`   ✅ Valores permitidos: ${tiposPermitidos.join(', ')}`);
    } else {
        console.log(`   ✅ Tipo de servicio válido: "${pedidoData.tipoServicio}"`);
    }
}

// Llamar esta función antes de enviar el pedido
window.verificarEstructuraPedido = verificarEstructuraPedido;

// Función para validar campos y capturar datos
function verificarcampos() {
    const opcionesEntrega = {
        domicilio: {
            radio: entregaDomicilio,
            campos: [direccionEntrega, telefonoContacto],
            tipoServicio: 'DOMICILIO' // Correcto
        },
        recoger: {
            radio: recogerRestaurante,
            campos: [telefonoContacto],
            tipoServicio: 'RECOGER_PEDIDO' // Cambiar a RECOGER_PEDIDO
        }
    };

    let mensajeDeError = "";
    let opcionSeleccionada = false;
    let datosServicio = {};

    for (let opcion in opcionesEntrega) {
        let opcionActual = opcionesEntrega[opcion];

        if (opcionActual.radio.checked) {
            opcionSeleccionada = true;
            datosServicio.tipoServicio = opcionActual.tipoServicio; // Usar el valor corregido

            // Validar y capturar datos
            for (let campo of opcionActual.campos) {
                console.log(`Validando campo: ${campo.id}, valor: "${campo.value}"`);

                if (!campo.value.trim()) {
                    mensajeDeError = "Por favor complete todos los campos obligatorios";
                    break;
                }

                // Capturar datos según el campo
                if (campo.id === 'direccion') {
                    datosServicio.direccionEntrega = campo.value.trim();
                } else if (campo.id === 'telefono') {
                    datosServicio.telefonoContacto = campo.value.trim();
                }
            }
        }
        if (mensajeDeError) break;
    }

    if (!opcionSeleccionada) {
        mostrarError("Por favor seleccione una opción de entrega");
        return { valido: false };
    }

    if (mensajeDeError) {
        console.log("Error de validación:", mensajeDeError);
        mostrarError(mensajeDeError);
        return { valido: false };
    }

    console.log("✅ Datos capturados:", datosServicio);
    return { 
        valido: true, 
        datos: datosServicio 
    };
}
// Función para limpiar productos que no existen en la BD
async function limpiarCarritoDeProductosInvalidos() {
    try {
        console.log("🧹 LIMPIANDO CARRITO DE PRODUCTOS INVALIDOS...");
        
        const carrito = obtenerCarritoReal();
        const token = getToken();
        
        if (!token) {
            console.log("❌ No hay token para limpiar carrito");
            return;
        }

        const url = getApiUrl('/api/platos');
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log("❌ No se pudieron obtener platos del backend");
            return;
        }

        const platosBD = await response.json();
        const idsBD = platosBD.map(plato => plato.id);

        // Filtrar solo los productos que existen en la BD
        const carritoLimpio = carrito.filter(item => {
            const existeEnBD = idsBD.includes(item.id);
            if (!existeEnBD) {
                console.log(`🗑️ Eliminando producto inválido: ID ${item.id} - "${item.nombre}"`);
            }
            return existeEnBD;
        });

        // Guardar carrito limpio
        const clave = obtenerClaveCarrito();
        localStorage.setItem(clave, JSON.stringify(carritoLimpio));
        
        console.log(`✅ Carrito limpiado: ${carrito.length} → ${carritoLimpio.length} productos`);
        console.log("🛒 Carrito actual:", carritoLimpio);

        return carritoLimpio;

    } catch (error) {
        console.error("❌ Error limpiando carrito:", error);
        return obtenerCarritoReal(); // Devolver carrito original en caso de error
    }
}

// Hacer disponible en consola
window.limpiarCarritoDeProductosInvalidos = limpiarCarritoDeProductosInvalidos;
// Función para obtener la clave real del carrito
function obtenerClaveCarrito() {
    // Buscar todas las claves en localStorage que empiecen con 'carrito_'
    const claves = Object.keys(localStorage).filter(key => key.startsWith('carrito_'));
    console.log("🔑 Claves de carrito encontradas:", claves);
    
    if (claves.length > 0) {
        // Usar la primera clave encontrada (o la más reciente)
        return claves[0];
    }
    
    // Si no encuentra, usar la clave por defecto
    return 'carrito';
}

// Función para obtener el carrito con la clave correcta
function obtenerCarritoReal() {
    const clave = obtenerClaveCarrito();
    console.log("🗝️ Usando clave del carrito:", clave);
    
    const carrito = JSON.parse(localStorage.getItem(clave)) || [];
    console.log("🛒 Carrito obtenido:", carrito);
    
    return carrito;
}

// Función para ver el estado actual del carrito
function verEstadoCarrito() {
    const carrito = obtenerCarritoReal();
    console.log("📊 ESTADO ACTUAL DEL CARRITO:");
    console.log("   Total de productos:", carrito.length);
    carrito.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id} | "${item.nombre}" | $${item.precio} | Cantidad: ${item.cantidad}`);
    });
    
    if (carrito.length === 0) {
        console.log("   🛒 El carrito está vacío");
    }
}

window.verEstadoCarrito = verEstadoCarrito;

// Función para obtener datos del carrito
async function obtenerDatosCarrito() {
    try {
        console.log("🔍 Obteniendo datos del carrito...");
        
        // Obtener el carrito con la clave correcta
        let carrito = obtenerCarritoReal();
        
        console.log("🛒 CARRITO COMPLETO:", carrito);
        console.log("📊 Número de items:", carrito.length);
        
        if (carrito.length === 0) {
            console.warn("⚠️ Carrito vacío detectado");
            mostrarError("El carrito está vacío. Agregue productos antes de continuar.");
            return null;
        }

        // Limpiar productos inválidos automáticamente
        carrito = await limpiarCarritoDeProductosInvalidos();
        
        if (carrito.length === 0) {
            console.warn("⚠️ Carrito vacío después de limpiar productos inválidos");
            mostrarError("Todos los productos en el carrito no están disponibles. Por favor, agregue productos válidos.");
            return null;
        }

        // DEBUG: Mostrar información detallada de cada item
        console.log("📋 DETALLE DE ITEMS EN CARRITO (DESPUÉS DE LIMPIEZA):");
        carrito.forEach((item, index) => {
            console.log(`   Item ${index + 1}:`);
            console.log(`     ID: ${item.id}`);
            console.log(`     Nombre: ${item.nombre}`);
            console.log(`     Precio: ${item.precio}`);
            console.log(`     Cantidad: ${item.cantidad}`);
        });

        // Calcular subtotales y totales
        const detallePedidoRequestList = carrito.map(item => {
            const subtotal = item.precio * item.cantidad;
            
            return {
                platoId: item.id,
                platoNombre: item.nombre,
                cantidad: item.cantidad,
                precioUnitario: item.precio,
                subtotal: subtotal,
                notas: item.notas || ""
            };
        });

        const subtotal = detallePedidoRequestList.reduce((sum, item) => sum + item.subtotal, 0);
        const iva = subtotal * 0.12;
        const total = subtotal + iva;

        return {
            detallePedidoRequestList: detallePedidoRequestList,
            subtotal: parseFloat(subtotal.toFixed(2)),
            iva: parseFloat(iva.toFixed(2)),
            total: parseFloat(total.toFixed(2)),
            notas: ""
        };

    } catch (error) {
        console.error("❌ Error al obtener datos del carrito:", error);
        mostrarError("Error técnico al procesar el carrito. Intente nuevamente.");
        return null;
    }
}

// Función para validar los platos antes de enviar
async function validarPlatosCarrito(detallePedidoRequestList) {
    try {
        console.log("🔍 Validando platos del carrito...");
        
        const token = getToken();
        if (!token) {
            throw new Error('No hay token disponible para validación');
        }

        // Verificar cada plato individualmente
        for (const detalle of detallePedidoRequestList) {
            console.log(`   Validando plato ID: ${detalle.platoId}`);
            
            const url = getApiUrl('/api/platos', detalle.platoId);
            console.log(`   🔗 URL: ${url}`);

            const response = await fetch(url, {
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
            
            const plato = await response.json();
            console.log(`   ✅ Plato válido: ${plato.nombre}`);
        }
        
        console.log("✅ Todos los platos son válidos");
        return true;
        
    } catch (error) {
        console.error("❌ Error en validación de platos:", error);
        throw error;
    }
}

// Función para enviar el pedido al backend
async function enviarPedido(pedidoData) {
    try {
        console.log("🚀 Iniciando envío de pedido...");
        
        // Verificar autenticación
        if (!isAuthenticated()) {
            throw new Error('No está autenticado. Por favor, inicie sesión.');
        }

        const token = getToken();
        if (!token) {
            throw new Error('No hay token de autenticación disponible.');
        }

        console.log("🔐 Token obtenido correctamente");

        // Validar y corregir tipo de servicio si es necesario
        if (pedidoData.tipoServicio === 'RECOGER') {
            pedidoData.tipoServicio = 'RECOGER_PEDIDO';
            console.log("🔄 Tipo de servicio corregido de 'RECOGER' a 'RECOGER_PEDIDO'");
        }

        console.log("📋 Tipo de servicio final:", pedidoData.tipoServicio);

        // Validar que los platos existan antes de enviar
        if (pedidoData.detallePedidoRequestList && pedidoData.detallePedidoRequestList.length > 0) {
            await validarPlatosCarrito(pedidoData.detallePedidoRequestList);
        } else {
            throw new Error('El carrito está vacío');
        }

        console.log("📦 Enviando pedido validado:", pedidoData);

        // Usar la URL correcta del endpoint
        const url = getApiUrl('/api/pedidos');
        console.log("🔗 URL del endpoint de pedidos:", url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(pedidoData)
        });

        console.log("📡 Response status:", response.status);
        console.log("📡 Response ok:", response.ok);

        if (!response.ok) {
            let errorData;
            try {
                errorData = await response.json();
                console.log("📄 Error response data:", errorData);
            } catch (parseError) {
                console.log("❌ No se pudo parsear error response");
                errorData = null;
            }
            
            const errorMessage = errorData?.message || 
                               errorData?.error || 
                               errorData?.errors?.message || 
                               `Error ${response.status}: ${response.statusText}`;
            
            throw new Error(`Error ${response.status}: ${errorMessage}`);
        }

        const pedidoCreado = await response.json();
        console.log("✅ Pedido creado exitosamente:", pedidoCreado);
        
        // Limpiar almacenamiento después de éxito
        limpiarAlmacenamiento();
        
        return pedidoCreado;

    } catch (error) {
        console.error("❌ Error al enviar pedido:", error);
        manejarErrorPedido(error);
        throw error;
    }
}
// Función para limpiar almacenamiento
function limpiarAlmacenamiento() {
    localStorage.removeItem('carrito');
    localStorage.removeItem('pedidoPendiente');
    
    const claveCarrito = obtenerClaveCarrito();
    if (claveCarrito) {
        localStorage.removeItem(claveCarrito);
    }
    console.log("🧹 Almacenamiento limpiado");
}

// Función para manejar errores específicos
function manejarErrorPedido(error) {
    let mensajeError = error.message || "Error al crear el pedido. Intente nuevamente.";
    
    if (error.message.includes('autenticación') || error.message.includes('token')) {
        mensajeError = "Error de autenticación. Por favor, inicie sesión nuevamente.";
    } else if (error.message.includes('401')) {
        mensajeError = "Sesión expirada. Por favor, inicie sesión nuevamente.";
    } else if (error.message.includes('403')) {
        mensajeError = "No tiene permisos para realizar pedidos. Contacte al administrador.";
    } else if (error.message.includes('400')) {
        if (error.message.includes('TipoServicio') || error.message.includes('RECOGER')) {
            mensajeError = "Error en el tipo de servicio. Por favor, seleccione nuevamente.";
        } else {
            mensajeError = "Error en los datos enviados. Verifique la información.";
        }
    } else if (error.message.includes('404')) {
        if (error.message.includes('Plato no encontrado')) {
            mensajeError = "Uno o más productos no están disponibles. Por favor, actualice su carrito.";
        } else {
            mensajeError = "Servicio no disponible. Verifique la conexión.";
        }
    } else if (error.message.includes('500')) {
        mensajeError = "Error interno del servidor. Intente más tarde.";
    }
    
    mostrarError(mensajeError);
}
// Función para crear botón de confirmar pedido en el carrito
function crearBotonConfirmarPedido() {
    const botonConfirmar = document.createElement('button');
    botonConfirmar.id = 'confirmar-pedido-btn';
    botonConfirmar.className = 'btn btn-success w-100 mt-3 py-2';
    botonConfirmar.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>
        Confirmar Pedido
    `;
    
    botonConfirmar.addEventListener('click', async () => {
        const pedidoData = JSON.parse(localStorage.getItem('pedidoPendiente'));
        
        if (!pedidoData) {
            mostrarError("No hay datos del pedido. Regrese al formulario de servicio.");
            return;
        }

        // Validar autenticación antes de proceder
        if (!isAuthenticated()) {
            mostrarError("Debe iniciar sesión para confirmar el pedido.");
            return;
        }

        try {
            botonConfirmar.disabled = true;
            botonConfirmar.innerHTML = `
                <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                Procesando...
            `;
            
            const pedidoCreado = await enviarPedido(pedidoData);
            
            mostrarExito("¡Pedido creado exitosamente! Será procesado pronto.");
            
            // Cerrar el offcanvas después de éxito
            const carrito = bootstrap.Offcanvas.getInstance("#carritoOffcanvas");
            if (carrito) {
                carrito.hide();
            }
            
            // Redirigir después de éxito
            setTimeout(() => {
                window.location.href = '/restaurante-frontend/mis-pedidos#/historial-pedidos';
            }, 2000);
            
        } catch (error) {
            botonConfirmar.disabled = false;
            botonConfirmar.innerHTML = `
                <i class="bi bi-check-circle me-2"></i>
                Confirmar Pedido
            `;
        }
    });

    return botonConfirmar;
}

// Función para debuggear la estructura del pedido
function debugEstructuraPedido(pedidoData) {
    console.log("🔍 DEBUG - Estructura del pedido:");
    console.log("   tipoServicio:", pedidoData.tipoServicio);
    console.log("   fechaPedido:", pedidoData.fechaPedido);
    console.log("   estadoPedidoEnum:", pedidoData.estadoPedidoEnum);
    console.log("   subtotal:", pedidoData.subtotal);
    console.log("   iva:", pedidoData.iva);
    console.log("   total:", pedidoData.total);
    console.log("   notas:", pedidoData.notas);
    console.log("   direccionEntrega:", pedidoData.direccionEntrega);
    console.log("   telefonoContacto:", pedidoData.telefonoContacto);
    
    if (pedidoData.detallePedidoRequestList) {
        console.log("   detallePedidoRequestList - Número de items:", pedidoData.detallePedidoRequestList.length);
        pedidoData.detallePedidoRequestList.forEach((item, index) => {
            console.log(`     Item ${index + 1}:`);
            console.log(`       platoId: ${item.platoId}`);
            console.log(`       platoNombre: ${item.platoNombre}`);
            console.log(`       cantidad: ${item.cantidad}`);
            console.log(`       precioUnitario: ${item.precioUnitario}`);
            console.log(`       subtotal: ${item.subtotal}`);
            console.log(`       notas: ${item.notas}`);
        });
    } else {
        console.log("   ❌ detallePedidoRequestList: NULL o undefined");
    }
    
    console.log("📄 JSON completo a enviar:", JSON.stringify(pedidoData, null, 2));
}

// Función para verificar platos disponibles en el backend
async function verificarPlatosDisponibles() {
    try {
        console.log("🍽️ VERIFICANDO PLATOS DISPONIBLES EN BACKEND...");
        
        const token = getToken();
        if (!token) {
            console.log("❌ No hay token para verificar platos");
            return;
        }

        const url = getApiUrl('/api/platos');
        console.log("🔗 URL del endpoint:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const platos = await response.json();
            console.log("📋 PLATOS DISPONIBLES EN BD:");
            platos.forEach(plato => {
                console.log(`   ID: ${plato.id} | Nombre: ${plato.nombre} | Precio: ${plato.precio}`);
            });
            console.log(`   Total de platos: ${platos.length}`);
        } else {
            console.log(`❌ Error al obtener platos: ${response.status}`);
        }
    } catch (error) {
        console.error("❌ Error al verificar platos:", error);
    }
}

// Función para comparar IDs del carrito vs base de datos
async function compararIDsCarritoVsBD() {
    try {
        console.log("🔍 COMPARANDO IDs DEL CARRITO VS BASE DE DATOS...");
        
        const carrito = obtenerCarritoReal();
        const token = getToken();
        
        if (!token) {
            console.log("❌ No hay token para comparación");
            return;
        }

        const url = getApiUrl('/api/platos');
        console.log("🔗 URL:", url);

        // Obtener platos del backend
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.log("❌ No se pudieron obtener platos del backend");
            return;
        }

        const platosBD = await response.json();
        const idsBD = platosBD.map(plato => plato.id);
        const idsCarrito = carrito.map(item => item.id);

        console.log("📊 COMPARACIÓN:");
        console.log("   IDs en Base de Datos:", idsBD);
        console.log("   IDs en Carrito:", idsCarrito);

        // Encontrar IDs en carrito que NO están en BD
        const idsNoEncontrados = idsCarrito.filter(id => !idsBD.includes(id));
        console.log("   ❌ IDs en carrito pero NO en BD:", idsNoEncontrados);

        if (idsNoEncontrados.length > 0) {
            console.log("   🚨 PROBLEMA: Hay IDs en el carrito que no existen en la BD");
            idsNoEncontrados.forEach(id => {
                const item = carrito.find(item => item.id === id);
                console.log(`      ID ${id}: ${item?.nombre || 'Nombre no disponible'}`);
            });
        } else {
            console.log("   ✅ Todos los IDs del carrito existen en la BD");
        }

    } catch (error) {
        console.error("❌ Error en comparación:", error);
    }
}

// Función para mostrar mensajes de error
function mostrarError(mensaje) {
    const contenedor = document.createElement('div');
    contenedor.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    contenedor.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    contenedor.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(contenedor);

    setTimeout(() => {
        if (contenedor.parentNode) contenedor.remove();
    }, 5000);
}

// Función para mostrar mensajes de éxito
function mostrarExito(mensaje) {
    const contenedor = document.createElement('div');
    contenedor.className = 'alert alert-success alert-dismissible fade show position-fixed';
    contenedor.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    contenedor.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(contenedor);

    setTimeout(() => {
        if (contenedor.parentNode) contenedor.remove();
    }, 5000);
}

// Hacer funciones disponibles en consola
window.verificarPlatosDisponibles = verificarPlatosDisponibles;
window.compararIDsCarritoVsBD = compararIDsCarritoVsBD;

// Inicializar estado de los campos al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Página de tipo servicio cargada");
    suspenderBotones();
    
    // Ejecutar verificación después de un delay
    setTimeout(() => {
        verificarPlatosDisponibles();
        compararIDsCarritoVsBD();
    }, 1500);
    
    // Cargar datos guardados si existen
    const pedidoPendiente = localStorage.getItem('pedidoPendiente');
    if (pedidoPendiente) {
        const datos = JSON.parse(pedidoPendiente);
        console.log("📋 Pedido pendiente encontrado:", datos);
        
        // Pre-seleccionar radio button según tipo de servicio
        if (datos.tipoServicio === 'DOMICILIO') {
            entregaDomicilio.checked = true;
            if (datos.direccionEntrega) {
                direccionEntrega.value = datos.direccionEntrega;
            }
        } else if (datos.tipoServicio === 'RECOGER_PEDIDO') {
            recogerRestaurante.checked = true;
        }
        
        if (datos.telefonoContacto) {
            telefonoContacto.value = datos.telefonoContacto;
        }
        
        suspenderBotones();
    }
});

// Exportar funciones si es necesario
export {
    verificarcampos,
    obtenerDatosCarrito,
    enviarPedido,
    mostrarError,
    mostrarExito
};