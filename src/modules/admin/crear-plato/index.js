// src/modules/admin/crear-plato/index.js
import { crearPlato } from "./platosServices.js";  
import { obtenerCategorias } from "./categoriaService.js";

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

// Estado de carga
let categoriasCargadas = false;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inicializando interfaz de creación de platos...');
    cargarCategorias();
});

// Función para cargar categorías desde la API
async function cargarCategorias() {
    try {
        console.log('🔄 Cargando categorías...');
        mostrarLoadingCategorias();
        
        const categorias = await obtenerCategorias();
        
        // Limpiar select antes de agregar nuevas opciones
        categoriaPlatoSelect.innerHTML = '';
        
        // Agregar opción por defecto
        const optionDefault = document.createElement('option');
        optionDefault.value = '';
        optionDefault.textContent = 'Seleccione una categoría';
        optionDefault.disabled = true;
        optionDefault.selected = true;
        categoriaPlatoSelect.appendChild(optionDefault);
        
        // Agregar categorías al select - CORRECCIÓN AQUÍ
        categorias.forEach(categoria => {
            const option = document.createElement('option');
            option.value = categoria.id;
            option.textContent = categoria.nombreCategoria; // Cambiado de 'nombre' a 'nombreCategoria'
            categoriaPlatoSelect.appendChild(option);
        });
        
        categoriaPlatoSelect.disabled = false;
        categoriasCargadas = true;
        console.log('✅ Categorías cargadas correctamente');
        
    } catch (error) {
        console.error('❌ Error al cargar categorías:', error);
        mostrarErrorCategorias(error.message);
    }
}

// Función para mostrar estado de carga en el select
function mostrarLoadingCategorias() {
    categoriaPlatoSelect.innerHTML = '';
    const optionLoading = document.createElement('option');
    optionLoading.value = '';
    optionLoading.textContent = 'Cargando categorías...';
    optionLoading.disabled = true;
    categoriaPlatoSelect.appendChild(optionLoading);
    categoriaPlatoSelect.disabled = true;
}

// Función para mostrar error en la carga de categorías
function mostrarErrorCategorias(mensaje) {
    categoriaPlatoSelect.innerHTML = '';
    const optionError = document.createElement('option');
    optionError.value = '';
    optionError.textContent = 'Error al cargar categorías';
    optionError.disabled = true;
    categoriaPlatoSelect.appendChild(optionError);
    categoriaPlatoSelect.disabled = true;
    
    // Mostrar mensaje de error al usuario
    mostrarMensaje(mensaje, 'error');
}

// Función para mostrar mensajes
function mostrarMensaje(mensaje, tipo = 'info') {
    // Limpiar mensajes anteriores
    const mensajesAnteriores = document.querySelectorAll('.mensaje-temporal');
    mensajesAnteriores.forEach(msg => msg.remove());
    
    const mensajeDiv = document.createElement('div');
    const backgroundColor = tipo === 'error' ? '#f44336' : 
                           tipo === 'success' ? '#4CAF50' : '#2196F3';
    
    mensajeDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        max-width: 300px;
    `;
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = 'mensaje-temporal';
    document.body.appendChild(mensajeDiv);
    
    setTimeout(() => {
        if (document.body.contains(mensajeDiv)) {
            document.body.removeChild(mensajeDiv);
        }
    }, 5000);
}

// Botón para volver al menú principal
btnVolverMenu.addEventListener('click', () => {
    window.close();
});

// El formulario ya está visible, pero por si acaso mostramos la sección
btnCreacionPlato.addEventListener('click', () => {
    document.getElementById('creacion-plato').style.display = 'block';
});

// Botón para recargar categorías
function agregarBotonRecargarCategorias() {
    // Verificar si ya existe el botón
    if (document.getElementById('btn-recargar-categorias')) {
        return;
    }
    
    const btnRecargar = document.createElement('button');
    btnRecargar.id = 'btn-recargar-categorias';
    btnRecargar.textContent = '🔄 Recargar Categorías';
    btnRecargar.type = 'button';
    btnRecargar.style.cssText = `
        margin-left: 10px;
        padding: 5px 10px;
        background: #666;
        color: white;
        border: none;
        border-radius: 3px;
        cursor: pointer;
        font-size: 12px;
    `;
    btnRecargar.addEventListener('click', function() {
        this.disabled = true;
        this.textContent = '🔄 Cargando...';
        cargarCategorias().finally(() => {
            this.disabled = false;
            this.textContent = '🔄 Recargar Categorías';
        });
    });
    
    // Insertar después del select de categorías
    categoriaPlatoSelect.parentNode.appendChild(btnRecargar);
}

btnGuardar.addEventListener('click', (e) => {
    e.preventDefault();
    validarCampos();
});

function validarCampos() {
    // Verificar que las categorías estén cargadas
    if (!categoriasCargadas) {
        mostrarMensaje('Las categorías aún se están cargando. Por favor, espere.', 'error');
        return;
    }

    const nombre = nombrePlatoInput.value.trim();
    const descripcion = descripcionPlatoInput.value.trim();
    const precio = precioPlatoInput.value.trim();
    const categoria = categoriaPlatoSelect.value;
    const imagen = imagenPlatoInput.files;

    // Validar que se haya seleccionado una categoría válida
    if (categoria === '') {
        mostrarMensaje('Por favor, seleccione una categoría.', 'error');
        return;
    }

    const archivo = imagen[0];
    const tipoImagenPermitida = ['image/jpeg', 'image/jpg', 'image/png'];

    if ( 
        nombre === '' ||
        descripcion === '' ||
        precio === '' ||
        imagen.length === 0 
    ) {
        mostrarMensaje('Por favor, complete todos los campos.', 'error');
        return;
    }

    if (!tipoImagenPermitida.includes(archivo.type)) {
        mostrarMensaje('El tipo de imagen no es válido. Por favor, suba un archivo JPG, JPEG o PNG.', 'error');
        return; 
    }   

    const nuevoPlato = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        imagen: archivo
    };

    // Mostrar loading en el botón guardar
    const btnOriginalText = btnGuardar.innerHTML;
    btnGuardar.innerHTML = '🔄 Guardando...';
    btnGuardar.disabled = true;

    crearPlato(nuevoPlato)
        .then(responseData => {
            console.log('✅ Plato creado exitosamente:', responseData);
            mostrarMensaje('¡Plato creado exitosamente!', 'success');

            // Limpiar campos
            nombrePlatoInput.value = '';
            descripcionPlatoInput.value = '';
            precioPlatoInput.value = '';
            categoriaPlatoSelect.value = '';
            imagenPlatoInput.value = '';

        })
        .catch(error => {
            console.error('❌ Error al crear el plato:', error);
            mostrarMensaje('Hubo un error al crear el plato: ' + error.message, 'error');
        })
        .finally(() => {
            // Restaurar botón
            btnGuardar.innerHTML = btnOriginalText;
            btnGuardar.disabled = false;
        });
}

// Agregar botón de recargar categorías después de que el DOM esté listo
setTimeout(() => {
    agregarBotonRecargarCategorias();
}, 1000);

console.log('✅ Interfaz de creación de platos cargada correctamente');