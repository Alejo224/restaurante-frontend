// src/modules/carrito/components/CarritoButton.js
// Botón flotante del carrito con badge de cantidad

import { obtenerCantidadTotal } from '../carritoService.js';

export function CarritoButton() {
  const button = document.createElement('button');
  
  button.className = 'btn btn-primary position-fixed rounded-circle shadow-lg carrito-flotante';
  button.setAttribute('data-bs-toggle', 'offcanvas');
  button.setAttribute('data-bs-target', '#carritoOffcanvas');
  button.setAttribute('aria-label', 'Abrir carrito');
  button.style.cssText = `
    bottom: 30px;
    right: 30px;
    width: 60px;
    height: 60px;
    z-index: 1040;
    transition: all 0.3s ease;
  `;

  // Renderizar contenido inicial
  actualizarBoton(button);

  // Escuchar cambios en el carrito
  window.addEventListener('carritoActualizado', () => {
    actualizarBoton(button);
    animarBoton(button);
  });

  // Efecto hover
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1)';
  });

  return button;
}

function actualizarBoton(button) {
  const cantidad = obtenerCantidadTotal();
  
  button.innerHTML = `
    <div class="position-relative">
      <i class="bi bi-cart3 fs-4"></i>
      ${cantidad > 0 ? `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
          ${cantidad > 99 ? '99+' : cantidad}
          <span class="visually-hidden">items en el carrito</span>
        </span>
      ` : ''}
    </div>
  `;
}

function animarBoton(button) {
  // Animación de "bounce" cuando se agrega un item
  button.style.animation = 'none';
  setTimeout(() => {
    button.style.animation = 'bounce 0.5s ease';
  }, 10);
}

// Agregar estilos de animación al documento
const style = document.createElement('style');
style.textContent = `
  @keyframes bounce {
    0%, 100% { transform: scale(1); }
    25% { transform: scale(1.2); }
    50% { transform: scale(0.9); }
    75% { transform: scale(1.1); }
  }

  .carrito-flotante:hover {
    box-shadow: 0 8px 16px rgba(0,0,0,0.2) !important;
  }

  .carrito-flotante:active {
    transform: scale(0.95) !important;
  }
`;
document.head.appendChild(style);