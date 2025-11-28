# 📢 Guía de Uso - Servicio de Notificaciones

## Descripción General

El servicio centralizado de notificaciones (`servicioNotificaciones`) facilita mostrar mensajes emergentes (toasts) en toda la aplicación de manera consistente y fácil de usar.

## 📦 Instalación/Importación

Para usar el servicio en cualquier archivo JavaScript:

```javascript
import { servicioNotificaciones } from '../../shared/services/toastService.js';
```

> **Nota:** Ajusta la ruta de importación según la ubicación de tu archivo.

---

## 🎨 Tipos de Notificaciones

El servicio proporciona 4 tipos de notificaciones con iconos y colores predefinidos:

### 1️⃣ **Notificación de Éxito** (Verde)
```javascript
servicioNotificaciones.exito('¡Operación completada exitosamente!');
```

### 2️⃣ **Notificación de Error** (Rojo)
```javascript
servicioNotificaciones.error('Ocurrió un error inesperado');
```

### 3️⃣ **Notificación de Advertencia** (Amarillo)
```javascript
servicioNotificaciones.advertencia('Por favor verifica los datos');
```

### 4️⃣ **Notificación de Información** (Azul)
```javascript
servicioNotificaciones.info('Información importante');
```

---

## ⏱️ Duración Personalizada

Cada método acepta un segundo parámetro para definir cuánto tiempo (en milisegundos) se muestra la notificación:

```javascript
// Notificación que se cierra después de 5 segundos
servicioNotificaciones.exito('¡Éxito!', 5000);

// Notificación que se cierra después de 2 segundos
servicioNotificaciones.error('Error', 2000);

// Notificación que NO se cierra automáticamente (0 = permanente)
servicioNotificaciones.info('Mensaje permanente', 0);
```

### ⏱️ Duraciones Predeterminadas
- **Éxito:** 3000 ms (3 segundos)
- **Error:** 4000 ms (4 segundos)
- **Advertencia:** 3000 ms (3 segundos)
- **Info:** 3000 ms (3 segundos)

---

## 🔧 Método Personalizado

Si necesitas más control, usa el método `mostrar()`:

```javascript
servicioNotificaciones.mostrar('Mensaje personalizado', 'exito', 5000);
```

**Parámetros:**
- `mensaje` (string): Texto a mostrar
- `tipo` (string): 'exito', 'error', 'advertencia' o 'info'
- `duracion` (number): Milisegundos (0 = no se auto-cierra)

---

## 🎛️ Métodos Avanzados

### Cerrar una Notificación Específica
```javascript
const idNotificacion = servicioNotificaciones.exito('Mensaje');
// Después, cerrarla manualmente:
servicioNotificaciones.eliminar(idNotificacion);
```

### Cerrar Todas las Notificaciones
```javascript
servicioNotificaciones.eliminarTodas();
```

---

## 💡 Ejemplos Prácticos

### En Formularios
```javascript
const validacion = verificarFormulario();
if (!validacion.valido) {
    servicioNotificaciones.advertencia(validacion.mensaje);
    return;
}

servicioNotificaciones.exito('Formulario completado correctamente');
```

### En Llamadas a API
```javascript
try {
    const respuesta = await fetch('/api/datos');
    if (!respuesta.ok) {
        servicioNotificaciones.error('Error al obtener datos');
        return;
    }
    servicioNotificaciones.exito('Datos cargados correctamente');
} catch (error) {
    servicioNotificaciones.error('Error de conexión');
}
```

### En Operaciones de Base de Datos
```javascript
try {
    const resultado = await crearReserva(datos);
    servicioNotificaciones.exito('Reserva creada exitosamente');
} catch (error) {
    servicioNotificaciones.error('No se pudo crear la reserva');
}
```

### En Confirmaciones
```javascript
const confirmacion = await pedirConfirmacion();
if (confirmacion) {
    servicioNotificaciones.exito('Operación confirmada');
} else {
    servicioNotificaciones.advertencia('Operación cancelada');
}
```

---

## 🎯 Integración en Gestión de Reservas

### En `reservaPage.js`
```javascript
// Al validar datos
if (!validacion.valido) {
    servicioNotificaciones.advertencia(validacion.mensaje);
    return;
}

// Al crear exitosamente
servicioNotificaciones.exito('Reserva realizada exitosamente');

// Al encontrar error
servicioNotificaciones.error('No se pudo crear la reserva');
```

### En `tipoServicios.js`
```javascript
// Al validar campos del formulario
if (!validacion.valido) {
    servicioNotificaciones.error(mensaje);
    return;
}

// Al enviar pedido exitosamente
servicioNotificaciones.exito('¡Pedido creado exitosamente!');
```

---

## 🎨 Características Visuales

- ✅ **Animaciones suaves** - Deslizamiento de entrada y salida
- ✅ **Iconos predefinidos** - Cada tipo tiene su icono
- ✅ **Colores intuitivos** - Verde (éxito), Rojo (error), Amarillo (advertencia), Azul (info)
- ✅ **Botón de cierre** - Usuarios pueden cerrar manualmente
- ✅ **Responsive** - Se adapta a diferentes tamaños de pantalla
- ✅ **Stacking** - Múltiples notificaciones se apilan correctamente
- ✅ **Z-index** - Siempre visible encima de otros elementos

---

## 📝 Buenas Prácticas

1. **Sé específico con los mensajes**
   ```javascript
   // ❌ Malo
   servicioNotificaciones.error('Error');
   
   // ✅ Bueno
   servicioNotificaciones.error('No se pudo guardar la reserva. Intente nuevamente.');
   ```

2. **Usa el tipo correcto**
   ```javascript
   // ❌ Malo
   servicioNotificaciones.error('Cambiaste tu contraseña');
   
   // ✅ Bueno
   servicioNotificaciones.exito('Contraseña actualizada correctamente');
   ```

3. **Proporciona contexto**
   ```javascript
   // ❌ Malo
   servicioNotificaciones.error('Fallo');
   
   // ✅ Bueno
   servicioNotificaciones.error('No se pudo conectar al servidor. Verifica tu conexión a internet.');
   ```

4. **Usa duraciones apropiadas**
   ```javascript
   // Errores críticos - más tiempo para leer
   servicioNotificaciones.error('Mensaje importante', 5000);
   
   // Confirmaciones simples - menos tiempo
   servicioNotificaciones.exito('Guardado', 2000);
   ```

---

## 🐛 Troubleshooting

### La notificación no aparece
- Verifica que la importación sea correcta
- Asegúrate de que el DOM esté cargado
- Revisa la consola del navegador para errores

### La notificación aparece pero sin estilos
- Verifica que Bootstrap esté cargado (se usa solo para posicionamiento)
- Los estilos están incluidos en el servicio, no depende de Bootstrap

### Múltiples notificaciones se superponen
- Es comportamiento normal - se apilan verticalmente
- Aumenta la duración si necesitas que sean más legibles

---

## 📚 Referencia Rápida

```javascript
// Métodos disponibles
servicioNotificaciones.exito(mensaje, duracion)        // Verde ✓
servicioNotificaciones.error(mensaje, duracion)        // Rojo ✕
servicioNotificaciones.advertencia(mensaje, duracion)  // Amarillo ⚠
servicioNotificaciones.info(mensaje, duracion)         // Azul ⓘ
servicioNotificaciones.mostrar(mensaje, tipo, duracion) // Personalizado
servicioNotificaciones.eliminar(idNotificacion)        // Cierra una
servicioNotificaciones.eliminarTodas()                 // Cierra todas
```

---

## 🔄 Migración desde `alert()` y `toastService`

Si ya estabas usando `alert()` o `toastService`, aquí están los cambios:

```javascript
// Antes (alert)
alert('¡Éxito!');

// Ahora (servicioNotificaciones)
servicioNotificaciones.exito('¡Éxito!');

// Antes (toastService antiguo)
toastService.success('Mensaje');

// Ahora (servicioNotificaciones nuevo)
servicioNotificaciones.exito('Mensaje');
```

---

## 📞 Soporte

Para reportar problemas o sugerencias, revisa la implementación en:
- `src/shared/services/toastService.js`

¡Disfruta usando notificaciones consistentes en toda tu aplicación! 🎉
