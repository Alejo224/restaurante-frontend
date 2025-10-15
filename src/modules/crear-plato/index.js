// Obtener referencias a los botones para agregar funcionalidad
const btnNegocio = document.getElementById('btn-negocio');
const btnCreacionPlato = document.getElementById('btn-creacion-plato');
const btnModidficacionPlato = document.getElementById('btn-modificacion-plato');
const btnEliminarPlato = document.getElementById('btn-eliminar-plato');
const GestionMesas = document.getElementById('btn-gestion-mesas');

//vamos a obtener los campos del contenido  de la creacion de plato
const nombrePlatoInput = document.getElementById('nombre-plato');
const descripcionPlatoInput = document.getElementById('descripcion-plato');
const precioPlatoInput = document.getElementById('precio-plato');
const categoriaPlatoSelect = document.getElementById('categoria-plato');
const imagenPlatoInput = document.getElementById('imagen-plato');
const crearPlatoBtn = document.getElementById('crear-plato-btn');
const btnGuardar = document.getElementById('btn-guardar');

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
btnEliminarPlato.addEventListener('click', () => {
    ocultarContenido();
    document.getElementById('eliminar-plato').style.display = 'block';
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
    // Si todos los campos están llenos, puedes proceder a guardar el plato
    alert('Plato guardado con éxito.');
    // Aquí puedes agregar la lógica para guardar el plato en tu base de datos o realizar otras acciones necesarias.

    if(!tipoImagenPermitida.includes(archivo.type)){
        alert('El tipo de imagen no es válido. Por favor, suba un archivo JPG, JPEG o PNG.');
        return; 
    }   
}