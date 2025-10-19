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
    // Usar hash en lugar de history API para GitHub Pages
    window.location.hash = path;
  }

  render() {
   /* const app = document.getElementById('app');
    app.innerHTML = '';
    
    const component = this.routes[this.currentRoute];
    if (component) {
      app.appendChild(component());
    }*/
   // Dejamos la funcion render vacia o solo para debug
    console.log('Router: Navegacion a', this.currentRoute, 'intercepatda. usando logica de style.display');
  }

  init() {
    // Manejar cambios en el hash para GitHub Pages
    const handleHashChange = () => {
      // Obtener el hash sin el #, o usar '/' por defecto
      const hash = window.location.hash.slice(1) || '/';
      this.currentRoute = hash;
      this.render();
    };

    // Escuchar cambios en el hash
    window.addEventListener('hashchange', handleHashChange);
    
    // Manejar carga inicial
    window.addEventListener('load', handleHashChange);
    
    // También ejecutar al inicializar
    handleHashChange();
  }
}

export const router = new Router();