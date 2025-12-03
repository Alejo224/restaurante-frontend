// ========================================
// 🔐 UTILIDADES JWT
// ========================================

/**
 * Decodifica un JWT sin validar firma (solo lectura)
 * IMPORTANTE: Esta decodificación es solo para leer datos, 
 * la validación real la hace el backend
 */
function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Token JWT inválido');
    }

    // Decodificar el payload (parte 2)
    const payload = parts[1];
    const decodedPayload = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decodificando JWT:', error);
    return null;
  }
}

/**
 * Verifica si el token ha expirado
 */
function isTokenExpired(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.exp) return true;

  const now = Math.floor(Date.now() / 1000);
  return decoded.exp < now;
}

/**
 * Extrae roles del token JWT
 */
function extractRolesFromToken(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.authorities) return [];

  // Las authorities vienen como string: "ROLE_ADMIN,READ,WRITE,..."
  const authorities = decoded.authorities.split(',');
  
  // Filtrar solo los roles (empiezan con ROLE_)
  return authorities
    .filter(auth => auth.startsWith('ROLE_'))
    .map(role => role.replace('ROLE_', ''));
}

/**
 * Extrae permisos del token JWT
 */
function extractPermissionsFromToken(token) {
  const decoded = decodeJWT(token);
  if (!decoded || !decoded.authorities) return [];

  const authorities = decoded.authorities.split(',');
  
  // Filtrar solo permisos (NO empiezan con ROLE_)
  return authorities.filter(auth => !auth.startsWith('ROLE_'));
}

/**
 * Extrae el email del token JWT
 */
function extractEmailFromToken(token) {
  const decoded = decodeJWT(token);
  return decoded?.sub || null;
}

// ========================================
// 📡 API CALLS
// ========================================

/**
 * Registra un nuevo cliente (público)
 */
export async function registerUser(data) {
  const API_URL = 'https://gestion-restaurante-api.onrender.com/api/usuarios/register';

  try {
    console.log('🌐 Registrando usuario en:', API_URL);
    console.log('📦 Datos:', data);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log('📨 Status:', response.status);

    if (!response.ok) {
      let errorMessage = 'Error en el registro';
      let errorFields = {};
      
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (isJson) {
        try {
          const errorData = await response.json();
          console.error('📩 Error JSON:', errorData);

          if (errorData?.errors && typeof errorData.errors === 'object') {
            errorFields = errorData.errors;
            const errorMessages = Object.values(errorData.errors);
            errorMessage = errorMessages.join(', ');
          } else if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }
        } catch (parseError) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      } else {
        try {
          const errorText = await response.text();
          errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      }

      const customError = new Error(errorMessage);
      if (Object.keys(errorFields).length > 0) {
        customError.fields = errorFields;
      }
      throw customError;
    }

    const result = await response.json();
    console.log('✅ Registro exitoso:', result);

    // Guardar token y datos del usuario
    if (result.jwt) {
      saveUserSession(result);
    }

    return result;
    
  } catch (error) {
    console.error('❌ Error en registerUser:', error);
    throw error;
  }
}

/**
 * Inicia sesión
 */
export async function loginUser(credentials) {
  const API_URL = 'https://gestion-restaurante-api.onrender.com/api/usuarios/login';

  try {
    console.log('🌐 Iniciando sesión en:', API_URL);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(credentials),
    });

    console.log('📨 Status:', response.status);
    console.log('📨 OK:', response.ok);

    if (!response.ok) {
      let errorMessage = 'Error al iniciar sesión';
      
      try {
        // Intentar leer como JSON
        const errorData = await response.json();
        errorMessage = errorData.message || errorData.error || errorMessage;
      } catch (parseError) {
        // Si no hay cuerpo JSON, determinar por status
        console.log('ℹ️ Respuesta sin cuerpo JSON, usando código de estado:', response.status);
        
        if (response.status === 401 || response.status === 403) {
          errorMessage = 'Email o contraseña incorrectas, por favor inténtelo de nuevo.';
        } else if (response.status === 404) {
          errorMessage = 'Servicio no disponible';
        } else if (response.status >= 500) {
          errorMessage = 'Error interno del servidor';
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    console.log('✅ Login exitoso:', result);

    // Guardar sesión
    if (result.jwt) {
      saveUserSession(result);
    }

    return result;

  } catch (error) {
    console.error('❌ Error en loginUser:', error);
    throw error;
  }
}

/**
 * Cierra sesión
 */
export async function logout() {
  try {
    // Llamar endpoint de logout del backend
    await fetch('https://gestion-restaurante-api.onrender.com/api/usuarios/logout', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
  } catch (error) {
    console.warn('⚠️ Error cerrando sesión en backend:', error);
  } finally {
    // Limpiar localStorage
    clearUserSession();
    
    // 🛒 IMPORTANTE: Limpiar carrito al cerrar sesión
    // Nota: No importamos aquí para evitar dependencia circular
    // El carrito se limpiará automáticamente porque usa el email del usuario
    
    // Redirigir al home
    window.location.hash = '/';
    window.location.reload();
  }
}

// ========================================
// MANEJO DE SESIÓN (localStorage)
// ========================================

/**
 * Guarda la sesión del usuario
 */
function saveUserSession(authResponse) {
  const { email, jwt } = authResponse;
  
  // Extraer información del token
  const roles = extractRolesFromToken(jwt);
  const permissions = extractPermissionsFromToken(jwt);
  const decoded = decodeJWT(jwt);
  
  const userData = {
    email,
    roles,
    permissions,
    token: jwt,
    expiresAt: decoded?.exp ? new Date(decoded.exp * 1000).toISOString() : null
  };

  localStorage.setItem('user_token', jwt);
  localStorage.setItem('user_data', JSON.stringify(userData));
  
  console.log('💾 Sesión guardada:', userData);
}

/**
 * Limpia la sesión del usuario
 */
function clearUserSession() {
  localStorage.removeItem('user_token');
  localStorage.removeItem('user_data');
}

/**
 * Obtiene el token JWT
 */
export function getToken() {
  return localStorage.getItem('user_token');
}

/**
 * Obtiene los datos del usuario actual
 */
export function getCurrentUser() {
  const userData = localStorage.getItem('user_data');
  if (!userData) return null;
  
  try {
    const user = JSON.parse(userData);
    
    // Verificar si el token expiró
    if (isTokenExpired(user.token)) {
      console.warn('⚠️ Token expirado, cerrando sesión');
      clearUserSession();
      return null;
    }
    
    return user;
  } catch {
    return null;
  }
}

// ========================================
// 🔒 VERIFICACIÓN DE ROLES Y PERMISOS
// ========================================

/**
 * Verifica si el usuario está autenticado
 */
export function isAuthenticated() {
  const token = getToken();
  if (!token) return false;
  return !isTokenExpired(token);
}

/**
 * Verifica si el usuario tiene un rol específico
 */
export function hasRole(roleName) {
  const user = getCurrentUser();
  if (!user || !user.roles) return false;
  return user.roles.includes(roleName);
}

/**
 * Verifica si el usuario es ADMIN
 */
export function isAdmin() {
  return hasRole('ADMIN');
}

/**
 * Verifica si el usuario es USER
 */
export function isUser() {
  return hasRole('USER');
}

/**
 * Verifica si el usuario tiene un permiso específico
 */
export function hasPermission(permissionName) {
  const user = getCurrentUser();
  if (!user || !user.permissions) return false;
  return user.permissions.includes(permissionName);
}

/**
 * Verifica si el usuario puede crear (CREATE)
 */
export function canCreate() {
  return hasPermission('CREATE');
}

/**
 * Verifica si el usuario puede editar (UPDATE)
 */
export function canUpdate() {
  return hasPermission('UPDATE');
}

/**
 * Verifica si el usuario puede eliminar (DELETE)
 */
export function canDelete() {
  return hasPermission('DELETE');
}

/**
 * Verifica si el usuario puede leer (READ)
 */
export function canRead() {
  return hasPermission('READ');
}

// ========================================
// 🌐 FUNCIÓN HELPER PARA FETCH CON AUTH
// ========================================

/**
 * Fetch con autorización automática
 */
export async function fetchWithAuth(url, options = {}) {
  const token = getToken();
  
  if (!token) {
    throw new Error('No hay token de autenticación');
  }

  if (isTokenExpired(token)) {
    clearUserSession();
    throw new Error('Token expirado, por favor inicia sesión nuevamente');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers
    });

    // Si el token es inválido, limpiar sesión
    if (response.status === 401 || response.status === 403) {
      clearUserSession();
      throw new Error('Sesión inválida o expirada');
    }

    return response;
  } catch (error) {
    console.error('❌ Error en fetchWithAuth:', error);
    throw error;
  }
}

// ========================================
// 📊 DEBUG (solo desarrollo)
// ========================================

/**
 * Muestra información del usuario actual (debug)
 */
export function debugUserInfo() {
  const user = getCurrentUser();
  console.group('👤 Información del usuario');
  console.log('Email:', user?.email);
  console.log('Roles:', user?.roles);
  console.log('Permisos:', user?.permissions);
  console.log('Token expira:', user?.expiresAt);
  console.log('¿Es Admin?:', isAdmin());
  console.log('¿Es User?:', isUser());
  console.groupEnd();
}