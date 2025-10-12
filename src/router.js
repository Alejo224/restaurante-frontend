// src/router.js
class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = '';
  }

  addRoute(path, component) {
    this.routes[path] = component;
  }

  navigate(path) {
    this.currentRoute = path;
    this.render();
    // Actualizar URL sin recargar la página
    window.history.pushState({}, '', path);
  }

  render() {
    const app = document.getElementById('app');
    app.innerHTML = '';
    
    const component = this.routes[this.currentRoute];
    if (component) {
      app.appendChild(component());
    }
  }

  init() {
    // Manejar el botón de retroceso
    window.addEventListener('popstate', () => {
      this.currentRoute = window.location.pathname;
      this.render();
    });

    // Ruta inicial
    this.currentRoute = window.location.pathname || '/';
    this.render();
  }
}

export const router = new Router();