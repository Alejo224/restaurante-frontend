// src/modules/carrito/carritoService.js
// Servicio para gestionar el carrito de compras

import { getCurrentUser, isAuthenticated } from '../auth/userService.js';

// ========================================
// 🌐 CONFIGURACIÓN DEL API
// ========================================

const API_BASE_URL = 'http://localhost:8080';

function getApiUrl(endpoint, id = null) {
    let url = `${API_BASE_URL}${endpoint}`;
    if (id !== null) {
        url += `/${id}`;
    }
    return url;
}

// ========================================
// 🔐 GESTIÓN DE CLAVE DEL CARRITO POR USUARIO
// ========================================

/**
 * Obtiene la clave del carrito específica para el usuario actual
 */
function obtenerClaveCarrito() {
  if (!isAuthenticated()) {
    console.warn('⚠️ Usuario no autenticado');
    return null;
  }
  
  const user = getCurrentUser();
  if (!user || !user.email) {
    console.warn('⚠️ No se pudo obtener el email del usuario');
    return null;
  }
  
  // Clave única por usuario usando su email
  const claveCarrito = `carrito_${user.email}`;
  console.log('🔑 Clave del carrito:', claveCarrito);
  return claveCarrito;
}

// ========================================
// 📦 GESTIÓN DEL CARRITO
// ========================================

/**
 * Obtiene el carrito actual del localStorage con validación
 */
export function obtenerCarrito() {
    const CARRITO_KEY = obtenerClaveCarrito();
    if (!CARRITO_KEY) {
        console.warn('⚠️ No se puede obtener carrito sin usuario autenticado');
        return [];
    }
    
    try {
        const carritoJSON = localStorage.getItem(CARRITO_KEY);
        const carrito = carritoJSON ? JSON.parse(carritoJSON) : [];
        
        // Validar estructura básica del carrito
        if (!Array.isArray(carrito)) {
            console.error('❌ Carrito corrupto (no es array), reiniciando...');
            guardarCarrito([]);
            return [];
        }
        
        // Filtrar items con estructura válida
        const carritoValido = carrito.filter(item => 
            item && 
            typeof item === 'object' &&
            item.id && 
            item.nombre && 
            typeof item.precio === 'number' && 
            typeof item.cantidad === 'number' &&
            item.cantidad > 0
        );
        
        // Si hay items inválidos, limpiarlos automáticamente
        if (carritoValido.length !== carrito.length) {
            console.warn(`⚠️ Se eliminaron ${carrito.length - carritoValido.length} items inválidos del carrito`);
            guardarCarrito(carritoValido);
            return carritoValido;
        }
        
        console.log('📦 Carrito obtenido:', carrito.length, 'items para', CARRITO_KEY);
        return carrito;
    } catch (error) {
        console.error('❌ Error obteniendo carrito:', error);
        // En caso de error, retornar carrito vacío y limpiar
        guardarCarrito([]);
        return [];
    }
}
/**
 * Guarda el carrito en localStorage
 */
function guardarCarrito(carrito) {
  const CARRITO_KEY = obtenerClaveCarrito();
  
  if (!CARRITO_KEY) {
    console.error('❌ No se puede guardar carrito sin usuario autenticado');
    return false;
  }
  
  try {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
    console.log('💾 Carrito guardado:', carrito.length, 'items en', CARRITO_KEY);
    
    // Disparar evento personalizado para actualizar la UI
    const evento = new CustomEvent('carritoActualizado', { 
      detail: { carrito, total: calcularTotal(carrito) } 
    });
    window.dispatchEvent(evento);
    console.log('📢 Evento carritoActualizado disparado');
    
    return true;
  } catch (error) {
    console.error('Error al guardar carrito:', error);
    return false;
  }
}

/**
 * Agrega un plato al carrito con validación en backend
 */
export async function agregarAlCarrito(plato) {
    if (!plato || !plato.id) {
        throw new Error('Plato inválido');
    }

    console.log(`🛒 Intentando agregar plato al carrito:`, plato);

    // Validar que el plato existe en el backend
    const platoValido = await validarPlatoEnBackend(plato.id);
    
    if (!platoValido) {
        throw new Error(`El producto "${plato.nombre}" no está disponible en este momento. Por favor, actualice la página.`);
    }

    const carrito = obtenerCarrito();
    
    // Verificar si el plato ya existe en el carrito
    const itemExistente = carrito.find(item => item.id === plato.id);

    if (itemExistente) {
        // Si existe, incrementar cantidad
        itemExistente.cantidad += 1;
        console.log(`📈 Cantidad incrementada: ${plato.nombre} (${itemExistente.cantidad})`);
    } else {
        // Si no existe, agregarlo con cantidad 1
        carrito.push({
            id: plato.id,
            nombre: plato.nombre,
            descripcion: plato.descripcion,
            precio: plato.precio,
            imagenUrl: plato.imagenUrl,
            cantidad: 1,
            notas: '' // Agregar campo notas para consistencia
        });
        console.log(`🆕 Nuevo producto agregado: ${plato.nombre}`);
    }

    guardarCarrito(carrito);
    console.log('✅ Plato agregado al carrito:', plato.nombre);
    
    // Disparar evento personalizado para notificar a otros componentes
    window.dispatchEvent(new CustomEvent('carritoActualizado', {
        detail: { 
            carrito: carrito,
            total: calcularTotal(carrito),
            accion: 'agregar', 
            plato: plato 
        }
    }));
    
    return carrito;
}
/**
 * Actualiza la cantidad de un item del carrito
 */
export function actualizarCantidad(platoId, nuevaCantidad) {
  if (nuevaCantidad < 1) {
    return eliminarDelCarrito(platoId);
  }

  const carrito = obtenerCarrito();
  const item = carrito.find(item => item.id === platoId);

  if (item) {
    item.cantidad = nuevaCantidad;
    guardarCarrito(carrito);
    console.log(`✅ Cantidad actualizada: ${item.nombre} x${nuevaCantidad}`);
    return carrito;
  }

  return carrito;
}

/**
 * Incrementa la cantidad de un item
 */
export function incrementarCantidad(platoId) {
  const carrito = obtenerCarrito();
  const item = carrito.find(item => item.id === platoId);

  if (item) {
    item.cantidad += 1;
    guardarCarrito(carrito);
    return carrito;
  }

  return carrito;
}

/**
 * Decrementa la cantidad de un item
 */
export function decrementarCantidad(platoId) {
  const carrito = obtenerCarrito();
  const item = carrito.find(item => item.id === platoId);

  if (item) {
    if (item.cantidad > 1) {
      item.cantidad -= 1;
      guardarCarrito(carrito);
    } else {
      // Si la cantidad es 1, eliminar del carrito
      return eliminarDelCarrito(platoId);
    }
  }

  return carrito;
}

/**
 * Elimina un plato del carrito
 */
export function eliminarDelCarrito(platoId) {
  let carrito = obtenerCarrito();
  const itemEliminado = carrito.find(item => item.id === platoId);
  
  carrito = carrito.filter(item => item.id !== platoId);
  guardarCarrito(carrito);
  
  if (itemEliminado) {
    console.log('🗑️ Plato eliminado del carrito:', itemEliminado.nombre);
  }
  
  return carrito;
}

/**
 * Vacía el carrito completamente
 */
export function vaciarCarrito() {
    const CARRITO_KEY = obtenerClaveCarrito();
    localStorage.removeItem(CARRITO_KEY);
    window.dispatchEvent(new CustomEvent('carritoActualizado', { 
        detail: { carrito: [], total: 0 } 
    }));
    console.log('🗑️ Carrito vaciado');
    return [];
}

// ========================================
// 📊 CÁLCULOS
// ========================================

/**
 * Calcula el total del carrito
 */
export function calcularTotal(carrito = null) {
  const items = carrito || obtenerCarrito();
  return items.reduce((total, item) => {
    return total + (item.precio * item.cantidad);
  }, 0);
}

/**
 * Calcula el subtotal de un item
 */
export function calcularSubtotal(item) {
  return item.precio * item.cantidad;
}

/**
 * Obtiene la cantidad total de items en el carrito
 */
export function obtenerCantidadTotal() {
  const carrito = obtenerCarrito();
  return carrito.reduce((total, item) => total + item.cantidad, 0);
}

/**
 * Obtiene el número de items únicos en el carrito
 */
export function obtenerNumeroItems() {
  return obtenerCarrito().length;
}

// ========================================
//  VALIDACIONES
// ========================================

/**
 * Verifica si el carrito está vacío
 */
export function carritoEstaVacio() {
  return obtenerCarrito().length === 0;
}

/**
 * Verifica si un plato está en el carrito
 */
export function platoEstaEnCarrito(platoId) {
  const carrito = obtenerCarrito();
  return carrito.some(item => item.id === platoId);
}

/**
 * Obtiene la cantidad de un plato en el carrito
 */
export function obtenerCantidadPlato(platoId) {
  const carrito = obtenerCarrito();
  const item = carrito.find(item => item.id === platoId);
  return item ? item.cantidad : 0;
}

// ========================================
// ✅ VALIDACIÓN DE PLATOS EN BACKEND
// ========================================

/**
 * Valida que un plato exista en el backend antes de agregarlo al carrito
 */
async function validarPlatoEnBackend(platoId) {
    try {
        if (!isAuthenticated()) {
            console.warn('⚠️ Usuario no autenticado, omitiendo validación');
            return true; // Permitir sin validación si no hay usuario autenticado
        }

        const url = getApiUrl('/api/platos', platoId);
        console.log(`🔍 Validando plato en backend: ${url}`);

        const user = getCurrentUser();
        const token = user?.token; // Asumiendo que tu userService devuelve el token

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            const plato = await response.json();
            console.log(`✅ Plato validado: ${plato.nombre} (ID: ${plato.id})`);
            return true;
        } else if (response.status === 404) {
            console.error(`❌ Plato no encontrado en backend: ID ${platoId}`);
            return false;
        } else {
            console.warn(`⚠️ Error validando plato ${platoId}: ${response.status}`);
            return true; // Permitir en caso de error de conexión
        }
    } catch (error) {
        console.warn(`⚠️ Error de conexión validando plato ${platoId}:`, error.message);
        return true; // Permitir en caso de error de conexión
    }
}

/**
 * Limpia el carrito de productos que no existen en el backend
 */
export async function limpiarCarritoDeProductosInvalidos() {
    try {
        console.log('🧹 Limpiando carrito de productos inválidos...');
        
        const carrito = obtenerCarrito();
        if (carrito.length === 0) {
            console.log('🛒 Carrito ya está vacío');
            return carrito;
        }

        const carritoLimpio = [];
        let productosEliminados = 0;

        // Validar cada producto individualmente
        for (const item of carrito) {
            const existeEnBackend = await validarPlatoEnBackend(item.id);
            
            if (existeEnBackend) {
                carritoLimpio.push(item);
            } else {
                console.log(`🗑️ Eliminando producto inválido: ${item.nombre} (ID: ${item.id})`);
                productosEliminados++;
            }
        }

        if (productosEliminados > 0) {
            guardarCarrito(carritoLimpio);
            console.log(`✅ Carrito limpiado: eliminados ${productosEliminados} productos inválidos`);
            
            // Notificar a la interfaz
            window.dispatchEvent(new CustomEvent('carritoActualizado', {
                detail: { 
                    carrito: carritoLimpio, 
                    total: calcularTotal(carritoLimpio),
                    accion: 'limpiar', 
                    productosEliminados 
                }
            }));
        } else {
            console.log('✅ Todos los productos del carrito son válidos');
        }

        return carritoLimpio;
    } catch (error) {
        console.error('❌ Error limpiando carrito:', error);
        return obtenerCarrito(); // Devolver carrito original en caso de error
    }
}

// ========================================
// 📋 RESUMEN DEL CARRITO
// ========================================

/**
 * Obtiene un resumen completo del carrito
 */
export function obtenerResumenCarrito() {
  const carrito = obtenerCarrito();
  const total = calcularTotal(carrito);
  const cantidadTotal = obtenerCantidadTotal();
  const numeroItems = obtenerNumeroItems();

  return {
    items: carrito,
    total,
    cantidadTotal,
    numeroItems,
    estaVacio: carritoEstaVacio()
  };
}
// ========================================
// 🛠️ HERRAMIENTAS DE DESARROLLO
// ========================================

/**
 * Función de desarrollo para debuggear el carrito
 */
export function debugCarrito() {
    console.log('🐛 DEBUG DEL CARRITO:');
    const carrito = obtenerCarrito();
    const clave = obtenerClaveCarrito();
    
    console.log('🔑 Clave:', clave);
    console.log('📦 Carrito:', carrito);
    console.log('📊 Total items:', carrito.length);
    console.log('💰 Total precio:', calcularTotal(carrito));
    
    carrito.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id} | "${item.nombre}" | $${item.precio} | Cantidad: ${item.cantidad}`);
    });
}

// Hacer disponible globalmente para debugging
if (typeof window !== 'undefined') {
    window.debugCarrito = debugCarrito;
    window.limpiarCarritoDeProductosInvalidos = limpiarCarritoDeProductosInvalidos;
}