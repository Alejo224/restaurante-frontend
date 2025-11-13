// src/modules/carrito/components/CarritoButton.js
// Botón flotante del carrito con badge de cantidad

import { obtenerCantidadTotal } from '../carritoService.js';

export function CarritoButton() {
  const button = document.createElement('button');
  
  button.className = 'btn btn-primary position-fixed rounded-circle shadow-lg carrito-flotante';
  button.setAttribute('data-bs-toggle', 'offcanvas');
  button.setAttribute('data-bs-target', '#carritoOffcanvas');
  button.setAttribute('aria-label', 'Abrir carrito de compras');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'carritoOffcanvas');
  button.setAttribute('role', 'button');
  button.tabIndex = 0;
  
  button.style.cssText = `
    bottom: 30px;
    right: 30px;
    width: 64px;
    height: 64px;
    z-index: 1040;
    transition: all 0.3s ease;
    border: 2px solid #0d6efd;
  `;

  // Renderizar contenido inicial
  actualizarBoton(button);

  // Escuchar cambios en el carrito
  window.addEventListener('carritoActualizado', () => {
    actualizarBoton(button);
    animarBoton(button);
  });

  // Efectos de interacción
  button.addEventListener('mouseenter', () => {
    button.style.transform = 'scale(1.1) translateY(-2px)';
    button.style.boxShadow = '0 8px 20px rgba(0,0,0,0.3)';
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = 'scale(1) translateY(0)';
    button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
  });

  button.addEventListener('focus', () => {
    button.style.outline = '3px solid #0d6efd';
    button.style.outlineOffset = '2px';
    button.style.transform = 'scale(1.05)';
  });

  button.addEventListener('blur', () => {
    button.style.outline = 'none';
    button.style.transform = 'scale(1)';
  });

  // Soporte para teclado
  button.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      button.click();
    }
  });

  // Feedback táctil mejorado
  button.addEventListener('touchstart', () => {
    button.style.transform = 'scale(0.95)';
  });

  button.addEventListener('touchend', () => {
    button.style.transform = 'scale(1)';
  });

  return button;
}

function actualizarBoton(button) {
  const cantidad = obtenerCantidadTotal();
  const tieneItems = cantidad > 0;
  
  // Actualizar atributos ARIA
  button.setAttribute('aria-label', 
    tieneItems 
      ? `Abrir carrito de compras con ${cantidad} ${cantidad === 1 ? 'item' : 'items'}` 
      : 'Abrir carrito de compras vacío'
  );

  button.innerHTML = `
    <div class="position-relative d-flex align-items-center justify-content-center w-100 h-100">
      <i class="bi bi-cart3 fs-4" aria-hidden="true"></i>
      ${tieneItems ? `
        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-2 border-white"
              aria-live="polite" 
              aria-atomic="true"
              style="font-size: 0.7rem; min-width: 20px; height: 20px;">
          ${cantidad > 99 ? '99+' : cantidad}
          <span class="visually-hidden">${cantidad} ${cantidad === 1 ? 'item' : 'items'} en el carrito</span>
        </span>
      ` : ''}
    </div>
  `;

  // Actualizar estado visual basado en la cantidad
  if (tieneItems) {
    button.classList.add('carrito-con-items');
    button.classList.remove('carrito-vacio');
  } else {
    button.classList.add('carrito-vacio');
    button.classList.remove('carrito-con-items');
  }
}

function animarBoton(button) {
  const cantidad = obtenerCantidadTotal();
  
  if (cantidad > 0) {
    // Animación de "bounce" cuando se agrega un item
    button.style.animation = 'none';
    setTimeout(() => {
      button.style.animation = 'carritoBounce 0.6s ease';
    }, 10);

    // Efecto de pulso para nuevos items
    const badge = button.querySelector('.badge');
    if (badge) {
      badge.style.animation = 'badgePulse 0.8s ease 2';
    }
  }
}

// Agregar estilos de animación al documento
const style = document.createElement('style');
style.textContent = `
  @keyframes carritoBounce {
    0%, 100% { 
      transform: scale(1) translateY(0); 
    }
    25% { 
      transform: scale(1.15) translateY(-5px); 
    }
    50% { 
      transform: scale(0.95) translateY(2px); 
    }
    75% { 
      transform: scale(1.05) translateY(-2px); 
    }
  }

  @keyframes badgePulse {
    0%, 100% { 
      transform: translate(-50%, -50%) scale(1);
      box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
    }
    50% { 
      transform: translate(-50%, -50%) scale(1.2);
      box-shadow: 0 0 0 8px rgba(220, 53, 69, 0);
    }
  }

  .carrito-flotante {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2) !important;
    border: 2px solid #0d6efd !important;
  }

  .carrito-flotante:hover {
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3) !important;
    transform: scale(1.1) translateY(-2px);
  }

  .carrito-flotante:focus {
    outline: 3px solid #0d6efd !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 3px rgba(13, 110, 253, 0.25) !important;
  }

  .carrito-flotante:active {
    transform: scale(0.95) !important;
    transition: transform 0.1s ease !important;
  }

  .carrito-con-items {
    background: linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%) !important;
  }

  .carrito-vacio {
    background: linear-gradient(135deg, #6c757d 0%, #495057 100%) !important;
    border-color: #6c757d !important;
  }

  .carrito-vacio:hover {
    background: linear-gradient(135deg, #5a6268 0%, #3d4449 100%) !important;
  }

  /* Alto contraste */
  @media (prefers-contrast: high) {
    .carrito-flotante {
      border: 3px solid #000 !important;
      background: #000 !important;
      color: #fff !important;
    }

    .badge {
      border: 2px solid #fff !important;
      background: #f00 !important;
      color: #fff !important;
    }
  }

  /* Movimiento reducido */
  @media (prefers-reduced-motion: reduce) {
    .carrito-flotante {
      transition: none !important;
      animation: none !important;
    }

    .badge {
      animation: none !important;
    }

    @keyframes carritoBounce {
      to {
        transform: scale(1) translateY(0);
      }
    }

    @keyframes badgePulse {
      to {
        transform: translate(-50%, -50%) scale(1);
        box-shadow: none;
      }
    }
  }

  /* Mejoras para móviles */
  @media (max-width: 768px) {
    .carrito-flotante {
      bottom: 20px !important;
      right: 20px !important;
      width: 56px !important;
      height: 56px !important;
    }
  }

  /* Estados de enfoque para modo alto contraste en Windows */
  @media (forced-colors: active) {
    .carrito-flotante:focus {
      outline: 3px solid ButtonText !important;
    }
  }

  /* Mejora de rendimiento para animaciones */
  .carrito-flotante {
    will-change: transform, box-shadow;
    contain: layout style;
  }

  .badge {
    will-change: transform, box-shadow;
  }
`;

// Agregar estilos solo una vez
if (!document.querySelector('#carrito-button-styles')) {
  style.id = 'carrito-button-styles';
  document.head.appendChild(style);
}

// Exportar función para actualizar desde otros componentes
export function actualizarCarritoButton() {
  const botonExistente = document.querySelector('.carrito-flotante');
  if (botonExistente) {
    actualizarBoton(botonExistente);
    animarBoton(botonExistente);
  }
}

// Inicializar botón cuando se carga el módulo
document.addEventListener('DOMContentLoaded', () => {
  // El botón se inicializa automáticamente cuando se importa el componente
});