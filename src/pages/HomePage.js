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
    <!-- Enlace para saltar navegación (Accesibilidad) -->
    <a href="#main-content" class="btn btn-primary visually-hidden-focusable position-absolute top-0 start-0 m-2" 
       style="z-index: 9999;" tabindex="0">
      Saltar al contenido principal
    </a>

    <!-- Header de Navegación Principal -->
    <header role="banner" class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <!-- Logo/Marca -->
        <a class="navbar-brand fw-bold" href="#" tabindex="0" aria-label="Sabores & Delicias - Página de inicio">
          <i class="bi bi-egg-fried me-2" aria-hidden="true"></i>
          Sabores & Delicias
        </a>
        
        <!-- Navegación de Usuario -->
        <nav class="navbar-nav ms-auto" aria-label="Navegación de usuario">
          ${authenticated ? `
            <!-- Usuario autenticado -->
            <div class="d-flex align-items-center">
              <span class="navbar-text text-light me-3" aria-label="Usuario: ${userName}">
                <i class="bi bi-person-circle me-1" aria-hidden="true"></i>
                ¡Hola, ${userName}!
                ${isAdminUser ? 
                  '<span class="badge bg-warning text-dark ms-1" aria-label="Rol: Administrador">Admin</span>' : 
                  ''
                }
              </span>
              <button class="btn btn-outline-warning" id="logoutBtn" tabindex="0" aria-label="Cerrar sesión">
                <i class="bi bi-box-arrow-right me-1" aria-hidden="true"></i>
                Cerrar Sesión
              </button>
            </div>
          ` : `
            <!-- Usuario NO autenticado -->
            <div class="d-flex align-items-center">
              <button class="btn btn-outline-light me-2" id="loginBtn" tabindex="0" aria-label="Iniciar sesión">
                <i class="bi bi-box-arrow-in-right me-1" aria-hidden="true"></i>
                Iniciar Sesión
              </button>
              <button class="btn btn-primary" id="registerBtn" tabindex="0" aria-label="Crear cuenta nueva">
                <i class="bi bi-person-plus me-1" aria-hidden="true"></i>
                Crear Cuenta
              </button>
            </div>
          `}
        </nav>
      </div>
    </header>

    <!-- Sección Hero Principal -->
    <section id="main-content" class="hero-section py-5" 
            style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 80vh; display: flex; align-items: center;" 
            aria-labelledby="hero-heading" tabindex="-1">
      <div class="container">
        <div class="row align-items-center">
          <!-- Contenido Textual -->
          <div class="col-lg-6">
            <header>
              <h1 id="hero-heading" class="display-4 fw-bold text-white mb-4" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
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
            </header>
            
            <!-- Botones de Acción Principal -->
            <div class="d-flex gap-3 flex-wrap">
              ${authenticated ? `
                <!-- Botones para usuario autenticado -->
                <button class="btn btn-warning btn-lg px-4 fw-bold" id="viewMenuBtn" style="min-width: 200px;" aria-label="Ver menú completo" tabindex="0">
                  <i class="bi bi-card-list me-2" aria-hidden="true"></i>
                  Ver Menú Completo
                </button>
                ${isAdminUser ? `
                  <button class="btn btn-outline-light btn-lg px-4" id="adminPanelBtn" style="min-width: 200px;" aria-label="Acceder al panel de administración" tabindex="0">
                    <i class="bi bi-speedometer2 me-2" aria-hidden="true"></i>
                    Panel Admin
                  </button>
                ` : `
                  <button class="btn btn-outline-light btn-lg px-4" id="myOrdersBtn" style="min-width: 200px;" aria-label="Ver mis pedidos anteriores" tabindex="0">
                    <i class="bi bi-bag-check me-2" aria-hidden="true"></i>
                    Mis Pedidos
                  </button>
                `}
              ` : `
                <!-- Botones para usuario NO autenticado -->
                <button class="btn btn-warning btn-lg px-4 fw-bold" id="heroRegisterBtn" style="min-width: 200px;" aria-label="Descubrir menú completo registrándose" tabindex="0">
                  <i class="bi bi-rocket-takeoff me-2" aria-hidden="true"></i>
                  Descubrir Menú
                </button>
                <button class="btn btn-outline-light btn-lg px-4" id="learnMoreBtn" style="min-width: 200px;" aria-label="Más información sobre el restaurante" tabindex="0">
                  <i class="bi bi-info-circle me-2" aria-hidden="true"></i>
                  Conocer Más
                </button>
              `}
            </div>
          </div>

          <!-- Elemento Visual Hero -->
          <div class="col-lg-6">
            <aside class="text-center" aria-label="Estado de acceso">
              <div class="hero-image rounded-3 p-5" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                ${authenticated ? `
                  <i class="bi bi-check-circle display-1 text-success mb-3" aria-hidden="true"></i>
                  <h3 class="text-white mt-3" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Acceso Completo</h3>
                  <p class="text-light">Disfruta de todas nuestras funcionalidades</p>
                  <span class="visually-hidden">Estado: Usuario autenticado con acceso completo</span>
                ` : `
                  <i class="bi bi-lock display-1 text-warning mb-3" aria-hidden="true"></i>
                  <h3 class="text-white mt-3" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Acceso Exclusivo</h3>
                  <p class="text-light">Regístrate para desbloquear todas las funcionalidades</p>
                  <span class="visually-hidden">Estado: Acceso limitado, registro requerido para funcionalidades completas</span>
                `}
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Beneficios -->
    <section class="py-5 bg-light" aria-labelledby="benefits-heading">
      <div class="container">
        <header class="text-center mb-5">
          <h2 id="benefits-heading" class="h1">
            ${authenticated ? 'Tus beneficios activos' : 'Desbloquea estas ventajas al registrarte'}
          </h2>
          <p class="lead text-muted">${authenticated ? 'Todos tus beneficios están activos y disponibles' : 'Crea tu cuenta para acceder a estos beneficios exclusivos'}</p>
        </header>
        
        <div class="row text-center">
          <!-- Beneficio 1: Menú Completo -->
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm ${authenticated ? 'border-success' : 'border-light'}">
              <div class="card-body">
                ${authenticated ? 
                  '<div class="position-absolute top-0 end-0 m-3"><i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i><span class="visually-hidden">Beneficio activo</span></div>' : 
                  '<div class="position-absolute top-0 end-0 m-3"><i class="bi bi-lock text-muted" aria-hidden="true"></i><span class="visually-hidden">Beneficio bloqueado - requiere registro</span></div>'
                }
                <i class="bi bi-book display-4 text-primary mb-3" aria-hidden="true"></i>
                <h3 class="card-title h5 text-dark">Menú Completo</h3>
                <p class="card-text text-muted">
                  ${authenticated 
                    ? 'Ya tienes acceso a nuestra carta completa con fotos, descripciones y precios' 
                    : 'Accede a nuestra carta completa con fotos, descripciones y precios'
                  }
                </p>
                ${!authenticated ? '<span class="visually-hidden">Requiere registro para activar este beneficio</span>' : ''}
              </div>
            </div>
          </div>

          <!-- Beneficio 2: Reservas Online -->
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm ${authenticated ? 'border-success' : 'border-light'}">
              <div class="card-body">
                ${authenticated ? 
                  '<div class="position-absolute top-0 end-0 m-3"><i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i><span class="visually-hidden">Beneficio activo</span></div>' : 
                  '<div class="position-absolute top-0 end-0 m-3"><i class="bi bi-lock text-muted" aria-hidden="true"></i><span class="visually-hidden">Beneficio bloqueado - requiere registro</span></div>'
                }
                <i class="bi bi-calendar-check display-4 text-success mb-3" aria-hidden="true"></i>
                <h3 class="card-title h5 text-dark">Reservas Online</h3>
                <p class="card-text text-muted">
                  ${authenticated 
                    ? 'Reserva tu mesa favorita en segundos, sin llamadas' 
                    : 'Reserva tu mesa favorita en segundos, sin llamadas'
                  }
                </p>
                ${!authenticated ? '<span class="visually-hidden">Requiere registro para activar este beneficio</span>' : ''}
              </div>
            </div>
          </div>

          <!-- Beneficio 3: Beneficios Exclusivos -->
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm ${authenticated ? 'border-success' : 'border-light'}">
              <div class="card-body">
                ${authenticated ? 
                  '<div class="position-absolute top-0 end-0 m-3"><i class="bi bi-check-circle-fill text-success" aria-hidden="true"></i><span class="visually-hidden">Beneficio activo</span></div>' : 
                  '<div class="position-absolute top-0 end-0 m-3"><i class="bi bi-lock text-muted" aria-hidden="true"></i><span class="visually-hidden">Beneficio bloqueado - requiere registro</span></div>'
                }
                <i class="bi bi-gift display-4 text-warning mb-3" aria-hidden="true"></i>
                <h3 class="card-title h5 text-dark">Beneficios Exclusivos</h3>
                <p class="card-text text-muted">
                  ${authenticated 
                    ? 'Disfruta de descuentos, promociones especiales y acumulación de puntos' 
                    : 'Descuentos, promociones especiales y acumulación de puntos'
                  }
                </p>
                ${!authenticated ? '<span class="visually-hidden">Requiere registro para activar este beneficio</span>' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Vista Previa (solo para NO autenticados) -->
    ${!authenticated ? `
      <section class="py-5" aria-labelledby="preview-heading">
        <div class="container">
          <div class="row align-items-center">
            <!-- Lista de Características -->
            <div class="col-lg-6">
              <header>
                <h2 id="preview-heading" class="fw-bold mb-4">Una muestra de lo que te espera</h2>
                <p class="text-muted mb-4">Descubre algunas de nuestras características principales</p>
              </header>
              
              <div class="preview-item mb-4 p-3 bg-white rounded shadow-sm">
                <div class="d-flex align-items-center">
                  <i class="bi bi-egg-fried text-warning display-6 me-3" aria-hidden="true"></i>
                  <div>
                    <h3 class="text-dark mb-1 h6">Platos Exclusivos</h3>
                    <p class="text-muted mb-0">Recetas únicas creadas por nuestro chef</p>
                  </div>
                </div>
              </div>
              
              <div class="preview-item mb-4 p-3 bg-white rounded shadow-sm">
                <div class="d-flex align-items-center">
                  <i class="bi bi-cup-straw text-success display-6 me-3" aria-hidden="true"></i>
                  <div>
                    <h3 class="text-dark mb-1 h6">Bebidas Artesanales</h3>
                    <p class="text-muted mb-0">Cócteles y bebidas preparadas con ingredientes frescos</p>
                  </div>
                </div>
              </div>
              
              <div class="preview-item mb-4 p-3 bg-white rounded shadow-sm">
                <div class="d-flex align-items-center">
                  <i class="bi bi-basket text-primary display-6 me-3" aria-hidden="true"></i>
                  <div>
                    <h3 class="text-dark mb-1 h6">Pedidos a Domicilio</h3>
                    <p class="text-muted mb-0">Disfruta nuestra comida en la comodidad de tu hogar</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Llamado a la Acción -->
            <div class="col-lg-6">
              <aside class="text-center" aria-label="Invitación a registrarse">
                <div class="access-teaser bg-dark text-white rounded-3 p-5">
                  <i class="bi bi-lock-fill display-1 text-warning mb-3" aria-hidden="true"></i>
                  <h3 class="mb-3 h4">Contenido Exclusivo</h3>
                  <p class="mb-4">Regístrate o inicia sesión para desbloquear el menú completo y todas las funcionalidades</p>
                  <div class="d-grid gap-2">
                    <button class="btn btn-warning btn-lg" id="previewRegisterBtn" aria-label="Crear cuenta gratuita" tabindex="0">
                      <i class="bi bi-person-plus me-2" aria-hidden="true"></i>
                      Crear Cuenta Gratis
                    </button>
                    <button class="btn btn-outline-light" id="previewLoginBtn" aria-label="Iniciar sesión con cuenta existente" tabindex="0">
                      ¿Ya tienes cuenta? Inicia Sesión
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </div>
      </section>
    ` : ''}

    <!-- Sección de Testimonios -->
    <section class="py-5 bg-dark text-white" aria-labelledby="testimonials-heading">
      <div class="container">
        <header class="text-center mb-5">
          <h2 id="testimonials-heading" class="h1">Lo que dicen nuestros clientes</h2>
          <p class="lead text-light">Experiencias reales de nuestros clientes registrados</p>
        </header>
        
        <div class="row">
          <!-- Testimonio 1 -->
          <div class="col-md-4 mb-4" itemscope itemtype="https://schema.org/Review">
            <div class="card testimonial-card bg-light text-dark border-0 h-100">
              <div class="card-body">
                <div class="text-warning mb-3" aria-label="Calificación: 5 estrellas de 5" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
                  <meta itemprop="ratingValue" content="5">
                  <meta itemprop="bestRating" content="5">
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <span class="visually-hidden">5 estrellas de 5</span>
                </div>
                <blockquote class="card-text testimonial-text" itemprop="reviewBody">
                  "Una vez que te registras, descubres un mundo de opciones increíbles. Vale totalmente la pena."
                </blockquote>
                <footer class="mt-3">
                  <cite class="text-muted" itemprop="author" itemscope itemtype="https://schema.org/Person">
                    <strong itemprop="name">María González</strong>
                  </cite>
                </footer>
              </div>
            </div>
          </div>

          <!-- Testimonio 2 -->
          <div class="col-md-4 mb-4" itemscope itemtype="https://schema.org/Review">
            <div class="card testimonial-card bg-light text-dark border-0 h-100">
              <div class="card-body">
                <div class="text-warning mb-3" aria-label="Calificación: 4.5 estrellas de 5" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
                  <meta itemprop="ratingValue" content="4.5">
                  <meta itemprop="bestRating" content="5">
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-half" aria-hidden="true"></i>
                  <span class="visually-hidden">4.5 estrellas de 5</span>
                </div>
                <blockquote class="card-text testimonial-text" itemprop="reviewBody">
                  "El sistema de reservas online es super práctico. Crear la cuenta fue rápido y ahora reservo en segundos."
                </blockquote>
                <footer class="mt-3">
                  <cite class="text-muted" itemprop="author" itemscope itemtype="https://schema.org/Person">
                    <strong itemprop="name">Carlos Rodríguez</strong>
                  </cite>
                </footer>
              </div>
            </div>
          </div>

          <!-- Testimonio 3 -->
          <div class="col-md-4 mb-4" itemscope itemtype="https://schema.org/Review">
            <div class="card testimonial-card bg-light text-dark border-0 h-100">
              <div class="card-body">
                <div class="text-warning mb-3" aria-label="Calificación: 5 estrellas de 5" itemprop="reviewRating" itemscope itemtype="https://schema.org/Rating">
                  <meta itemprop="ratingValue" content="5">
                  <meta itemprop="bestRating" content="5">
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <i class="bi bi-star-fill" aria-hidden="true"></i>
                  <span class="visually-hidden">5 estrellas de 5</span>
                </div>
                <blockquote class="card-text testimonial-text" itemprop="reviewBody">
                  "Los beneficios para clientes registrados son geniales. Descuentos y promociones que no encuentras en otro lugar."
                </blockquote>
                <footer class="mt-3">
                  <cite class="text-muted" itemprop="author" itemscope itemtype="https://schema.org/Person">
                    <strong itemprop="name">Ana Martínez</strong>
                  </cite>
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Sección de Llamado Final a la Acción -->
    <section class="py-5 bg-warning" aria-labelledby="cta-heading">
      <div class="container text-center">
        <header>
          <h2 id="cta-heading" class="mb-3 h1">
            ${authenticated ? '¿Qué te gustaría hacer?' : '¿Listo para descubrir el menú completo?'}
          </h2>
          <p class="lead mb-4">
            ${authenticated 
              ? 'Explora nuestro menú o gestiona tu cuenta' 
              : 'Únete a nuestra comunidad gastronómica y desbloquea todas las funcionalidades'
            }
          </p>
        </header>
        
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          ${authenticated ? `
            <button class="btn btn-dark btn-lg px-5" id="finalMenuBtn" style="min-width: 220px;" aria-label="Ver menú completo" tabindex="0">
              <i class="bi bi-card-list me-2" aria-hidden="true"></i>
              Ver Menú
            </button>
            ${isAdminUser ? `
              <button class="btn btn-outline-dark btn-lg px-5" id="finalAdminBtn" style="min-width: 220px;" aria-label="Acceder al panel administrativo" tabindex="0">
                <i class="bi bi-speedometer2 me-2" aria-hidden="true"></i>
                Panel Admin
              </button>
            ` : `
              <button class="btn btn-outline-dark btn-lg px-5" id="finalOrdersBtn" style="min-width: 220px;" aria-label="Ver historial de pedidos" tabindex="0">
                <i class="bi bi-bag-check me-2" aria-hidden="true"></i>
                Mis Pedidos
              </button>
            `}
          ` : `
            <button class="btn btn-dark btn-lg px-5" id="finalRegisterBtn" style="min-width: 220px;" aria-label="Crear cuenta gratuita" tabindex="0">
              <i class="bi bi-person-plus me-2" aria-hidden="true"></i>
              Crear Cuenta Gratis
            </button>
            <button class="btn btn-outline-dark btn-lg px-5" id="finalLoginBtn" style="min-width: 220px;" aria-label="Iniciar sesión" tabindex="0">
              <i class="bi bi-box-arrow-in-right me-2" aria-hidden="true"></i>
              Iniciar Sesión
            </button>
          `}
        </div>
        <p class="text-dark mt-3 small" aria-live="polite">
          ${authenticated ? 'Token válido por 30 minutos' : 'Registro rápido - Solo toma 1 minuto'}
        </p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-darker text-light py-4" role="contentinfo" aria-label="Información del sitio">
      <div class="container">
        <div class="row">
          <!-- Información del Restaurante -->
          <address class="col-md-4 mb-3" aria-label="Información del restaurante">
            <h5><i class="bi bi-egg-fried me-2" aria-hidden="true"></i>Sabores & Delicias</h5>
            <p class="text-light text-footer">Donde cada comida es una experiencia memorable.</p>
          </address>
          
          <!-- Horario -->
          <div class="col-md-4 mb-3">
            <h5>Horario</h5>
            <dl class="text-light text-footer">
              <dt class="visually-hidden">Días de semana</dt>
              <dd class="mb-1">Lunes a Domingos: 12:00 - 23:30</dd>
            </dl>
          </div>
          
          <!-- Contacto -->
          <address class="col-md-4 mb-3">
            <h5>Contacto</h5>
            <p class="text-light mb-1 text-footer">
              <i class="bi bi-telephone me-2" aria-hidden="true"></i> 
              <a href="tel:+573224356789" class="text-light text-decoration-none text-footer">(57) 322 43567898</a>
            </p>
            <p class="text-light text-footer">
              <i class="bi bi-geo-alt me-2" aria-hidden="true"></i> 
              Cra 45 #123-45, Tuluá
            </p>
          </address>
        </div>
        
        <hr class="my-4 bg-light" aria-hidden="true">
        
        <div class="text-center">
          <p class="mb-0 text-light">&copy; 2024 Sabores & Delicias. Todos los derechos reservados.</p>
          <p class="text-light small mt-2">Sitio web optimizado para accesibilidad</p>
        </div>
      </div>
    </footer>

    <!-- CSS para mejoras de accesibilidad -->
    <style>
      .visually-hidden-focusable:not(:focus):not(:focus-within) {
        position: absolute !important;
        width: 1px !important;
        height: 1px !important;
        padding: 0 !important;
        margin: -1px !important;
        overflow: hidden !important;
        clip: rect(0, 0, 0, 0) !important;
        white-space: nowrap !important;
        border: 0 !important;
      }

      .visually-hidden-focusable:focus {
        position: fixed !important;
        top: 10px;
        left: 10px;
        z-index: 9999;
        width: auto !important;
        height: auto !important;
        padding: 0.5rem 1rem !important;
        background: #0d6efd !important;
        color: white !important;
        text-decoration: none !important;
      }

      .btn:focus-visible,
      a:focus-visible {
        outline: 3px solid #0d6efd;
        outline-offset: 2px;
        box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25);
      }

      .text-footer {
        color: #e2e8f0 !important;
      }

      /* Mejorar contraste en testimonios */
      .testimonial-card {
        background-color: #ffffff !important;
        color: #2d3748 !important;
      }

      .testimonial-text {
        color: #4a5568 !important;
        font-size: 1rem;
        line-height: 1.6;
      }

      @media (prefers-contrast: high) {
        .text-muted {
          color: #000 !important;
        }
        
        .bg-light {
          background-color: #fff !important;
        }
        
        .card {
          border: 2px solid #000 !important;
        }
        
        .text-light {
          color: #fff !important;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    </style>
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
      router.navigate('/historial-pedidos');
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