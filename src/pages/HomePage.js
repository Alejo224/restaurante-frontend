import { router } from "../router.js";

export function HomePage() {
  const page = document.createElement('div');
  
  page.innerHTML = `
    <!-- Navbar -->
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
      <div class="container">
        <a class="navbar-brand fw-bold" href="#">
          <i class="bi bi-egg-fried me-2"></i>
          Sabores & Delicias
        </a>
        <div class="navbar-nav ms-auto">
          <button class="btn btn-outline-light me-2" id="loginBtn">
            <i class="bi bi-box-arrow-in-right me-1"></i>
            Iniciar Sesión
          </button>
          <button class="btn btn-primary" id="registerBtn">
            <i class="bi bi-person-plus me-1"></i>
            Crear Cuenta
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Section MEJORADA -->
    <section class="hero-section py-5" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 80vh; display: flex; align-items: center;">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <h1 class="display-4 fw-bold text-white mb-4" style="text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">
              Bienvenido a una experiencia gastronómica exclusiva
            </h1>
            <p class="lead text-white mb-4" style="font-size: 1.25rem; text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">
              Descubre nuestro menú secreto, realiza reservas personalizadas y disfruta 
              de beneficios especiales. Todo esto te espera al crear tu cuenta.
            </p>
            <div class="d-flex gap-3 flex-wrap">
              <button class="btn btn-warning btn-lg px-4 fw-bold" id="heroRegisterBtn" style="min-width: 200px;">
                <i class="bi bi-rocket-takeoff me-2"></i>
                Descubrir Menú
              </button>
              <button class="btn btn-outline-light btn-lg px-4" id="learnMoreBtn" style="min-width: 200px;">
                <i class="bi bi-info-circle me-2"></i>
                Conocer Más
              </button>
            </div>
          </div>
          <div class="col-lg-6">
            <div class="text-center">
              <div class="hero-image rounded-3 p-5" style="background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.2);">
                <i class="bi bi-lock display-1 text-warning mb-3"></i>
                <h4 class="text-white mt-3" style="text-shadow: 1px 1px 2px rgba(0,0,0,0.5);">Acceso Exclusivo</h4>
                <p class="text-light">Regístrate para desbloquear todas las funcionalidades</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-5 bg-light">
      <div class="container">
        <h2 class="text-center mb-5">Desbloquea estas ventajas al registrarte</h2>
        <div class="row text-center">
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm">
              <div class="card-body">
                <i class="bi bi-book display-4 text-primary mb-3"></i>
                <h5 class="card-title text-dark">Menú Completo</h5>
                <p class="card-text text-muted">
                  Accede a nuestra carta completa con fotos, descripciones y precios
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm">
              <div class="card-body">
                <i class="bi bi-calendar-check display-4 text-success mb-3"></i>
                <h5 class="card-title text-dark">Reservas Online</h5>
                <p class="card-text text-muted">
                  Reserva tu mesa favorita en segundos, sin llamadas
                </p>
              </div>
            </div>
          </div>
          <div class="col-md-4 mb-4">
            <div class="card border-0 h-100 shadow-sm">
              <div class="card-body">
                <i class="bi bi-gift display-4 text-warning mb-3"></i>
                <h5 class="card-title text-dark">Beneficios Exclusivos</h5>
                <p class="card-text text-muted">
                  Descuentos, promociones especiales y acumulación de puntos
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Preview Section -->
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
        <h2 class="mb-3">¿Listo para descubrir el menú completo?</h2>
        <p class="lead mb-4">Únete a nuestra comunidad gastronómica y desbloquea todas las funcionalidades</p>
        <div class="d-flex gap-3 justify-content-center flex-wrap">
          <button class="btn btn-dark btn-lg px-5" id="finalRegisterBtn" style="min-width: 220px;">
            <i class="bi bi-person-plus me-2"></i>
            Crear Cuenta Gratis
          </button>
          <button class="btn btn-outline-dark btn-lg px-5" id="finalLoginBtn" style="min-width: 220px;">
            <i class="bi bi-box-arrow-in-right me-2"></i>
            Iniciar Sesión
          </button>
        </div>
        <p class="text-muted mt-3 small">Registro rápido - Solo toma 1 minuto</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-darker text-light py-4">
      <div class="container">
        <div class="row">
          <div class="col-md-4 mb-3">
            <h5><i class="bi bi-egg-fried me-2"></i>Sabores & Delicias</h5>
            <p class="text-muted">Donde cada comida es una experiencia memorable.</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Horario</h5>
            <p class="text-muted mb-1">Lunes a Viernes: 12:00 - 23:00</p>
            <p class="text-muted">Sábados y Domingos: 11:00 - 00:00</p>
          </div>
          <div class="col-md-4 mb-3">
            <h5>Contacto</h5>
            <p class="text-muted mb-1"><i class="bi bi-telephone me-2"></i> (57) 322 43567898</p>
            <p class="text-muted"><i class="bi bi-geo-alt me-2"></i> Cra 45 #123-45, Tuluá</p>
          </div>
        </div>
        <hr class="my-4">
        <div class="text-center">
          <p class="mb-0">&copy; 2024 Sabores & Delicias. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  `;

  // Event listeners para navegación
  const navigateToRegister = () => router.navigate('/register');
  const navigateToLogin = () => alert('Página de login - Próximamente');

  // Todos los botones de registro van a la misma página
  page.querySelector('#registerBtn').addEventListener('click', navigateToRegister);
  page.querySelector('#heroRegisterBtn').addEventListener('click', navigateToRegister);
  page.querySelector('#previewRegisterBtn').addEventListener('click', navigateToRegister);
  page.querySelector('#finalRegisterBtn').addEventListener('click', navigateToRegister);

  // Botones de login
  page.querySelector('#loginBtn').addEventListener('click', navigateToLogin);
  page.querySelector('#previewLoginBtn').addEventListener('click', navigateToLogin);
  page.querySelector('#finalLoginBtn').addEventListener('click', navigateToLogin);

  // Botón de información
  page.querySelector('#learnMoreBtn').addEventListener('click', () => {
    alert('Somos un restaurante familiar con más de 10 años de experiencia, especializados en cocina fusión con ingredientes locales y de la más alta calidad.');
  });

  return page;
}