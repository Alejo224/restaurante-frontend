# 🍽️ Sistema de Gestión para Restaurante - Frontend

## 📋 Descripción
Frontend moderno para sistema de gestión de restaurantes desarrollado con **Vite + JavaScript vanilla + Bootstrap**. Interfaz responsive y user-friendly para clientes y administradores.

## 🏗️ Estructura del Proyecto

```
restaurante-frontend/
├── public/                 # Archivos públicos
├── src/
│   ├── assets/            # Recursos estáticos (imágenes, icons)
│   ├── modules/
│   │   ├── auth/          # Módulo de autenticación
│   │   │   ├── RegisterForm.js
│   │   │   ├── RegisterPage.js
│   │   │   └── userService.js
│   │   └── menu/          # Módulo de menú (futuro desarrollo)
│   ├── pages/             # Páginas principales
│   │   └── HomePage.js    # Landing page
│   ├── utils/             # Utilidades y helpers
│   │   └── counterparts/
│   ├── main.js            # Punto de entrada
│   ├── router.js          # Sistema de rutas
│   └── style.css          # Estilos globales
├── index.html             # HTML principal
├── package.json           # Dependencias y scripts
└── README.md              # Documentación
```

## 🛠️ Tecnologías Utilizadas

- **Vite** - Build tool y dev server
- **JavaScript ES6+** - Lógica de aplicación
- **Bootstrap 5** - Framework CSS
- **Bootstrap Icons** - Iconografía
- **Fetch API** - Comunicación con backend

## 📦 Instalación y Configuración

### Prerrequisitos
- Node.js 16+ 
- npm o yarn

### Pasos de instalación
```bash
# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## 🔌 Configuración API
El proyecto está configurado para conectarse con un backend Spring Boot. Configura la URL base en:

```javascript
// src/modules/auth/userService.js
const API_URL = 'http://localhost:8080/api';
```

## 🎨 Cómo Agregar Nuevas Funcionalidades

### 1. 🆕 Agregar un Nuevo Módulo

#### Estructura recomendada para nuevos módulos:
```
src/modules/
├── auth/              # Módulo existente
├── menu/              # Módulo existente (por desarrollar)
├── reservations/      # Ejemplo: nuevo módulo
│   ├── components/    # Componentes del módulo
│   ├── pages/         # Páginas del módulo  
│   ├── services/      # Servicios API del módulo
│   └── utils/         # Utilidades específicas del módulo
└── orders/            # Otro módulo ejemplo
```

#### Ejemplo: Crear módulo de Reservas

**Paso 1: Crear estructura del módulo**
```bash
src/modules/reservations/
├── components/
│   └── ReservationForm.js
├── pages/
│   └── ReservationPage.js
├── services/
│   └── reservationService.js
└── index.js           # Exportaciones del módulo
```

**Paso 2: Crear el componente del formulario**
```javascript
// src/modules/reservations/components/ReservationForm.js
export function ReservationForm() {
  const component = document.createElement('div');
  
  component.innerHTML = `
    <form id="reservationForm" class="p-4 shadow rounded-4 bg-white">
      <h3 class="mb-4 text-center text-primary">Reservar Mesa</h3>
      
      <div class="mb-3">
        <label for="fecha" class="form-label">Fecha</label>
        <input type="date" class="form-control" id="fecha" required>
      </div>
      
      <div class="mb-3">
        <label for="personas" class="form-label">Número de Personas</label>
        <select class="form-control" id="personas" required>
          <option value="">Seleccionar...</option>
          <option value="1">1 persona</option>
          <option value="2">2 personas</option>
          <option value="3">3 personas</option>
          <option value="4">4 personas</option>
          <option value="5">5+ personas</option>
        </select>
      </div>
      
      <button type="submit" class="btn btn-primary w-100">Reservar</button>
    </form>
  `;

  component.querySelector('#reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    // Lógica de reserva aquí
  });

  return component;
}
```

**Paso 3: Crear el servicio API**
```javascript
// src/modules/reservations/services/reservationService.js
const API_URL = 'http://localhost:8080/api/reservations';

export const reservationService = {
  async createReservation(reservationData) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reservationData)
      });
      
      if (!response.ok) throw new Error('Error al crear reserva');
      return await response.json();
    } catch (error) {
      console.error('Error en reservationService:', error);
      throw error;
    }
  },

  async getUserReservations(userId) {
    try {
      const response = await fetch(`${API_URL}/user/${userId}`);
      if (!response.ok) throw new Error('Error al obtener reservas');
      return await response.json();
    } catch (error) {
      console.error('Error en reservationService:', error);
      throw error;
    }
  }
};
```

**Paso 4: Crear la página del módulo**
```javascript
// src/modules/reservations/pages/ReservationPage.js
import { ReservationForm } from '../components/ReservationForm.js';
import { router } from '../../../../router.js';

export function ReservationPage() {
  const page = document.createElement('div');
  
  page.innerHTML = `
    <nav class="navbar navbar-dark bg-dark fixed-top">
      <div class="container">
        <a class="navbar-brand" href="#" id="homeLink">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias
        </a>
        <button class="btn btn-outline-light btn-sm" id="backBtn">
          <i class="bi bi-arrow-left me-1"></i>
          Volver
        </button>
      </div>
    </nav>
    
    <div style="height: 80px;"></div>
    
    <div class="container my-4">
      <div class="row justify-content-center">
        <div class="col-md-8 col-lg-6">
          <div id="reservation-container"></div>
        </div>
      </div>
    </div>
  `;

  // Agregar el formulario
  const container = page.querySelector('#reservation-container');
  container.appendChild(ReservationForm());

  // Event listeners
  page.querySelector('#homeLink').addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/');
  });

  page.querySelector('#backBtn').addEventListener('click', () => {
    window.history.back();
  });

  return page;
}
```

**Paso 5: Crear archivo index.js para exportaciones**
```javascript
// src/modules/reservations/index.js
export { ReservationPage } from './pages/ReservationPage.js';
export { ReservationForm } from './components/ReservationForm.js';
export { reservationService } from './services/reservationService.js';
```

**Paso 6: Registrar la ruta en main.js**
```javascript
// src/main.js
import { ReservationPage } from './modules/reservations/index.js';

// Agregar después de las rutas existentes
router.addRoute('/reservar', ReservationPage);
```

### 2. 🔄 Agregar Navegación entre Módulos

**Desde HomePage.js:**
```javascript
// Agregar en los event listeners
page.querySelector('#reserveBtn').addEventListener('click', () => {
  router.navigate('/reservar');
});
```

**Desde cualquier componente:**
```javascript
import { router } from '../../router.js';

button.addEventListener('click', () => {
  router.navigate('/reservar');
});
```

### 3. 🎯 Estructura para Módulo de Menú (Ejemplo)

```
src/modules/menu/
├── components/
│   ├── MenuList.js          # Lista de platos
│   ├── MenuItem.js          # Item individual del menú
│   └── CategoryFilter.js    # Filtro por categorías
├── pages/
│   ├── MenuPage.js          # Página principal del menú
│   └── CategoryPage.js      # Página por categoría
├── services/
│   └── menuService.js       # Servicios del menú
└── index.js
```

### 4. 📱 Mejores Prácticas para Nuevos Módulos

#### Convenciones de nombres:
- **Componentes**: PascalCase (`UserProfile.js`)
- **Servicios**: camelCase (`userService.js`) 
- **Páginas**: PascalCase + Page (`MenuPage.js`)
- **Utilidades**: camelCase descriptivo (`formatDate.js`)

#### Estructura de imports:
```javascript
// Importaciones relativas desde módulos
import { userService } from '../auth/userService.js';
import { router } from '../../../router.js';

// Importaciones de otros módulos
import { menuService } from '../../menu/services/menuService.js';
```

#### Manejo de estilos:
- Usar clases de Bootstrap primero
- Estilos específicos en `src/style.css`
- Prefijos para clases personalizadas: `.menu-`, `.reservation-`

### 5. 🔧 Configuración de Rutas Dinámicas

**Para rutas con parámetros:**
```javascript
// En el router.js, agregar manejo de parámetros
navigate(path) {
  this.currentRoute = path;
  this.render();
  window.history.pushState({}, '', path);
}

// Uso en componentes
router.navigate('/menu/categoria/ensaladas');
```

## 🎨 Personalización de Estilos

### Colores de la marca (en style.css):
```css
:root {
  --primary: #0d6efd;      /* Azul principal */
  --warning: #ffc107;      /* Amarillo/Naranja */
  --hero-blue: #667eea;    /* Azul gradiente */
  --hero-purple: #764ba2;  /* Morado gradiente */
  --success: #198754;      /* Verde */
  --dark: #343a40;         /* Gris oscuro */
}
```

### Estilos específicos por módulo:
```css
/* Estilos para módulo de reservas */
.reservation-card {
  border-left: 4px solid var(--primary);
  transition: transform 0.2s ease;
}

.reservation-card:hover {
  transform: translateY(-2px);
}

/* Estilos para módulo de menú */
.menu-item {
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.menu-item:hover {
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}
```

## 🚀 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo (http://localhost:5173)
npm run build    # Build para producción
npm run preview  # Preview del build de producción
```

## 🤝 Convenciones de Código

- **Módulos**: Agrupar por funcionalidad
- **Componentes**: Reutilizables y con responsabilidad única
- **Servicios**: Lógica de negocio y comunicación con API
- **Páginas**: Composiciones de componentes


### Para comenzar a desarrollar:
1. **Clona el repositorio**
2. **Instala dependencias**: `npm install`
3. **Ejecuta en desarrollo**: `npm run dev`
4. **Sigue la estructura de módulos existente**

### Al agregar nuevas funcionalidades:
1. Crea un nuevo módulo en `src/modules/`
2. Sigue la estructura de archivos establecida
3. Usa el sistema de rutas para navegación
4. Mantén consistencia en estilos
5. Prueba en diferentes dispositivos

### Estructura recomendada:
```
src/modules/tu-modulo/
├── components/     # Componentes UI
├── pages/          # Vistas/páginas  
├── services/       # Lógica de negocio y API
├── utils/          # Utilidades específicas
└── index.js        # Punto de entrada del módulo
```
