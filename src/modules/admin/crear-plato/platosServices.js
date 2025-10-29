// src/modules/admin/crear-plato/platosService.js
// Servicio completo para gestión de platos con autenticación JWT

import { getToken, isAuthenticated, isAdmin, canCreate, canUpdate, canDelete } from '../../auth/userService.js';

const API_BASE_URL = 'http://localhost:8080/api/platos';

// ========================================
// FUNCIÓN HELPER PARA PETICIONES CON AUTH
// ========================================

/**
 * Hace una petición fetch con token de autenticación
 */
async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  
  if (!token || !isAuthenticated()) {
    throw new Error('No hay sesión activa. Por favor, inicia sesión.');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  // No agregar Content-Type si es FormData (para subir imágenes)
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Si el token es inválido o expiró
    if (response.status === 401 || response.status === 403) {
      throw new Error('Sesión expirada o sin permisos. Por favor, inicia sesión nuevamente.');
    }

    return response;
  } catch (error) {
    console.error('❌ Error en fetchWithAuth:', error);
    throw error;
  }
}

// ========================================
// OBTENER PLATOS (Público - sin auth)
// ========================================

/**
 * Obtiene todos los platos (público)
 */
export async function obtenerPlatos() {
  try {
    console.log('🔄 Obteniendo lista de platos...');
    
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`Error al obtener platos: ${response.status}`);
    }

    const platos = await response.json();
    console.log('✅ Platos obtenidos:', platos.length);
    return platos;
    
  } catch (error) {
    console.error('❌ Error en obtenerPlatos:', error);
    throw new Error('No se pudo obtener la lista de platos: ' + error.message);
  }
}

/**
 * Obtiene un plato por ID (público)
 */
export async function obtenerPlatoPorId(id) {
  try {
    console.log(`🔄 Obteniendo plato con ID: ${id}`);
    
    const response = await fetch(`${API_BASE_URL}/${id}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Plato no encontrado');
      }
      throw new Error(`Error al obtener plato: ${response.status}`);
    }

    const plato = await response.json();
    console.log('✅ Plato obtenido:', plato);
    return plato;
    
  } catch (error) {
    console.error('❌ Error en obtenerPlatoPorId:', error);
    throw error;
  }
}

// ========================================
// CREAR PLATO (Requiere auth + permiso CREATE)
// ========================================

/**
 * Crea un nuevo plato con imagen
 * @param {Object} data - Datos del plato
 * @param {string} data.nombre - Nombre del plato
 * @param {string} data.descripcion - Descripción del plato
 * @param {number} data.categoria - ID de la categoría
 * @param {number} data.precio - Precio del plato
 * @param {File} data.imagen - Archivo de imagen
 */
export async function crearPlato(data) {
  // Verificar permisos
  if (!isAdmin() || !canCreate()) {
    throw new Error('No tienes permisos para crear platos');
  }

  try {
    console.log('📤 Creando nuevo plato...');
    console.log('📦 Datos recibidos:', data);

    // Validar datos
    if (!data.nombre || !data.descripcion || !data.categoria || !data.precio) {
      throw new Error('Todos los campos son obligatorios');
    }

    if (!data.imagen) {
      throw new Error('Debes seleccionar una imagen');
    }

    // Preparar datos del plato
    const categoriaIdNumerico = parseInt(data.categoria);
    const precioPlatoNumerico = parseFloat(data.precio);

    if (isNaN(categoriaIdNumerico) || isNaN(precioPlatoNumerico)) {
      throw new Error('Categoría o precio inválidos');
    }

    const platoData = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      categoriaId: categoriaIdNumerico,
      precio: precioPlatoNumerico
    };

    // Crear FormData para enviar imagen
    const formData = new FormData();
    formData.append('plato', JSON.stringify(platoData));
    formData.append('imagen', data.imagen);

    // Hacer petición con autenticación
    const response = await fetchWithAuth(API_BASE_URL, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error al crear plato: ${response.status} - ${errorText}`);
    }

    const platoCreado = await response.json();
    console.log('✅ Plato creado exitosamente:', platoCreado);
    return platoCreado;

  } catch (error) {
    console.error('❌ Error en crearPlato:', error);
    throw new Error('Error al crear el plato: ' + error.message);
  }
}

// ========================================
// ACTUALIZAR PLATO (Requiere auth + permiso UPDATE)
// ========================================

/**
 * Actualiza un plato existente
 * @param {number} id - ID del plato a actualizar
 * @param {Object} data - Datos actualizados del plato
 * @param {File} [data.imagen] - Nueva imagen (opcional)
 */
export async function actualizarPlato(id, data) {
  // Verificar permisos
  if (!isAdmin() || !canUpdate()) {
    throw new Error('No tienes permisos para actualizar platos');
  }

  try {
    console.log(`📤 Actualizando plato ID: ${id}`);
    console.log('📦 Datos nuevos:', data);

    // Validar ID
    if (!id || isNaN(id)) {
      throw new Error('ID de plato inválido');
    }

    // Preparar datos del plato
    const platoData = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      categoriaId: parseInt(data.categoria),
      precio: parseFloat(data.precio),
      disponible: data.disponible
    };

    // Verificar que los datos sean válidos
    if (!platoData.nombre || !platoData.descripcion) {
      throw new Error('Nombre y descripción son obligatorios');
    }

    if (isNaN(platoData.categoriaId) || isNaN(platoData.precio)) {
      throw new Error('Categoría o precio inválidos');
    }

    // Crear FormData
    const formData = new FormData();
    formData.append('plato', JSON.stringify(platoData));

    // Agregar nueva imagen solo si se proporcionó
    if (data.imagen instanceof File) {
      formData.append('imagen', data.imagen);
      console.log('📷 Nueva imagen incluida');
    } else {
      console.log('ℹ️ Sin cambio de imagen');
    }

    // Hacer petición con autenticación
    const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      body: formData
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error al actualizar plato: ${response.status} - ${errorText}`);
    }

    const platoActualizado = await response.json();
    console.log('✅ Plato actualizado exitosamente:', platoActualizado);
    return platoActualizado;

  } catch (error) {
    console.error('❌ Error en actualizarPlato:', error);
    throw new Error('Error al actualizar el plato: ' + error.message);
  }
}

// ========================================
// 🗑️ ELIMINAR PLATO (Requiere auth + permiso DELETE)
// ========================================

/**
 * Elimina un plato por su ID
 * @param {number} id - ID del plato a eliminar
 */
export async function eliminarPlato(id) {
  // Verificar permisos
  if (!isAdmin() || !canDelete()) {
    throw new Error('No tienes permisos para eliminar platos');
  }

  try {
    console.log(`🗑️ Eliminando plato ID: ${id}`);

    // Validar ID
    if (!id || isNaN(id)) {
      throw new Error('ID de plato inválido');
    }

    // Hacer petición con autenticación
    const response = await fetchWithAuth(`${API_BASE_URL}/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error('Plato no encontrado');
      }
      const errorText = await response.text();
      console.error('❌ Error del servidor:', errorText);
      throw new Error(`Error al eliminar plato: ${response.status} - ${errorText}`);
    }

    console.log('✅ Plato eliminado exitosamente');
    return true;

  } catch (error) {
    console.error('❌ Error en eliminarPlato:', error);
    throw new Error('Error al eliminar el plato: ' + error.message);
  }
}

// ========================================
// FUNCIONES AUXILIARES
// ========================================

/**
 * Verifica si se pueden mostrar botones de administración
 */
export function mostrarBotonesAdmin() {
  return isAdmin() && (canCreate() || canUpdate() || canDelete());
}

/**
 * Valida los datos de un plato antes de enviar
 */
export function validarDatosPlato(data) {
  const errores = [];

  if (!data.nombre || data.nombre.trim().length === 0) {
    errores.push('El nombre es obligatorio');
  }

  if (!data.descripcion || data.descripcion.trim().length === 0) {
    errores.push('La descripción es obligatoria');
  }

  if (!data.categoria || isNaN(parseInt(data.categoria))) {
    errores.push('Debes seleccionar una categoría válida');
  }

  if (!data.precio || isNaN(parseFloat(data.precio)) || parseFloat(data.precio) <= 0) {
    errores.push('El precio debe ser un número mayor a 0');
  }

  return {
    valido: errores.length === 0,
    errores
  };
}

// ========================================
//  EXPORTAR TAMBIÉN CATEGORÍAS
// ========================================

export { obtenerCategorias } from './categoriaService.js';