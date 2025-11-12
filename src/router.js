// src/router.js
// Router con protección de rutas basado en JWT
import { isAuthenticated, isAdmin, getCurrentUser } from './modules/auth/userService.js';
import { ReservaMesaPagina } from './modules/reservas-mesas/HacerReservaPage.js'

class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = '';
  }

  /**
   * Registra una ruta con su componente y opciones de seguridad
   * @param {string} path - Ruta de la página
   * @param {Function} component - Componente a renderizar
   * @param {Object} options - Opciones de seguridad
   * @param {boolean} options.requiresAuth - Requiere autenticación
   * @param {string} options.requiresRole - Requiere rol específico (ADMIN, USER)
   */
  addRoute(path, component, options = {}) {
    this.routes[path] = {
      component,
      requiresAuth: options.requiresAuth || false,
      requiresRole: options.requiresRole || null,
      afterRender: options.afterRender || null // ✅ NUEVO: Soporte para afterRender
    };
  }

  /**
   * Navega a una ruta específica
   * @param {string} path - Ruta destino
   */
  async navigate(path) { // ✅ CAMBIAR a async
    const route = this.routes[path];

    // Si la ruta no existe, redirigir al home
    if (!route) {
      console.warn(`⚠️ Ruta no encontrada: ${path}`);
      this.redirectToHome();
      return;
    }

    // 1. Verificar si requiere autenticación
    if (route.requiresAuth && !isAuthenticated()) {
      console.log('🔒 Ruta protegida, redirigiendo al login...');
      this.redirectToLogin();
      return;
    }

    // 2. Verificar si requiere un rol específico
    if (route.requiresRole) {
      const user = getCurrentUser();
      
      if (!user) {
        console.log('🔒 No hay usuario autenticado, redirigiendo al login...');
        this.redirectToLogin();
        return;
      }

      // Verificar si el usuario tiene el rol requerido
      const hasRequiredRole = user.roles && user.roles.includes(route.requiresRole);
      
      if (!hasRequiredRole) {
        console.log(`🚫 Acceso denegado: Se requiere rol ${route.requiresRole}`);
        console.log(`👤 Roles del usuario:`, user.roles);
        this.showAccessDenied();
        return;
      }
    }

    // 3. Si pasa todas las validaciones, renderizar la ruta
    this.currentRoute = path;
    await this.render(); // ✅ CAMBIAR a await
    window.location.hash = path;
  }

  /**
   * Renderiza el componente de la ruta actual
   */
  async render() { // ✅ CAMBIAR a async
    const app = document.getElementById('app');
    app.innerHTML = '';

    const route = this.routes[this.currentRoute];
    
    if (route && route.component) {
      const componentElement = route.component();
      
      // Si el componente es un elemento del DOM, lo agregamos directamente
      if (componentElement instanceof HTMLElement) {
        app.appendChild(componentElement);
      } else {
        // Si es un string HTML, lo insertamos como innerHTML
        app.innerHTML = componentElement;
      }

      // ✅ NUEVO: Ejecutar afterRender si existe
      if (route.afterRender && typeof route.afterRender === 'function') {
        console.log('🚀 Ejecutando afterRender para:', this.currentRoute);
        await route.afterRender();
      }
    } else {
      // Ruta no encontrada
      app.innerHTML = `
        <div class="container mt-5">
          <div class="alert alert-warning text-center">
            <h4>404 - Página no encontrada</h4>
            <p>La ruta <code>${this.currentRoute}</code> no existe.</p>
            <a href="#/" class="btn btn-primary">Volver al inicio</a>
          </div>
        </div>
      `;
    }
  }

  /**
   * Muestra página de acceso denegado
   */
  showAccessDenied() {
    const app = document.getElementById('app');
    const user = getCurrentUser();
    
    app.innerHTML = `
      <div class="container mt-5">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="card shadow border-danger">
              <div class="card-header bg-danger text-white">
                <h4 class="mb-0">
                  <i class="bi bi-shield-exclamation me-2"></i>
                  Acceso Denegado
                </h4>
              </div>
              <div class="card-body text-center py-5">
                <i class="bi bi-lock-fill display-1 text-danger mb-4"></i>
                <h5 class="mb-3">No tienes permisos para acceder a esta sección</h5>
                <p class="text-muted mb-4">
                  Tu rol actual (${user?.roles?.join(', ') || 'Sin rol'}) 
                  no tiene los permisos necesarios para ver este contenido.
                </p>
                <div class="d-grid gap-2 d-md-flex justify-content-md-center">
                  <a href="#/" class="btn btn-primary">
                    <i class="bi bi-house-door me-2"></i>
                    Volver al inicio
                  </a>
                  ${!isAdmin() ? `
                    <a href="#/menu" class="btn btn-outline-primary">
                      <i class="bi bi-card-list me-2"></i>
                      Ver menú
                    </a>
                  ` : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Redirige al login
   */
  redirectToLogin() {
    window.location.hash = '/login';
    this.currentRoute = '/login';
    this.render();
  }

  /**
   * Redirige al home
   */
  redirectToHome() {
    window.location.hash = '/';
    this.currentRoute = '/';
    this.render();
  }

  /**
   * Inicializa el router
   */
  init() {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      
      // Prevenir navegación si ya estamos en la ruta
      if (this.currentRoute === hash) {
        return;
      }
      
      this.navigate(hash);
    };

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    // Manejar carga inicial
    window.addEventListener('load', handleHashChange);
    
    // Ejecutar al iniciar
    handleHashChange();
  }
}

export const router = new Router();