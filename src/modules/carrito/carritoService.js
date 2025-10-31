// src/modules/carrito/carritoService.js
// Servicio para gestionar el carrito de compras

import { getCurrentUser, isAuthenticated } from '../auth/userService.js';

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
 * Obtiene el carrito actual del localStorage
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
    console.log('📦 Carrito obtenido:', carrito.length, 'items para', CARRITO_KEY);
    return carrito;
  } catch (error) {
    console.error('Error al obtener carrito:', error);
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
 * Agrega un plato al carrito
 */
export function agregarAlCarrito(plato) {
  if (!plato || !plato.id) {
    throw new Error('Plato inválido');
  }

  const carrito = obtenerCarrito();
  
  // Verificar si el plato ya existe en el carrito
  const itemExistente = carrito.find(item => item.id === plato.id);

  if (itemExistente) {
    // Si existe, incrementar cantidad
    itemExistente.cantidad += 1;
  } else {
    // Si no existe, agregarlo con cantidad 1
    carrito.push({
      id: plato.id,
      nombre: plato.nombre,
      descripcion: plato.descripcion,
      precio: plato.precio,
      imagenUrl: plato.imagenUrl,
      cantidad: 1
    });
  }

  guardarCarrito(carrito);
  console.log('✅ Plato agregado al carrito:', plato.nombre);
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