// src/modules/auth/LoginForm.js
import { loginUser, isAdmin, isUser, getCurrentUser } from './userService.js';
import { router } from '../../router.js';

export function LoginForm() {
  const container = document.createElement('div');
  container.setAttribute('role', 'main');
  container.setAttribute('aria-label', 'Formulario de inicio de sesión');

  container.innerHTML = `
    <form id="loginForm" class="p-4 shadow-lg rounded-4 bg-white form-card-hover" 
          aria-labelledby="loginHeading" novalidate>
      
      <!-- Header consistente con el registro -->
      <div class="text-center mb-4">
        <i class="bi bi-egg-fried display-4 text-primary mb-3" aria-hidden="true"></i>
        <h3 id="loginHeading" class="text-dark fw-bold">Bienvenido de Nuevo</h3>
        <p class="text-muted">Ingresa a tu cuenta para continuar</p>
      </div>

      <!-- Campo Email -->
      <div class="mb-3">
        <label for="email" class="form-label fw-semibold text-dark">
          Correo Electrónico <span class="text-danger" aria-hidden="true">*</span>
          <span class="visually-hidden">campo requerido</span>
        </label>
        <input 
          type="email" 
          class="form-control form-control-lg" 
          id="email" 
          name="email" 
          placeholder="correo@ejemplo.com" 
          required
          aria-required="true"
          aria-describedby="emailHelp emailError"
          autocomplete="email"
        />
        <div id="emailHelp" class="form-text visually-hidden">
          Ingresa tu dirección de correo electrónico registrada
        </div>
        <div class="invalid-feedback" id="emailError" role="alert" aria-live="polite"></div>
      </div>

      <!-- Campo Contraseña -->
      <div class="mb-3">
        <label for="password" class="form-label fw-semibold text-dark">
          Contraseña <span class="text-danger" aria-hidden="true">*</span>
          <span class="visually-hidden">campo requerido</span>
        </label>
        <div class="input-group">
          <input 
            type="password" 
            class="form-control form-control-lg" 
            id="password" 
            name="password"
            placeholder="Ingresa tu contraseña" 
            required
            aria-required="true"
            aria-describedby="passwordHelp passwordError"
            autocomplete="current-password"
          />
          <button 
            type="button" 
            class="btn btn-outline-secondary" 
            id="togglePassword"
            aria-label="Mostrar contraseña"
            aria-pressed="false"
            tabindex="0"
          >
            <i class="bi bi-eye" aria-hidden="true"></i>
          </button>
        </div>
        <div id="passwordHelp" class="form-text visually-hidden">
          Ingresa la contraseña de tu cuenta
        </div>
        <div class="invalid-feedback" id="passwordError" role="alert" aria-live="polite"></div>
      </div>

      <!-- Recordar sesión y olvidé contraseña -->
      <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="form-check">
          <input 
            class="form-check-input" 
            type="checkbox" 
            id="rememberMe"
            aria-describedby="rememberHelp"
          >
          <label class="form-check-label text-muted small" for="rememberMe">
            Recordar sesión
          </label>
          <div id="rememberHelp" class="form-text visually-hidden">
            Mantener la sesión iniciada en este dispositivo
          </div>
        </div>
        
        <!-- Enlace para recuperar contraseña -->
      
      </div>

      <!-- Botón de login -->
      <div class="d-grid mb-3">
        <button 
          type="submit" 
          class="btn btn-primary btn-lg py-3 fw-bold" 
          id="submitBtn"
          aria-label="Iniciar sesión en la cuenta"
        >
          <i class="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>
          Iniciar Sesión
        </button>
      </div>

      <!-- Link para registro -->
      <div class="text-center mb-3">
        <small class="text-muted">
          ¿No tienes una cuenta? 
          <a href="#" id="registerLink" class="text-primary text-decoration-none fw-semibold" 
             aria-label="Crear una nueva cuenta">
            Regístrate aquí
          </a>
        </small>
      </div>

      <!-- Mensajes generales -->
      <div id="messageContainer" 
           class="mt-3" 
           role="alert" 
           aria-live="assertive" 
           aria-atomic="true">
      </div>

      <!-- Navegación de accesibilidad oculta -->
      <div class="visually-hidden" aria-live="polite" aria-atomic="true">
        <div id="formStatus"></div>
      </div>
    </form>

    <!-- CSS adicional para accesibilidad -->
    <style>
      .form-card-hover {
        transition: all 0.3s ease;
      }
      
      .form-card-hover:focus-within {
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25) !important;
        transform: translateY(-2px);
      }
      
      .btn:focus-visible,
      .form-control:focus-visible,
      .form-check-input:focus-visible {
        outline: 3px solid #0d6efd;
        outline-offset: 2px;
      }
      
      .invalid-feedback {
        display: block;
      }
      
      .input-group .btn:focus-visible {
        position: relative;
        z-index: 3;
      }
      
      /* Alto contraste */
      @media (prefers-contrast: high) {
        .form-control {
          border: 2px solid #000;
        }
        
        .btn {
          border: 2px solid currentColor;
        }
        
        .text-muted {
          color: #000 !important;
        }
      }
      
      /* Movimiento reducido */
      @media (prefers-reduced-motion: reduce) {
        .form-card-hover {
          transition: none;
        }
      }
    </style>
  `;

  const form = container.querySelector('#loginForm');
  const submitBtn = container.querySelector('#submitBtn');
  const messageContainer = container.querySelector('#messageContainer');
  const formStatus = container.querySelector('#formStatus');

  // Inicializar funcionalidad de accesibilidad
  function initializeAccessibility() {
    // Enfocar el primer campo al cargar
    const emailInput = container.querySelector('#email');
    if (emailInput) {
      setTimeout(() => emailInput.focus(), 100);
    }
    
    // Toggle de visibilidad de contraseña
    const togglePassword = container.querySelector('#togglePassword');
    const passwordInput = container.querySelector('#password');
    
    if (togglePassword && passwordInput) {
      togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const isPressed = type === 'text';
        this.setAttribute('aria-pressed', isPressed);
        this.setAttribute('aria-label', isPressed ? 'Ocultar contraseña' : 'Mostrar contraseña');
        
        // Cambiar icono
        const icon = this.querySelector('i');
        if (icon) {
          icon.className = isPressed ? 'bi bi-eye-slash' : 'bi bi-eye';
          icon.setAttribute('aria-hidden', 'true');
        }
      });
      
      // También permitir toggle con Enter/Space
      togglePassword.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }
  }

  // Función para anunciar estado del formulario
  function announceFormStatus(message) {
    if (formStatus) {
      formStatus.textContent = message;
    }
  }

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
    announceFormStatus('Errores limpiados');
  }

  // Función para mostrar error en campo
  function showFieldError(fieldId, message) {
    const field = container.querySelector(`#${fieldId}`);
    const errorElement = container.querySelector(`#${fieldId}Error`);
    
    if (field && errorElement) {
      field.classList.add('is-invalid');
      errorElement.textContent = message;
      announceFormStatus(`Error en ${fieldId}: ${message}`);
    }
  }

  // Función para mostrar mensaje general
  function showMessage(message, type = 'info') {
    const alertType = type === 'error' ? 'danger' : type;
    
    messageContainer.innerHTML = `
      <div class="alert alert-${alertType} alert-dismissible fade show" role="alert">
        <i class="bi bi-${getAlertIcon(type)} me-2" aria-hidden="true"></i>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" 
                aria-label="Cerrar mensaje"></button>
      </div>
    `;
    
    announceFormStatus(message);
  }

  // Función para obtener icono según tipo de alerta
  function getAlertIcon(type) {
    const icons = {
      success: 'check-circle',
      danger: 'exclamation-triangle',
      warning: 'exclamation-circle',
      info: 'info-circle'
    };
    return icons[type] || 'info-circle';
  }

  // Función para loading
  function setLoading(loading) {
    if (loading) {
      submitBtn.disabled = true;
      submitBtn.setAttribute('aria-busy', 'true');
      submitBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Iniciando sesión...
      `;
      announceFormStatus('Procesando inicio de sesión, por favor espere...');
    } else {
      submitBtn.disabled = false;
      submitBtn.setAttribute('aria-busy', 'false');
      submitBtn.innerHTML = `
        <i class="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>
        Iniciar Sesión
      `;
    }
  }

  // Función para redirigir según el rol
  function redirectByRole() {
    const user = getCurrentUser();
    
    if (!user) {
      console.warn('⚠️ No se pudo obtener usuario después del login');
      announceFormStatus('No se pudo obtener información del usuario, redirigiendo al menú');
      router.navigate('/menu');
      return;
    }

    console.log('👤 Usuario logueado:', {
      email: user.email,
      roles: user.roles,
      permissions: user.permissions
    });

    // Anunciar redirección
    announceFormStatus(`Usuario autenticado como ${user.email}, redirigiendo...`);

    // Redirigir según rol
    if (isAdmin()) {
      console.log('🎭 Usuario es ADMIN → Redirigiendo a panel de administración');
      router.navigate('/admin/panel');
    } else if (isUser()) {
      console.log('🎭 Usuario es USER → Redirigiendo a menú público');
      router.navigate('/dashboard');
    } else {
      console.warn('⚠️ Usuario sin rol específico → Redirigiendo a menú por defecto');
      router.navigate('/menu');
    }
  }

  // Validación del formulario
  function validateForm(credentials) {
    let isValid = true;
    
    if (!credentials.email || !credentials.email.includes('@')) {
      showFieldError('email', 'Por favor ingresa un correo electrónico válido');
      isValid = false;
    }
    
    if (!credentials.password) {
      showFieldError('password', 'Por favor ingresa tu contraseña');
      isValid = false;
    }
    
    return isValid;
  }

  // Evento del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('📤 Iniciando proceso de login...');
    clearErrors();
    announceFormStatus('Validando formulario de inicio de sesión');

    const credentials = {
      email: form.email.value.trim(),
      password: form.password.value
    };

    // Validación básica
    if (!validateForm(credentials)) {
      announceFormStatus('Errores de validación encontrados. Por favor corrige los campos marcados.');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Enviando credenciales...');
      announceFormStatus('Verificando credenciales...');
      
      const response = await loginUser(credentials);
      
      console.log('✅ Login exitoso:', response);
      announceFormStatus('Inicio de sesión exitoso');
      
      const user = getCurrentUser();
      
      // Mostrar mensaje de bienvenida
      const displayName = user?.email.split('@')[0] || 'Usuario';
      showMessage(`¡Bienvenido ${displayName}!`, 'success');
      
      // Redirigir después de 1 segundo
      setTimeout(() => {
        redirectByRole();
      }, 1000);
      
    } catch (error) {
      console.error('❌ Error en el login:', error);
      
      // Mostrar error específico
      const errorMessage = error.message || 'Error al iniciar sesión';
      announceFormStatus(`Error: ${errorMessage}`);
      
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
    announceFormStatus('Navegando al formulario de registro');
    router.navigate('/register');
  });

  // Event listener para recuperación de contraseña
  container.querySelector('#forgotPasswordLink').addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Funcionalidad de recuperación de contraseña - Próximamente', 'info');
    announceFormStatus('Funcionalidad de recuperación de contraseña no disponible aún');
  });

  // Inicializar accesibilidad después de que el DOM esté listo
  setTimeout(initializeAccessibility, 0);

  return container;
}