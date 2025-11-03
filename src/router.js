 // src/router.js
// Router simple para manejar rutas y protección de rutas
// Incluye verificación de autenticación y roles
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = '';
  }

  addRoute(path, component) {
    this.routes[path] = component;
  }

  navigate(path) {
    // Verificar rutas protegidas
    if (this.isProtectedRoute(path) && !this.isAuthenticated()) {
      console.log('🔒 Ruta protegida, redirigiendo al login...');
      this.redirectToLogin();
      return;
    }

    // Verificar rutas de admin
    if (this.isAdminRoute(path) && !this.isAdmin()) {
      console.log('🚫 Acceso denegado, no tienes permisos de admin');
      this.redirectToHome();
      return;
    }

    this.currentRoute = path;
    this.render();
    window.location.hash = path;
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    const component = this.routes[this.currentRoute];
    if (component) {
      app.appendChild(component());
    }
  }

  // NUEVAS FUNCIONES DE PROTECCIÓN
  isAuthenticated() {
    const userData = localStorage.getItem('usuario');
    return userData !== null;
  }

  isAdmin() {
    const userData = localStorage.getItem('usuario');
    if (!userData) return false;
    
    try {
      const user = JSON.parse(userData);
      return user.roles && user.roles.some(role => role.roleEnum === 'ADMIN');
    } catch {
      return false;
    }
  }

  isProtectedRoute(path) {
    const protectedRoutes = ['/dashboard', '/admin', '/profile', '/menu'];
    return protectedRoutes.some(route => path.startsWith(route));
  }

  isAdminRoute(path) {
    return path.startsWith('/admin');
  }

  redirectToLogin() {
    window.location.hash = '/login';
    this.currentRoute = '/login';
    this.render();
  }

  redirectToHome() {
    window.location.hash = '/';
    this.currentRoute = '/';
    this.render();
  }

  init() {
    // Manejar cambios en el hash para GitHub Pages
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || '/';
      this.currentRoute = hash;
      this.render();
    };

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('load', handleHashChange);
    handleHashChange();
  }
}

export const router = new Router();