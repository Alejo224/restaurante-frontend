// src/modules/admin/crear-plato/index.js
import { crearPlato } from "./platosServices.js";  

// Obtener referencias a los botones
const btnCreacionPlato = document.getElementById('btn-creacion-plato');
const btnVolverMenu = document.getElementById('btn-volver-menu');

// Obtener los campos del formulario
const nombrePlatoInput = document.getElementById('nombre-plato');
const descripcionPlatoInput = document.getElementById('descripcion-plato');
const precioPlatoInput = document.getElementById('precio-plato');
const categoriaPlatoSelect = document.getElementById('categoria-plato');
const imagenPlatoInput = document.getElementById('imagen-plato');
const btnGuardar = document.getElementById('btn-guardar');

// Botón para volver al menú principal
btnVolverMenu.addEventListener('click', () => {
    // Cerrar esta pestaña y volver al menú de administración
    window.close();
});

// El formulario ya está visible, pero por si acaso mostramos la sección
btnCreacionPlato.addEventListener('click', () => {
    // Ya está visible, pero por consistencia
    document.getElementById('creacion-plato').style.display = 'block';
});

btnGuardar.addEventListener('click', (e) => {
    e.preventDefault();
    validarCampos();
});

function validarCampos() {
    const nombre = nombrePlatoInput.value.trim();
    const descripcion = descripcionPlatoInput.value.trim();
    const precio = precioPlatoInput.value.trim();
    const categoria = categoriaPlatoSelect.value.trim();
    const imagen = imagenPlatoInput.files;

    const archivo = imagen[0];
    const tipoImagenPermitida = ['image/jpeg', 'image/jpg', 'image/png'];

    if ( 
        nombre === '' ||
        descripcion === '' ||
        precio === '' ||
        categoria === '' ||
        imagen.length === 0 
    ) {
        alert('Por favor, complete todos los campos.');
        return;
    }

    if(!tipoImagenPermitida.includes(archivo.type)){
        alert('El tipo de imagen no es válido. Por favor, suba un archivo JPG, JPEG o PNG.');
        return; 
    }   

    const nuevoPlato = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        imagen: archivo
    };

    try{
        crearPlato(nuevoPlato)
        .then(responseData => {
            console.log('✅ Plato creado exitosamente:', responseData);
            alert('¡Plato creado exitosamente!');

            // Limpiar campos
            nombrePlatoInput.value = '';
            descripcionPlatoInput.value = '';
            precioPlatoInput.value = '';
            categoriaPlatoSelect.value = '';
            imagenPlatoInput.value = '';

            // Mostrar mensaje de éxito
            mostrarMensajeExito();
        })
        .catch(error => {
            console.error('❌ Error al crear el plato:', error);
            alert('Hubo un error al crear el plato. Por favor, inténtelo de nuevo.');
        });
    } catch (error) {
        console.error('❌ Error inesperado:', error);
        alert('Ocurrió un error inesperado. Por favor, inténtelo de nuevo.');
    }
}

function mostrarMensajeExito() {
    const mensaje = document.createElement('div');
    mensaje.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
    `;
    mensaje.textContent = '✅ Plato creado exitosamente';
    document.body.appendChild(mensaje);
    
    setTimeout(() => {
        document.body.removeChild(mensaje);
    }, 3000);
}

console.log('✅ Interfaz de creación de platos cargada correctamente');