import { registerUser } from './userService.js';

export function RegisterForm() {
  const container = document.createElement('div');

  // cuerpo del formulario
  container.innerHTML = `
    <form id="registerForm" class="p-4 shadow-lg rounded-4 bg-white mt-5" style="max-width: 420px; margin:auto;">
      <h3 class="mb-4 text-center text-primary fw-bold">Registro de Usuario</h3>

      <!-- Nombre completo -->
      <div class="mb-3">
        <label for="nombreCompleto" class="form-label fw-semibold">Nombre Completo *</label>
        <input 
          type="text" 
          class="form-control" 
          id="nombreCompleto" 
          name="nombreCompleto" 
          placeholder="Mario Montoya Torres" 
          required
        />
        <div class="invalid-feedback" id="nombreError"></div>
      </div>

      <!-- Correo electrónico -->
      <div class="mb-3">
        <label for="email" class="form-label fw-semibold">Correo Electrónico *</label>
        <input 
          type="email" 
          class="form-control" 
          id="email" 
          name="email" 
          placeholder="correo@ejemplo.com" 
          required
        />
        <div class="invalid-feedback" id="emailError"></div>
      </div>

      <!-- Teléfono -->
      <div class="mb-3">
        <label for="telefono" class="form-label fw-semibold">Teléfono *</label>
        <input 
          type="tel" 
          class="form-control" 
          id="telefono" 
          name="telefono" 
          placeholder="38229837410" 
          pattern="[0-9]{7,15}"
          title="Solo se permiten números (7 a 15 dígitos)"
          required
        />
        <div class="invalid-feedback" id="telefonoError"></div>
      </div>

      <!-- Contraseña -->
      <div class="mb-3">
        <label for="password" class="form-label fw-semibold">Contraseña *</label>
        <input 
          type="password" 
          class="form-control" 
          id="password" 
          name="password"
          placeholder="Mínimo 8 caracteres"
          title="Debe tener al menos una mayúscula, una minúscula, un número y un carácter especial ( !#$%&()*^?/@+=<>_-~{} ), y mínimo 8 caracteres"
          required
        />
        <div class="invalid-feedback" id="passwordError"></div>
      </div>

      <!-- Confirmar contraseña -->
      <div class="mb-3">
        <label for="confirmPassword" class="form-label fw-semibold">Confirmar Contraseña *</label>
        <input 
          type="password" 
          class="form-control" 
          id="confirmPassword" 
          name="confirmPassword" 
          placeholder="Repite tu contraseña" 
          required
        />
        <div class="invalid-feedback" id="confirmPasswordError"></div>
      </div>

      <!-- Botón de registro -->
      <div class="d-grid mb-3">
        <button type="submit" class="btn btn-primary" id="submitBtn">
          <i class="bi bi-person-plus-fill me-2"></i>Registrarse
        </button>
      </div>

      <!-- Link para el login-->
      <div class="mb-3">
        <small class="text-muted">
        ¿Ya tienes una cuenta? <a href="#" id="loginLink">Inicia sesión</a>
        </small>
      </div>

      <!-- Mensajes generales -->
      <div id="messageContainer" class="mt-3 text-center"></div>
  </form>
    
  `;

  const form = container.querySelector('#registerForm');
  const submitBtn = container.querySelector('#submitBtn');
  const messageContainer = container.querySelector('#messageContainer');

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
  }

  // Función para mostrar error en un campo específico
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
        Registrando...
      `;
    } else {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Registrarse';
    }
  }

  // Evento del formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    console.log('Iniciando envío de formulario...');
    clearErrors(); // Limpiar errores anteriores

    const data = {
      nombreCompleto: form.nombreCompleto.value.trim(),
      email: form.email.value.trim(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
      telefono: form.telefono.value.trim()
    };
    
    console.log('Datos a enviar:', data);

    // Validación básica del frontend
    if (data.password !== data.confirmPassword) {
      showFieldError('password', 'Las contraseñas no coinciden');
      showFieldError('confirmPassword', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      console.log('Enviando datos a la API...');
      const response = await registerUser(data);
      
      console.log('✅ Registro exitoso:', response);
      showMessage(`¡Registro exitoso! Bienvenido ${response.nombreCompleto || data.nombreCompleto}`, 'success');
      
      form.reset();
      
      // Redirigir después de éxito
      setTimeout(() => {
        // router.navigate('/login'); // Cuando tengas login
        console.log('Redirigiendo...');
      }, 2000);
      
    // En el catch del RegisterForm.js - ACTUALIZA ESTA PARTE:
} catch (error) {
    console.error('❌ Error en el registro:', error);
    
    // Limpiar errores anteriores
    clearErrors();
    
    // CASO 1: Error con campos específicos (JSON con estructura de validación)
    if (error.fields && typeof error.fields === 'object') {
      console.log('Mostrando errores por campo:', error.fields);
      
      // Mapear nombres de campos del backend al frontend
      Object.entries(error.fields).forEach(([field, message]) => {
        const fieldMap = {
          'password': 'password',
          'confirmPassword': 'confirmPassword', 
          'email': 'email',
          'nombreCompleto': 'nombreCompleto',
          'telefono': 'telefono',
          'confirmarPassword': 'confirmPassword' // por si acaso
        };
        
        const fieldId = fieldMap[field] || field;
        showFieldError(fieldId, message);
      });
      
      // Mostrar mensaje general si existe
      if (error.message && error.message !== 'Error desconocido en el registro') {
        showMessage(error.message, 'danger');
      }
    } 
    // CASO 2: Error en texto plano (como "El email ya está registrado")
    else {
      console.log('Mostrando error simple:', error.message);
      
      const errorMessage = error.message;
      
      // Detectar automáticamente el campo del error
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
        // Mostrar error general
        showMessage(errorMessage, 'danger');
      }
    }
  } finally {
      setLoading(false);
    }
  });

  return container;
}


