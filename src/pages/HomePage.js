import { router } from "../router.js";
import { isAuthenticated, isAdmin, getCurrentUser } from "../modules/auth/userService.js";

export function HomePage() {
  const page = document.createElement('div');
  
  // Obtener información del usuario
  const authenticated = isAuthenticated();
  const user = authenticated ? getCurrentUser() : null;
  const userName = user?.email?.split('@')[0] || 'Usuario';
  const isAdminUser = isAdmin();
  
  page.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias
        </a>
        <div class="navbar-nav ms-auto">
          ${authenticated ? `
            <!-- Usuario autenticado -->
            <span class="navbar-text text-light me-3">
              <i class="bi bi-person-circle me-1"></i>
              ¡Hola, ${userName}!
              ${isAdminUser ? '<span class="badge bg-warning text-dark ms-1">Admin</span>' : ''}
            </span>
            <button class="btn btn-outline-warning" id="logoutBtn">
              <i class="bi bi-box-arrow-right me-1"></i>
              Cerrar Sesión
            </button>
          ` : `
            <!-- Usuario NO autenticado -->
            <button class="btn btn-outline-light me-2" id="loginBtn">
              <i class="bi bi-box-arrow-in-right me-1"></i>
              Iniciar Sesión
            </button>
            <button class="btn btn-primary" id="registerBtn">
              <i class="bi bi-person-plus me-1"></i>
              Crear Cuenta
            </button>
          `}
        </div>
      </div>
    </nav>

    <!-- Hero Section MEJORADA -->
    <section class="hero-section py-5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 80vh; display: flex; align-items: center;">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-white mb-4" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
              ${authenticated 
                ? `¡Bienvenido de nuevo, ${userName}!` 
                : 'Bienvenido a una experiencia gastronómica exclusiva'
              }
            </h1>
            <p class="lead text-white mb-4" style="font-size: 1.25rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
              ${authenticated 
                ? 'Explora nuestro menú completo, haz tus pedidos y disfruta de beneficios exclusivos para clientes registrados.' 
                : 'Descubre nuestro menú secreto, realiza reservas personalizadas y disfruta de beneficios especiales. Todo esto te espera al crear tu cuenta.'
              }
            </p>
            <div class="d-flex gap-3 flex-wrap">
              ${authenticated ? `
                <!-- Botones para usuario autenticado -->
                <button class="btn btn-warning btn-lg px-4 fw-bold" id="viewMenuBtn" style="min-width: 200px;">
                  <i class="bi bi-card-list me-2"></i>
                  Ver Menú Completo
                </button>
                ${isAdminUser ? `
                  <button class="btn btn-outline-light btn-lg px-4" id="adminPanelBtn" style="min-width: 200px;">
                    <i class="bi bi-speedometer2 me-2"></i>
                    Panel Admin
                  </button>
                ` : `
                  <button class="btn btn-outline-light btn-lg px-4" id="myOrdersBtn" style="min-width: 200px;">
                    <i class="bi bi-bag-check me-2"></i>
                    Mis Pedidos
                  </button>
                `}
              ` : `
                <!-- Botones para usuario NO autenticado -->
                <button class="btn btn-warning btn-lg px-4 fw-bold" id="heroRegisterBtn" style="min-width: 200px;">
                  <i class="bi bi-rocket-takeoff me-2"></i>
                  Descubrir Menú
                </button>
                <button class="btn btn-outline-light btn-lg px-4" id="learnMoreBtn" style="min-width: 200px;">
                  <i class="bi bi-info-circle me-2"></i>
                  Conocer Más
                </button>
              `}
            </div>
          </div>
          <div class="col-lg-6">
            <div class="text-center">
              <div class="hero-image rounded-3 p-5" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                ${authenticated ? `
                  <i class="bi bi-check-circle display-1 text-success mb-3"></i>
                  <h4 class="text-white mt-3" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Acceso Completo</h4>
                  <p class="text-light">Disfruta de todas nuestras funcionalidades</p>
                ` : `
                  <i class="bi bi-lock display-1 text-warning mb-3"></i>
                  <h4 class="text-white mt-3" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Acceso Exclusivo</h4>
                  <p class="text-light">Regístrate para desbloquear todas las funcionalidades</p>
                `}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">${authenticated ? 'Tus beneficios activos' : 'Desbloquea estas ventajas al registrarte'}</h2>
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm ${authenticated ? 'border-success' : ''}">
              <div class="card-body">
                ${authenticated ? '<i class="bi bi-check-circle-fill text-success position-absolute top-0 end-0 m-3"></i>' : ''}
                <i class="bi bi-book display-4 text-primary mb-3"></i>
                <h5 class="card-title text-dark">Menú Completo</h5>
                <p class="card-text text-muted">
                  ${authenticated 
                    ? 'Ya tienes acceso a nuestra carta completa con fotos, descripciones y precios' 
                    : 'Accede a nuestra carta completa con fotos, descripciones y precios'
                  }
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm ${authenticated ? 'border-success' : ''}">
              <div class="card-body">
                ${authenticated ? '<i class="bi bi-check-circle-fill text-success position-absolute top-0 end-0 m-3"></i>' : ''}
                <i class="bi bi-calendar-check display-4 text-success mb-3"></i>
                <h5 class="card-title text-dark">Reservas Online</h5>
                <p class="card-text text-muted">
                  ${authenticated 
                    ? 'Reserva tu mesa favorita en segundos, sin llamadas' 
                    : 'Reserva tu mesa favorita en segundos, sin llamadas'
                  }
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm ${authenticated ? 'border-success' : ''}">
              <div class="card-body">
                ${authenticated ? '<i class="bi bi-check-circle-fill text-success position-absolute top-0 end-0 m-3"></i>' : ''}
                <i class="bi bi-gift display-4 text-warning mb-3"></i>
                <h5 class="card-title text-dark">Beneficios Exclusivos</h5>
                <p class="card-text text-muted">
                  ${authenticated 
                    ? 'Disfruta de descuentos, promociones especiales y acumulación de puntos' 
                    : 'Descuentos, promociones especiales y acumulación de puntos'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Preview Section (solo si NO está autenticado) -->
    ${!authenticated ? `
      <section class="py-5">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <h2 class="fw-bold mb-4">Una muestra de lo que te espera</h2>
              <div class="preview-item mb-4 p-3 bg-white rounded shadow-sm">
                <div class="d-flex align-items-center">
                  <i class="bi bi-egg-fried text-warning display-6 me-3"></i>
                  <div>
                    <h5 class="text-dark mb-1">Platos Exclusivos</h5>
                    <p class="text-muted mb-0">Recetas únicas creadas por nuestro chef</p>
                  </div>
                </div>
              </div>
              <div class="preview-item mb-4 p-3 bg-white rounded shadow-sm">
                <div class="d-flex align-items-center">
                  <i class="bi bi-cup-straw text-success display-6 me-3"></i>
                  <div>
                    <h5 class="text-dark mb-1">Bebidas Artesanales</h5>
                    <p class="text-muted mb-0">Cócteles y bebidas preparadas con ingredientes frescos</p>
                  </div>
                </div>
              </div>
              <div class="preview-item mb-4 p-3 bg-white rounded shadow-sm">
                <div class="d-flex align-items-center">
                  <i class="bi bi-basket text-primary display-6 me-3"></i>
                  <div>
                    <h5 class="text-dark mb-1">Pedidos a Domicilio</h5>
                    <p class="text-muted mb-0">Disfruta nuestra comida en la comodidad de tu hogar</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <div class="text-center">
                <div class="access-teaser bg-dark text-white rounded-3 p-5">
                  <i class="bi bi-lock-fill display-1 text-warning mb-3"></i>
                  <h4 class="mb-3">Contenido Exclusivo</h4>
                  <p class="mb-4">Regístrate o inicia sesión para desbloquear el menú completo y todas las funcionalidades</p>
                  <div class="d-grid gap-2">
                    <button class="btn btn-warning btn-lg" id="previewRegisterBtn">
                      <i class="bi bi-person-plus me-2"></i>
                      Crear Cuenta Gratis
                    </button>
                    <button class="btn btn-outline-light" id="previewLoginBtn">
                      ¿Ya tienes cuenta? Inicia Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Testimonials -->
    <section class="py-5 bg-dark text-white">
      <div class="container">
        <h2 class="text-center mb-5">Lo que dicen nuestros clientes</h2>
        <div class="row">
          <div class="col-md-4 mb-4">
            <div class="card bg-secondary border-0 h-100">
              <div class="card-body">
                <div class="text-warning mb-3">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                </div>
                <p class="card-text">"Una vez que te registras, descubres un mundo de opciones increíbles. Vale totalmente la pena."</p>
                <footer class="blockquote-footer text-light mt-3">
                  <strong>María González</strong>
                </footer>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card bg-secondary border-0 h-100">
              <div class="card-body">
                <div class="text-warning mb-3">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-half"></i>
                </div>
                <p class="card-text">"El sistema de reservas online es super práctico. Crear la cuenta fue rápido y ahora reservo en segundos."</p>
                <footer class="blockquote-footer text-light mt-3">
                  <strong>Carlos Rodríguez</strong>
                </footer>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card bg-secondary border-0 h-100">
              <div class="card-body">
                <div class="text-warning mb-3">
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                  <i class="bi bi-star-fill"></i>
                </div>
                <p class="card-text">"Los beneficios para clientes registrados son geniales. Descuentos y promociones que no encuentras en otro lugar."</p>
                <footer class="blockquote-footer text-light mt-3">
                  <strong>Ana Martínez</strong>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA Section -->
    <section class="py-5 bg-warning">
      <div class="container text-center">
        <h2 class="mb-3">${authenticated ? '¿Qué te gustaría hacer?' : '¿Listo para descubrir el menú completo?'}</h2>
        <p class="lead mb-4">
          ${authenticated 
            ? 'Explora nuestro menú o gestiona tu cuenta' 
            : 'Únete a nuestra comunidad gastronómica y desbloquea todas las funcionalidades'
          }
        </p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          ${authenticated ? `
            <button class="btn btn-dark btn-lg px-5" id="finalMenuBtn" style="min-width: 220px;">
              <i class="bi bi-card-list me-2"></i>
              Ver Menú
            </button>
            ${isAdminUser ? `
              <button class="btn btn-outline-dark btn-lg px-5" id="finalAdminBtn" style="min-width: 220px;">
                <i class="bi bi-speedometer2 me-2"></i>
                Panel Admin
              </button>
            ` : ''}
          ` : `
            <button class="btn btn-dark btn-lg px-5" id="finalRegisterBtn" style="min-width: 220px;">
              <i class="bi bi-person-plus me-2"></i>
              Crear Cuenta Gratis
            </button>
            <button class="btn btn-outline-dark btn-lg px-5" id="finalLoginBtn" style="min-width: 220px;">
              <i class="bi bi-box-arrow-in-right me-2"></i>
              Iniciar Sesión
            </button>
          `}
        </div>
        <p class="text-muted mt-3 small">${authenticated ? 'Token válido por 30 minutos' : 'Registro rápido - Solo toma 1 minuto'}</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-darker text-light py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5><i class="bi bi-egg-fried me-2"></i>Sabores & Delicias</h5>
            <p class="text-muted text-footer">Donde cada comida es una experiencia memorable.</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Horario</h5>
            <p class="text-muted mb-1 text-footer">Lunes a Viernes: 12:00 - 23:00</p>
            <p class="text-muted text-footer">Sábados y Domingos: 11:00 - 00:00</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Contacto</h5>
            <p class="text-muted mb-1 text-footer"><i class="bi bi-telephone me-2"></i> (57) 322 43567898</p>
            <p class="text-muted text-footer"><i class="bi bi-geo-alt me-2"></i> Cra 45 #123-45, Tuluá</p>
          </div>
        </div>
        <hr class="my-4">
        <div class="text-center">
          <p class="mb-0">&copy; 2024 Sabores & Delicias. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `;

  // ========================================
  // EVENT LISTENERS
  // ========================================

  const navigateToRegister = () => router.navigate('/register');
  const navigateToLogin = () => router.navigate('/login');
  const navigateToMenu = () => router.navigate('/menu');
  const navigateToAdminPanel = () => router.navigate('/admin/panel');

  // Logout (solo si está autenticado)
  const logoutBtn = page.querySelector('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        const { logout } = await import('../modules/auth/userService.js');
        await logout();
      }
    });
  }

  // Botones de menú (para usuarios autenticados)
  const viewMenuBtn = page.querySelector('#viewMenuBtn');
  if (viewMenuBtn) viewMenuBtn.addEventListener('click', navigateToMenu);

  const finalMenuBtn = page.querySelector('#finalMenuBtn');
  if (finalMenuBtn) finalMenuBtn.addEventListener('click', navigateToMenu);

  // Botones de admin (solo para administradores)
  const adminPanelBtn = page.querySelector('#adminPanelBtn');
  if (adminPanelBtn) adminPanelBtn.addEventListener('click', navigateToAdminPanel);

  const finalAdminBtn = page.querySelector('#finalAdminBtn');
  if (finalAdminBtn) finalAdminBtn.addEventListener('click', navigateToAdminPanel);

  // Botón "Mis Pedidos" (para usuarios regulares)
  const myOrdersBtn = page.querySelector('#myOrdersBtn');
  if (myOrdersBtn) {
    myOrdersBtn.addEventListener('click', () => {
      router.navigate('/orders');
    });
  }

  // Botones de registro (solo si NO está autenticado)
  const registerBtn = page.querySelector('#registerBtn');
  if (registerBtn) registerBtn.addEventListener('click', navigateToRegister);

  const heroRegisterBtn = page.querySelector('#heroRegisterBtn');
  if (heroRegisterBtn) heroRegisterBtn.addEventListener('click', navigateToRegister);

  const previewRegisterBtn = page.querySelector('#previewRegisterBtn');
  if (previewRegisterBtn) previewRegisterBtn.addEventListener('click', navigateToRegister);

  const finalRegisterBtn = page.querySelector('#finalRegisterBtn');
  if (finalRegisterBtn) finalRegisterBtn.addEventListener('click', navigateToRegister);

  // Botones de login (solo si NO está autenticado)
  const loginBtn = page.querySelector('#loginBtn');
  if (loginBtn) loginBtn.addEventListener('click', navigateToLogin);

  const previewLoginBtn = page.querySelector('#previewLoginBtn');
  if (previewLoginBtn) previewLoginBtn.addEventListener('click', navigateToLogin);

  const finalLoginBtn = page.querySelector('#finalLoginBtn');
  if (finalLoginBtn) finalLoginBtn.addEventListener('click', navigateToLogin);

  // Botón de "Conocer Más" (solo si NO está autenticado)
  const learnMoreBtn = page.querySelector('#learnMoreBtn');
  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', () => {
      alert('Somos un restaurante familiar con más de 10 años de experiencia, especializados en cocina fusión con ingredientes locales y de la más alta calidad.');
    });
  }

  return page;
}