// main.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';

import { router } from './router.js';
import { HomePage } from './pages/HomePage.js';
import { RegisterPage } from './modules/auth/RegisterPage.js';
import { LoginPage } from './modules/auth/LoginPage.js';

// Configurar rutas
router.addRoute('/', HomePage);
router.addRoute('/register', RegisterPage);
router.addRoute('/login', LoginPage);

// Inicializar router
router.init();

