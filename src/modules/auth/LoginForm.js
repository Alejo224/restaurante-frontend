// src/modules/auth/LoginForm.js
import { loginUser, isAdmin, isUser, getCurrentUser } from './userService.js';
import { router } from '../../router.js';

export function LoginForm() {
  const container = document.createElement('div');

  container.innerHTML = `
    <form id="loginForm" class="p-4 shadow-lg rounded-4 bg-white form-card-hover">
      <!-- Header consistente con el registro -->
      <div class="text-center mb-4">
        <i class="bi bi-egg-fried display-4 text-primary mb-3"></i>
        <h3 class="text-dark fw-bold">Bienvenido de Nuevo</h3>
        <p class="text-muted">Ingresa a tu cuenta para continuar</p>
      </div>

      <!-- Email -->
      <div class="mb-3">
        <label for="email" class="form-label fw-semibold text-dark">Correo Electrónico *</label>
        <input 
          type="email" 
          class="form-control form-control-lg" 
          id="email" 
          name="email" 
          placeholder="correo@ejemplo.com" 
          required
        />
        <div class="invalid-feedback" id="emailError"></div>
      </div>

      <!-- Contraseña -->
      <div class="mb-3">
        <label for="password" class="form-label fw-semibold text-dark">Contraseña *</label>
        <input 
          type="password" 
          class="form-control form-control-lg" 
          id="password" 
          name="password"
          placeholder="Ingresa tu contraseña" 
          required
        />
        <div class="invalid-feedback" id="passwordError"></div>
      </div>

      <!-- Recordar sesión y olvidé contraseña -->
      
      <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="form-check">
          <input class="form-check-input" type="checkbox" id="rememberMe">
          <label class="form-check-label text-muted small" for="rememberMe">
            Recordar sesión
          </label>
        </div>
        <a href="#" id="forgotPassword" class="text-primary text-decoration-none small">
          ¿Olvidaste tu contraseña?
        </a>
      </div>


      <!-- Botón de login -->
      <div class="d-grid mb-3">
        <button type="submit" class="btn btn-primary btn-lg py-3 fw-bold" id="submitBtn">
          <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
        </button>
      </div>

      <!-- Link para registro -->
      <div class="text-center mb-3">
        <small class="text-muted">
          ¿No tienes una cuenta? 
          <a href="#" id="registerLink" class="text-primary text-decoration-none fw-semibold">Regístrate aquí</a>
        </small>
      </div>

      <!-- Mensajes generales -->
      <div id="messageContainer" class="mt-3"></div>
    </form>
  `;

  const form = container.querySelector('#loginForm');
  const submitBtn = container.querySelector('#submitBtn');
  const messageContainer = container.querySelector('#messageContainer');

  // Función para limpiar errores
  function clearErrors() {
    const errorElements = container.querySelectorAll('.is-invalid, .invalid-feedback');
    errorElements.forEach(el => {
      if (el.classList.contains('is-invalid')) {
        el.classList.remove('is-invalid');
      }
      if (el.classList.contains('invalid-feedback')) {
        el.textContent = '';
      }
    });
    messageContainer.innerHTML = '';
  }

  // Función para mostrar error en campo
  function showFieldError(fieldId, message) {
    const field = container.querySelector(`#${fieldId}`);
    const errorElement = container.querySelector(`#${fieldId}Error`);
    
    if (field && errorElement) {
      field.classList.add('is-invalid');
      errorElement.textContent = message;
    }
  }

  // Función para mostrar mensaje general
  function showMessage(message, type = 'info') {
    messageContainer.innerHTML = `
      <div class="alert alert-${type} alert-dismissible fade show">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;
  }

  // Función para loading
  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status"></span>
        Iniciando sesión...
      `;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <i class="bi bi-box-arrow-in-right me-2"></i>Iniciar Sesión
      `;
    }
  }

  // Función para edirigir según el rol
  function redirectByRole() {
    const user = getCurrentUser();
    
    if (!user) {
      console.warn('⚠️ No se pudo obtener usuario después del login');
      router.navigate('/menu');
      return;
    }

    console.log('👤 Usuario logueado:', {
      email: user.email,
      roles: user.roles,
      permissions: user.permissions
    });

    // Redirigir según rol
    if (isAdmin()) {
      console.log('🎭 Usuario es ADMIN → Redirigiendo a panel de administración');
      router.navigate('/admin/menu');
    } else if (isUser()) {
      console.log('🎭 Usuario es USER → Redirigiendo a menú público');
      router.navigate('/menu');
    } else {
      console.warn('⚠️ Usuario sin rol específico → Redirigiendo a menú por defecto');
      router.navigate('/menu');
    }
  }

  // Evento del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('📤 Iniciando proceso de login...');
    clearErrors();

    const credentials = {
      email: form.email.value.trim(),
      password: form.password.value
    };

    // Validación básica
    if (!credentials.email || !credentials.password) {
      showMessage('Por favor completa todos los campos', 'warning');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Enviando credenciales...');
      
      // ✅ loginUser ahora devuelve { email, message, jwt, status }
      const response = await loginUser(credentials);
      
      console.log('✅ Login exitoso:', response);
      
      // ✅ Obtener el usuario del localStorage (ya guardado por loginUser)
      const user = getCurrentUser();
      
      // Mostrar mensaje de bienvenida
      const displayName = user?.email.split('@')[0] || 'Usuario';
      showMessage(`¡Bienvenido ${displayName}!`, 'success');
      
      // ✅ Redirigir después de 1 segundo
      setTimeout(() => {
        redirectByRole();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error en el login:', error);
      
      // Mostrar error específico
      const errorMessage = error.message || 'Error al iniciar sesión';
      
      // Detectar tipo de error
      if (errorMessage.toLowerCase().includes('credenciales') || 
          errorMessage.toLowerCase().includes('contraseña') || 
          errorMessage.toLowerCase().includes('password') ||
          errorMessage.toLowerCase().includes('inválid')) {
        showFieldError('password', 'Correo o contraseña incorrectos');
        showMessage('Correo o contraseña incorrectos', 'danger');
      } else if (errorMessage.toLowerCase().includes('email') || 
                 errorMessage.toLowerCase().includes('correo') || 
                 errorMessage.toLowerCase().includes('usuario')) {
        showFieldError('email', errorMessage);
        showMessage(errorMessage, 'danger');
      } else if (errorMessage.toLowerCase().includes('token') ||
                 errorMessage.toLowerCase().includes('expirado')) {
        showMessage('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning');
      } else {
        showMessage(errorMessage, 'danger');
      }
    } finally {
      setLoading(false);
    }
  });

  // Event listeners para navegación
  container.querySelector('#registerLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/register');
  });

  container.querySelector('#forgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Funcionalidad de recuperación de contraseña - Próximamente', 'info');
  });

  return container;
}