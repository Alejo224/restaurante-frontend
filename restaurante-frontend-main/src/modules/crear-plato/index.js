import { crearPlato, obtenerPlatosPorId } from "./platosServices.js";
import { router } from '../../router.js';

// Obtener referencias a los botones para agregar funcionalidad
const btnNegocio = document.getElementById('btn-negocio');
const btnCreacionPlato = document.getElementById('btn-creacion-plato');
const btnModidficacionPlato = document.getElementById('btn-modificacion-plato');
const GestionMesas = document.getElementById('btn-gestion-mesas');

//vamos a obtener los campos del contenido  de la creacion de plato
const nombrePlatoInput = document.getElementById('nombre-plato');
const descripcionPlatoInput = document.getElementById('descripcion-plato');
const precioPlatoInput = document.getElementById('precio-plato');
const categoriaPlatoSelect = document.getElementById('categoria-plato');
const imagenPlatoInput = document.getElementById('imagen-plato');
const crearPlatoBtn = document.getElementById('crear-plato-btn');
const btnGuardar = document.getElementById('btn-guardar');

// ----------------------------------------------------------------------
// 3. FUNCIONALIDAD DE BÚSQUEDA Y LLENADO DEL FORMULARIO DE MODIFICACIÓN
const buscarPlatoInput = document.getElementById('buscar-plato'); // <-- ¡AÑADIDA! Input para el ID
const btnBuscar = document.getElementById('btn-buscar'); // <-- ¡CORREGIDA! Debe ser 'btn-buscar'
const resultadosBusquedaSection = document.getElementById('resultados-busqueda'); // <-- ¡AÑADIDA!

const modNombrePlatoInput = document.querySelector('#modificar-plato #nombre-plato');
const modDescripcionPlatoInput = document.querySelector('#modificar-plato #descripcion-plato');
const modPrecioPlatoInput = document.querySelector('#modificar-plato #precio-plato');
const modCategoriaPlatoSelect = document.querySelector('#modificar-plato #categoria-plato');
// **REFERENCIA DE IMAGEN** (Requiere el <img> con id="imagen-plato-actual" en el HTML)
const imagenPlatoActual = document.getElementById('imagen-plato-actual');

const btnGuardarModificacion= document.getElementById('btn-editar-guardar');

// Obtener todas las secciones de contenido
const secciones = document.querySelectorAll('.content_section');


function ocultarContenido() {
    secciones.forEach(seccion => seccion.style.display = 'none');
}

// Agregar eventos a los botones para mostrar la sección correspondiente
//La función getElementById en JavaScript se usa para obtener una referencia a un elemento HTML que tiene un atributo id específico.

btnNegocio.addEventListener('click', () => {
    ocultarContenido();
    document.getElementById('tu-negocio').style.display = 'block';
});



btnCreacionPlato.addEventListener('click', () => {
    ocultarContenido();
    document.getElementById('creacion-plato').style.display = 'block';
});


btnModidficacionPlato.addEventListener('click', () => {
    ocultarContenido();
    document.getElementById('modificar-plato').style.display = 'block';
});

GestionMesas.addEventListener('click', () => {
    ocultarContenido();
    document.getElementById('gestion-mesas').style.display = 'block';
});

btnGuardar.addEventListener('click', (e) => {
    e.preventDefault(); // Evitar el envío del formulario
    validarCampos(); // Llamar a la función de validación
});


// vamos a validar que todos los campos esten llenos
function validarCampos() {
    const nombre = nombrePlatoInput.value.trim();
    const descripcion = descripcionPlatoInput.value.trim();
    const precio = precioPlatoInput.value.trim();
    const categoria = categoriaPlatoSelect.value.trim();
    const imagen = imagenPlatoInput.files; //se usa .files.length para validar que se haya subido una imagen.

    // Tipos de imagen permitidos
    const archivo = imagen[0]; // Obtener el primer archivo seleccionado
    const tipoImagenPermitida = ['image/jpeg', 'image/jpg', 'image/png'];

    // Verificar si algún campo está vacío
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
    // Aquí puedes agregar la lógica para guardar el plato en tu base de datos o realizar otras acciones necesarias.

    if (!tipoImagenPermitida.includes(archivo.type)) {
        alert('El tipo de imagen no es válido. Por favor, suba un archivo JPG, JPEG o PNG.');
        return;
    }

    // Crear un objeto con los datos del plato
    const nuevoPlato = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        imagen: archivo
    };
    // Llamar a la función crearPlato para enviar los datos a la API
    try {
        crearPlato(nuevoPlato)
            .then(responseData => {
                console.log('✅ Plato creado exitosamente:', responseData);
                // Aquí puedes agregar lógica adicional, como limpiar el formulario o redirigir al usuario

                router.navigate('/platos'); // Redirigir a la página de platos después de crear uno nuevo

                // Limpiar los campos del formulario
                nombrePlatoInput.value = '';
                descripcionPlatoInput.value = '';
                precioPlatoInput.value = '';
                categoriaPlatoSelect.value = '';
                imagenPlatoInput.value = '';

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




function llenarFormularioModificacion(plato) {
    // Llenar los campos de texto
    modNombrePlatoInput.value = plato.nombre || '';
    modDescripcionPlatoInput.value = plato.descripcion || '';
    modPrecioPlatoInput.value = plato.precio || '';
    
    // Seleccionar la categoría (el valor de 'plato.categoriaId' debe coincidir con el 'value' del <option>)
    modCategoriaPlatoSelect.value = plato.categoriaId ? String(plato.categoriaId) : '';
    
    // ⚠️ Mostrar la imagen actual
    // Asume que el backend tiene un endpoint para servir la imagen por ID,
    // o que la respuesta del plato incluye la propiedad 'urlImagen'.
    // Usaremos la convención de tu API GET /api/platos/{id}
    
    // NOTA: EL PATH EXACTO DE LA IMAGEN DEPENDE DE CÓMO LA SIRVE TU BACKEND.
    // ESTA ES UNA CONVENCIÓN COMÚN si el backend la sirve como un recurso estático o con un controlador:
    const API_IMAGEN_BASE_URL = `http://localhost:8080/api/platos/imagen`; // Suponiendo este endpoint
    
    if (plato.id) { 
        const imageUrl = `${API_IMAGEN_BASE_URL}/${plato.id}`; 
        
        // Si tienes el elemento <img>, actualiza su source
        if (imagenPlatoActual) {
            imagenPlatoActual.src = imageUrl;
            imagenPlatoActual.style.display = 'block'; // Mostrar la imagen
        }
        
    } else {
        // Limpiar o esconder si no hay imagen
        if (imagenPlatoActual) {
            imagenPlatoActual.src = '';
            imagenPlatoActual.style.display = 'none';
        }
    }
}


// ----------------------------------------------------------------------
// 4. EVENT LISTENER PARA LA BÚSQUEDA POR ID
// ----------------------------------------------------------------------

btnBuscar.addEventListener('click', async () => {
    console.log('🔍 Iniciando búsqueda de plato por ID...');
    const inputBusqueda = buscarPlatoInput.value.trim();

    if (inputBusqueda === '') {
        alert('Por favor, ingrese el ID numérico del plato a buscar.');
        return;
    }

    // ➡️ Validación Clave: Forzar la búsqueda por ID numérico
    const platoId = parseInt(inputBusqueda);

    if (isNaN(platoId) || platoId <= 0) {
        alert('El ID debe ser un número entero positivo.');
        resultadosBusquedaSection.style.display = 'none';
        return;
    }

    resultadosBusquedaSection.style.display = 'none'; // Ocultar antes de buscar

    try {
        // Llama a la función de servicio que usa el ID
        const platoEncontrado = await obtenerPlatosPorId(platoId);

        if (platoEncontrado) {
            console.log('✅ Plato encontrado por ID:', platoEncontrado);
            
            // Llenar el formulario con los datos, incluyendo la foto
            llenarFormularioModificacion(platoEncontrado);
            
            // Mostrar la sección de resultados (formulario)
            resultadosBusquedaSection.style.display = 'block';
        } else {
            // Este bloque puede ser redundante si el servicio lanza un error en 404
            alert(`Plato con ID '${platoId}' no encontrado.`);
        }
    } catch (error) {
        // Maneja el error de red o el 404 (no encontrado) del servidor.
        console.error('❌ Error al obtener el plato por ID:', error);
        alert(`Error: El plato con ID ${platoId} no existe o hubo un problema al conectar con la API.`);
        resultadosBusquedaSection.style.display = 'none';
    }
});

// ... (El resto de tu index.js: btnNegocio, btnCreacionPlato, btnGuardar, etc.)
btnGuardarModificacion.addEventListener('click', (e) => {
    e.preventDefault(); // Evitar el envío del formulario
    validarCampos(); // Llamar a la función de validación
});

// ----------------------------------------------------------------------
// FIN DEL CÓDIGO DE CREAR Y MODIFICAR PLATOS
// ----------------------------------------------------------------------