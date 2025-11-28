/**
 * Servicio centralizado de Notificaciones (Toasts)
 * Facilita mostrar notificaciones en toda la aplicación
 */

class ServicioNotificaciones {
  constructor() {
    this.contenedor = null;
    this.contadorNotificaciones = 0;
    this.inicializarContenedor();
  }

  /**
   * Inicializa el contenedor de notificaciones en el DOM
   */
  inicializarContenedor() {
    let contenedor = document.getElementById('contenedor-notificaciones');
    
    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.id = 'contenedor-notificaciones';
      contenedor.style.position = 'fixed';
      contenedor.style.top = '20px';
      contenedor.style.right = '20px';
      contenedor.style.zIndex = '9999';
      contenedor.style.pointerEvents = 'none';
      document.body.appendChild(contenedor);
    }
    
    this.contenedor = contenedor;
  }

  /**
   * Crea y muestra una notificación
   * @param {string} mensaje - Mensaje a mostrar
   * @param {string} tipo - Tipo de notificación: 'exito', 'error', 'advertencia', 'info'
   * @param {number} duracion - Duración en milisegundos (0 = no se auto-cierra)
   */
  mostrar(mensaje, tipo = 'info', duracion = 3000) {
    this.contadorNotificaciones++;
    const idNotificacion = `notificacion-${this.contadorNotificaciones}`;

    // Colores según el tipo
    const colores = {
      exito: { fondo: '#198754', icono: '✓' },
      error: { fondo: '#dc3545', icono: '✕' },
      advertencia: { fondo: '#ffc107', icono: '⚠', colorTexto: '#000' },
      info: { fondo: '#0d6efd', icono: 'ⓘ' }
    };

    const config = colores[tipo] || colores.info;
    const colorTexto = config.colorTexto || '#fff';

    // Crear elemento de la notificación
    const elementoNotificacion = document.createElement('div');
    elementoNotificacion.id = idNotificacion;
    elementoNotificacion.style.cssText = `
      background-color: ${config.fondo};
      color: ${colorTexto};
      padding: 16px 20px;
      border-radius: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 250px;
      max-width: 400px;
      word-wrap: break-word;
      font-size: 14px;
      font-weight: 500;
      animation: deslizarEntrada 0.3s ease-out;
      pointer-events: auto;
    `;

    // Contenido de la notificación
    const spanIcono = document.createElement('span');
    spanIcono.style.cssText = `
      font-size: 18px;
      font-weight: bold;
      flex-shrink: 0;
    `;
    spanIcono.textContent = config.icono;

    const spanMensaje = document.createElement('span');
    spanMensaje.style.cssText = `
      flex: 1;
      word-break: break-word;
    `;
    spanMensaje.textContent = mensaje;

    const botonCerrar = document.createElement('button');
    botonCerrar.style.cssText = `
      background: none;
      border: none;
      color: ${colorTexto};
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      margin-left: 8px;
      flex-shrink: 0;
      opacity: 0.7;
      transition: opacity 0.2s;
    `;
    botonCerrar.innerHTML = '×';
    botonCerrar.onmouseover = () => botonCerrar.style.opacity = '1';
    botonCerrar.onmouseout = () => botonCerrar.style.opacity = '0.7';
    botonCerrar.onclick = () => this.eliminar(idNotificacion);

    elementoNotificacion.appendChild(spanIcono);
    elementoNotificacion.appendChild(spanMensaje);
    elementoNotificacion.appendChild(botonCerrar);

    // Agregar estilos de animación si no existen
    if (!document.getElementById('estilos-notificaciones')) {
      const elementoEstilo = document.createElement('style');
      elementoEstilo.id = 'estilos-notificaciones';
      elementoEstilo.textContent = `
        @keyframes deslizarEntrada {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes deslizarSalida {
          from {
            transform: translateX(0);
            opacity: 1;
          }
          to {
            transform: translateX(400px);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(elementoEstilo);
    }

    // Agregar al contenedor
    this.contenedor.appendChild(elementoNotificacion);

    // Auto-cerrar después del tiempo especificado
    if (duracion > 0) {
      setTimeout(() => this.eliminar(idNotificacion), duracion);
    }

    return idNotificacion;
  }

  /**
   * Muestra una notificación de éxito
   */
  exito(mensaje, duracion = 3000) {
    return this.mostrar(mensaje, 'exito', duracion);
  }

  /**
   * Muestra una notificación de error
   */
  error(mensaje, duracion = 4000) {
    return this.mostrar(mensaje, 'error', duracion);
  }

  /**
   * Muestra una notificación de advertencia
   */
  advertencia(mensaje, duracion = 3000) {
    return this.mostrar(mensaje, 'advertencia', duracion);
  }

  /**
   * Muestra una notificación de información
   */
  info(mensaje, duracion = 3000) {
    return this.mostrar(mensaje, 'info', duracion);
  }

  /**
   * Elimina una notificación específica
   */
  eliminar(idNotificacion) {
    const notificacion = document.getElementById(idNotificacion);
    if (notificacion) {
      notificacion.style.animation = 'deslizarSalida 0.3s ease-out forwards';
      setTimeout(() => {
        notificacion.remove();
      }, 300);
    }
  }

  /**
   * Elimina todas las notificaciones
   */
  eliminarTodas() {
    if (this.contenedor) {
      this.contenedor.innerHTML = '';
    }
  }
}

// Exportar instancia única del servicio (Singleton)
export const servicioNotificaciones = new ServicioNotificaciones();
