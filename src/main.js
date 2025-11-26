// main.js
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./style.css";
import { router } from "./router.js";

// Páginas públicas
import { HomePage } from "./pages/HomePage.js";
import { RegisterPage } from "./modules/auth/RegisterPage.js";
import { LoginPage } from "./modules/auth/LoginPage.js";
import { MenuPublicPage } from "./modules/menu/pages/MenuPublicPage.js";

// Páginas de administrador
import { MenuManagementPage } from "./modules/admin/pages/MenuManagementPage.js";
import { AdminDashboard } from "./modules/admin/pages/AdminDashboard.js";

// Páginas de usuarios (cliente)
import { UserDashboard } from "./modules/user/pages/UserDashboard.js";
import { HistorialPedidosPage, afterRenderHistorialPedidos } from './modules/pedidos/pages/HistorialPedidosPage.js';
import { ReservaMesaPagina } from "./modules/reservas-mesas/reservaPage.js";
import { seccionMisReservas } from "./modules/gestionReservasClientes/misReservas.js";


// ========================================
// 🌐 RUTAS PÚBLICAS (sin autenticación)
// ========================================

router.addRoute("/", HomePage, {
  requiresAuth: false,
});

router.addRoute("/register", RegisterPage, {
  requiresAuth: false,
});

router.addRoute("/login", LoginPage, {
  requiresAuth: false,
});

router.addRoute("/menu", MenuPublicPage, {
  requiresAuth: false, // Menú público visible para todos
});

router.addRoute("/historial-pedidos", HistorialPedidosPage, {
  requiresAuth: true,
  requiresRole: "USER",
  afterRender: afterRenderHistorialPedidos
});


// ========================================
// 🔒 RUTAS PROTEGIDAS - SOLO USUARIOS AUTENTICADOS
// ========================================

// Ejemplo: Perfil de usuario (requiere estar logueado, cualquier rol)
// router.addRoute('/profile', ProfilePage, {
//   requiresAuth: true
// });

// Dashboard del usuario
router.addRoute("/dashboard", UserDashboard, {
  requiresAuth: true,
  requiresRole: "USER",
});
// Página para hacer una reserva
router.addRoute("/reservar", ReservaMesaPagina, {
  requiresAuth: true,
  requiresRole: "USER",
});

// página para gestionar mis reservas

router.addRoute("/reservar/mis-reservas", seccionMisReservas,{
  requiresAuth:true,
  requiresRole: "USER",
});
<<<<<<< HEAD

=======
>>>>>>> main

// ========================================
// 👨‍💼 RUTAS DE ADMINISTRADOR (requiere rol ADMIN)
// ========================================
/*
*/
router.addRoute("/admin/panel", AdminDashboard, {
  requiresAuth: true,
  requiresRole: "ADMIN",
});

// ========================================
// 🚀 INICIALIZAR ROUTER
// ========================================

router.init();

// ========================================
// 🔍 DEBUG - Solo en desarrollo
// ========================================

if (import.meta.env.DEV) {
  console.log("🔧 Modo desarrollo activado");
  console.log("📍 Rutas configuradas:", Object.keys(router.routes));

  // Exponer funciones útiles para debugging
  window.routerDebug = {
    navigate: (path) => router.navigate(path),
    currentRoute: () => router.currentRoute,
    routes: router.routes,
  };

  console.log("💡 Tip: Usa window.routerDebug para debuggear el router");
}
