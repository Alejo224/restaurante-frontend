// src/modules/auth/LoginForm.js
import { loginUser, isAdmin, isUser, getCurrentUser } from './userService.js';
import { router } from '../../router.js';

export function LoginForm() {
  const container = document.createElement('div');

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

      <!-- Recordar sesión -->
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
      }
      
      /* Movimiento reducido */
      @media (prefers-reduced-motion: reduce) {
        .form-card-hover {
          transition: none;
        }
      }
    </style>
  `;

  // JavaScript para funcionalidad de accesibilidad
  setTimeout(() => {
    // Enfocar el primer campo al cargar
    const emailInput = document.getElementById('email');
    if (emailInput) {
      emailInput.focus();
    }
    
    // Toggle de visibilidad de contraseña
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('password');
    
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
    
    // Manejo de validación del formulario
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Limpiar estados previos
        const fields = ['email', 'password'];
        fields.forEach(field => {
          const input = document.getElementById(field);
          const error = document.getElementById(field + 'Error');
          if (input && error) {
            input.classList.remove('is-invalid');
            error.textContent = '';
          }
        });
        
        // Validación básica
        let isValid = true;
        const email = document.getElementById('email');
        const password = document.getElementById('password');
        
        if (!email.value || !email.validity.valid) {
          email.classList.add('is-invalid');
          document.getElementById('emailError').textContent = 'Por favor ingresa un correo electrónico válido';
          isValid = false;
        }
        
        if (!password.value) {
          password.classList.add('is-invalid');
          document.getElementById('passwordError').textContent = 'Por favor ingresa tu contraseña';
          isValid = false;
        }
        
        if (isValid) {
          // Simular envío exitoso
          const messageContainer = document.getElementById('messageContainer');
          const formStatus = document.getElementById('formStatus');
          
          if (messageContainer) {
            messageContainer.innerHTML = `
              <div class="alert alert-success alert-dismissible fade show" role="alert">
                <i class="bi bi-check-circle me-2" aria-hidden="true"></i>
                Iniciando sesión... Por favor espera.
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar mensaje"></button>
              </div>
            `;
          }
          
          if (formStatus) {
            formStatus.textContent = 'Formulario enviado correctamente. Procesando inicio de sesión...';
          }
          
          // Aquí iría la lógica real de autenticación
          console.log('Formulario válido, procesando login...');
        } else {
          // Anunciar errores
          const formStatus = document.getElementById('formStatus');
          if (formStatus) {
            formStatus.textContent = 'Por favor corrige los errores en el formulario antes de enviar.';
          }
        }
      });
    }
  }, 100);

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
      router.navigate('/admin/panel');
    } else if (isUser()) {
      console.log('🎭 Usuario es USER → Redirigiendo a menú público');
      router.navigate('/dashboard');
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

  /* Eent listeneres para recuperacion de constraseña (funcionalidad no terminada)
  container.querySelector('#forgotPassword').addEventListener('click', (e) => {
    e.preventDefault();
    showMessage('Funcionalidad de recuperación de contraseña - Próximamente', 'info');
  });
  */

  return container;
}