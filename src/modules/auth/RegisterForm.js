import { registerUser, isUser } from './userService.js';
import { router } from '../../router.js';
import { LoginForm } from  '../auth/LoginForm.js';

export function RegisterForm() {
  const container = document.createElement('div');
  container.setAttribute('role', 'main');
  container.setAttribute('aria-label', 'Formulario de registro de cuenta');

  container.innerHTML = `
    <form id="registerForm" class="p-4 shadow-lg rounded-4 bg-white form-card-hover" 
          aria-labelledby="registerHeading" novalidate>
      
      <!-- Header consistente con el login -->
      <div class="text-center mb-4">
        <i class="bi bi-egg-fried display-4 text-primary mb-3" aria-hidden="true"></i>
        <h3 id="registerHeading" class="text-dark fw-bold">Únete a Nuestra Comunidad</h3>
        <p class="text-muted">Crea tu cuenta y descubre experiencias exclusivas</p>
      </div>

      <!-- Nombre completo -->
      <div class="mb-3">
        <label for="nombreCompleto" class="form-label fw-semibold text-dark">
          Nombre Completo <span class="text-danger" aria-hidden="true">*</span>
          <span class="visually-hidden">campo requerido</span>
        </label>
        <input 
          type="text" 
          class="form-control form-control-lg" 
          id="nombreCompleto" 
          name="nombreCompleto" 
          placeholder="Mario Montoya Torres" 
          required
          aria-required="true"
          aria-describedby="nombreHelp nombreError"
          autocomplete="name"
        />
        <div id="nombreHelp" class="form-text visually-hidden">
          Ingresa tu nombre completo como aparece en tu identificación
        </div>
        <div class="invalid-feedback" id="nombreError" role="alert" aria-live="polite"></div>
      </div>

      <!-- Correo electrónico -->
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
          Ingresa tu dirección de correo electrónico válida
        </div>
        <div class="invalid-feedback" id="emailError" role="alert" aria-live="polite"></div>
      </div>

      <!-- Teléfono -->
      <div class="mb-3">
        <label for="telefono" class="form-label fw-semibold text-dark">
          Teléfono <span class="text-danger" aria-hidden="true">*</span>
          <span class="visually-hidden">campo requerido</span>
        </label>
        <input 
          type="tel" 
          class="form-control form-control-lg" 
          id="telefono" 
          name="telefono" 
          placeholder="38229837410" 
          pattern="[0-9]{7,15}"
          title="Solo se permiten números (7 a 15 dígitos)"
          required
          aria-required="true"
          aria-describedby="telefonoHelp telefonoError"
          autocomplete="tel"
        />
        <div id="telefonoHelp" class="form-text">
          Solo se permiten números (7 a 15 dígitos)
        </div>
        <div class="invalid-feedback" id="telefonoError" role="alert" aria-live="polite"></div>
      </div>

      <!-- Contraseña -->
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
            placeholder="Mínimo 8 caracteres"
            title="Debe tener al menos una mayúscula, una minúscula, un número y un carácter especial ( !#$%&()*^?/@+=<>_-~{} ), y mínimo 8 caracteres"
            required
            aria-required="true"
            aria-describedby="passwordHelp passwordError passwordRequirements"
            autocomplete="new-password"
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
        <div id="passwordHelp" class="form-text">
          Mínimo 8 caracteres con mayúscula, minúscula, número y carácter especial
        </div>
        <div id="passwordRequirements" class="visually-hidden">
          La contraseña debe tener al menos una letra mayúscula, una minúscula, un número y un carácter especial como ! # $ % & ( ) * ^ ? / @ + = &lt; &gt; _ - ~ { }
        </div>
        <div class="invalid-feedback" id="passwordError" role="alert" aria-live="polite"></div>
      </div>

      <!-- Confirmar contraseña -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label fw-semibold text-dark">
          Confirmar Contraseña <span class="text-danger" aria-hidden="true">*</span>
          <span class="visually-hidden">campo requerido</span>
        </label>
        <div class="input-group">
          <input 
            type="password" 
            class="form-control form-control-lg" 
            id="confirmPassword" 
            name="confirmPassword" 
            placeholder="Repite tu contraseña" 
            required
            aria-required="true"
            aria-describedby="confirmPasswordHelp confirmPasswordError"
            autocomplete="new-password"
          />
          <button 
            type="button" 
            class="btn btn-outline-secondary" 
            id="toggleConfirmPassword"
            aria-label="Mostrar confirmación de contraseña"
            aria-pressed="false"
            tabindex="0"
          >
            <i class="bi bi-eye" aria-hidden="true"></i>
          </button>
        </div>
        <div id="confirmPasswordHelp" class="form-text visually-hidden">
          Repite la misma contraseña para confirmar
        </div>
        <div class="invalid-feedback" id="confirmPasswordError" role="alert" aria-live="polite"></div>
      </div>

      <!-- Botón de registro -->
      <div class="d-grid mb-3">
        <button 
          type="submit" 
          class="btn btn-primary btn-lg py-3 fw-bold" 
          id="submitBtn"
          aria-label="Crear nueva cuenta"
        >
          <i class="bi bi-person-plus-fill me-2" aria-hidden="true"></i>
          Crear Cuenta
        </button>
      </div>

      <!-- Link para el login -->
      <div class="text-center mb-3">
        <small class="text-muted">
          ¿Ya tienes una cuenta? 
          <a href="#" id="loginLink" class="text-primary text-decoration-none fw-semibold" 
             aria-label="Iniciar sesión con cuenta existente">
            Inicia sesión
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
      
      .form-text {
        color: #6c757d;
        font-size: 0.875rem;
      }
      
      /* Alto contraste */
      @media (prefers-contrast: high) {
        .form-control {
          border: 2px solid #000;
        }
        
        .btn {
          border: 2px solid currentColor;
        }
        
        .text-muted, .form-text {
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

  const form = container.querySelector('#registerForm');
  const submitBtn = container.querySelector('#submitBtn');
  const messageContainer = container.querySelector('#messageContainer');
  const formStatus = container.querySelector('#formStatus');

  // Inicializar funcionalidad de accesibilidad
  function initializeAccessibility() {
    // Enfocar el primer campo al cargar
    const nombreInput = container.querySelector('#nombreCompleto');
    if (nombreInput) {
      setTimeout(() => nombreInput.focus(), 100);
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
        }
      });
      
      togglePassword.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.click();
        }
      });
    }
    
    // Toggle de visibilidad de confirmación de contraseña
    const toggleConfirmPassword = container.querySelector('#toggleConfirmPassword');
    const confirmPasswordInput = container.querySelector('#confirmPassword');
    
    if (toggleConfirmPassword && confirmPasswordInput) {
      toggleConfirmPassword.addEventListener('click', function() {
        const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        confirmPasswordInput.setAttribute('type', type);
        
        const isPressed = type === 'text';
        this.setAttribute('aria-pressed', isPressed);
        this.setAttribute('aria-label', isPressed ? 'Ocultar confirmación de contraseña' : 'Mostrar confirmación de contraseña');
        
        // Cambiar icono
        const icon = this.querySelector('i');
        if (icon) {
          icon.className = isPressed ? 'bi bi-eye-slash' : 'bi bi-eye';
        }
      });
      
      toggleConfirmPassword.addEventListener('keydown', function(e) {
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

  // Función para limpiar errores anteriores
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

  // Función para mostrar error en un campo específico
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
        Registrando...
      `;
      announceFormStatus('Procesando registro, por favor espere...');
    } else {
      submitBtn.disabled = false;
      submitBtn.setAttribute('aria-busy', 'false');
      submitBtn.innerHTML = `
        <i class="bi bi-person-plus-fill me-2" aria-hidden="true"></i>
        Crear Cuenta
      `;
    }
  }

  // Validación del formulario
  function validateForm(data) {
    let isValid = true;
    
    // Validar nombre completo
    if (!data.nombreCompleto || data.nombreCompleto.trim().length < 2) {
      showFieldError('nombreCompleto', 'Por favor ingresa tu nombre completo');
      isValid = false;
    }
    
    // Validar email
    if (!data.email || !data.email.includes('@') || !data.email.includes('.')) {
      showFieldError('email', 'Por favor ingresa un correo electrónico válido');
      isValid = false;
    }
    
    // Validar teléfono
    if (!data.telefono || !/^\d{7,15}$/.test(data.telefono)) {
      showFieldError('telefono', 'El teléfono debe contener solo números (7 a 15 dígitos)');
      isValid = false;
    }
    
    // Validar contraseñas
    if (!data.password) {
      showFieldError('password', 'Por favor ingresa una contraseña');
      isValid = false;
    } else if (data.password.length < 8) {
      showFieldError('password', 'La contraseña debe tener al menos 8 caracteres');
      isValid = false;
    }
    
    if (!data.confirmPassword) {
      showFieldError('confirmPassword', 'Por favor confirma tu contraseña');
      isValid = false;
    } else if (data.password !== data.confirmPassword) {
      showFieldError('password', 'Las contraseñas no coinciden');
      showFieldError('confirmPassword', 'Las contraseñas no coinciden');
      showMessage('Por favor corrige los errores en el formulario', 'warning');
      isValid = false;
    }
    
    return isValid;
  }

  // Evento del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('📤 Iniciando envío de formulario...');
    clearErrors();
    announceFormStatus('Validando formulario de registro');

    const data = {
      nombreCompleto: form.nombreCompleto.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
      telefono: form.telefono.value.trim()
    };
    
    console.log('📝 Datos a enviar:', data);

    // Validación básica del frontend
    if (!validateForm(data)) {
      announceFormStatus('Errores de validación encontrados. Por favor corrige los campos marcados.');
      return;
    }

    setLoading(true);

    try {
      console.log('🔄 Enviando datos a la API...');
      announceFormStatus('Registrando cuenta...');
      
      const response = await registerUser(data);
      
      console.log('✅ Registro exitoso:', response);
      announceFormStatus('Registro exitoso');
      
      showMessage(`¡Registro exitoso! Bienvenido ${response.nombreCompleto || data.nombreCompleto}`, 'success');
      
      form.reset();
      
      // Redirigir después de éxito
      setTimeout(() => {
        announceFormStatus('Redirigiendo al dashboard...');
        
        // Para verificar si es un usuario con rol de cliente (USER) para ingresar al menu
        if (isUser()){
          router.navigate('/dashboard');
        } else {
          showMessage('No se pudo redirigir automáticamente. Por favor, inicia sesión.', 'warning');
        }
        
      }, 2000);
      
    } catch (error) {
      console.error('❌ Error en el registro:', error);
      announceFormStatus(`Error en el registro: ${error.message}`);
      
      clearErrors();
      
      // Manejo de errores por campo
      if (error.fields && typeof error.fields === 'object') {
        console.log('📝 Mostrando errores por campo:', error.fields);
        
        Object.entries(error.fields).forEach(([field, message]) => {
          const fieldMap = {
            'password': 'password',
            'confirmPassword': 'confirmPassword', 
            'email': 'email',
            'nombreCompleto': 'nombreCompleto',
            'telefono': 'telefono',
            'confirmarPassword': 'confirmPassword'
          };
          
          const fieldId = fieldMap[field] || field;
          showFieldError(fieldId, message);
        });
        
        if (error.message && error.message !== 'Error desconocido en el registro') {
          showMessage(error.message, 'danger');
        }
      } else {
        console.log('📝 Mostrando error simple:', error.message);
        
        const errorMessage = error.message;
        
        if (errorMessage.includes('email') || errorMessage.toLowerCase().includes('correo')) {
          showFieldError('email', errorMessage);
          showMessage(errorMessage, 'danger');
        } else if (errorMessage.includes('contraseña') || errorMessage.includes('password')) {
          showFieldError('password', errorMessage);
          showMessage(errorMessage, 'danger');
        } else if (errorMessage.includes('confirmar') || errorMessage.includes('confirm')) {
          showFieldError('confirmPassword', errorMessage);
          showMessage(errorMessage, 'danger');
        } else if (errorMessage.includes('nombre')) {
          showFieldError('nombreCompleto', errorMessage);
          showMessage(errorMessage, 'danger');
        } else if (errorMessage.includes('teléfono') || errorMessage.includes('telefono')) {
          showFieldError('telefono', errorMessage);
          showMessage(errorMessage, 'danger');
        } else {
          showMessage(errorMessage, 'danger');
        }
      }
    } finally {
      setLoading(false);
    }
  });

  // Event listener para el link de login
  container.querySelector('#loginLink').addEventListener('click', (e) => {
    e.preventDefault();
    announceFormStatus('Navegando al formulario de inicio de sesión');
    router.navigate('/login');
  });

  // Inicializar accesibilidad después de que el DOM esté listo
  setTimeout(initializeAccessibility, 0);

  return container;
}