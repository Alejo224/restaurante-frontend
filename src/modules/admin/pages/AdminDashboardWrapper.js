// src/modules/admin/pages/AdminDashboardWrapper.js
import { router } from '../../../router.js';

export function AdminDashboardWrapper() {
  const page = document.createElement('div');
  
  page.innerHTML = `
    <!-- Aquí va TODO el HTML de tu compañero, pero con algunos ajustes -->
    <div class="container">
      <h1>Administrador - Sabores & Delicias prubea</h1>
      <!-- este es el contenedor principal -->
      <div class="main-content">
        <!-- este es el contenedor de los botones -->
        <div class="grupotsBotns">
          <button id="btn-negocio" type="submit"> Tu negocio</button>
          <button id="btn-creacion-plato" type="submit"> Crear plato </button>
          <button id="btn-modificacion-plato" type="submit"> Modificar plato </button>
          <button id="btn-eliminar-plato" type="submit"> Eliminar plato </button>
          <button id="btn-gestion-mesas" type="submit"> Gestionar mesa </button>
          <button id="btn-volver-menu" type="submit"> Volver al Menú </button>
        </div>

        <!-- este es el contenedor de todo el lado derecho-->
        <div class="content_Derecho">
          <!-- este es  la seccion del tu negocio -->
          <div id="tu-negocio" class="content_section">
            <h2>Tu negocio</h2>
            <p>Bienvenido al panel de administración</p>
          </div>
          <!-- este es  la seccion del crear un plato -->
          <div id="creacion-plato" class="content_section" style="display: none;">
            <h2>Crear plato</h2>
            <div class="content_plato">
              <div class="data_plato">
                <label for="nombre-plato">Nombre del plato</label>
                <input type="text" id="nombre-plato" placeholder="Nombre del plato" required>

                <label for="imagen-plato">Imagen del plato</label>
                <input type="file" id="imagen-plato" accept=".jpg, .jpeg, .png" required>

                <label for="descripcion-plato">Descripcion del plato</label>
                <input type="text" id="descripcion-plato" placeholder="Descripcion" required>

                <label for="precio-plato">Precio</label>
                <input type="number" id="precio-plato" placeholder="Precio" required>
                <h3>Categoria</h3>
                <select id="categoria-plato" required>
                  <option value="1">Entrada</option>
                  <option value="2">Hamburgesa</option>
                  <option value="3">Plato Fuerte</option>
                  <option value="4">Postre</option>
                  <option value="5">Bebida</option>
                </select>
                <button id="btn-guardar" type="submit">Guardar</button>
              </div>
            </div>
          </div>
          <!-- este es  la seccion del modificar un plato -->
          <div id="modificar-plato" class="content_section" style="display: none;">
            <h2>Modificar Plato</h2>
            <p>Funcionalidad de modificación - Próximamente</p>
          </div>

          <!-- este es  la seccion del eliminar un plato -->
          <div id="eliminar-plato" class="content_section" style="display:none;">
            <h2>Eliminar plato</h2>
            <p>Funcionalidad de eliminación - Próximamente</p>
          </div>
          <!-- este es  la seccion del gestionar mesa -->
          <div id="gestion-mesas" class="content_section" style="display:none;">
            <h2>Gestionar mesa</h2>
            <p>Funcionalidad de gestión de mesas - Próximamente</p>
          </div>
        </div>
      </div>
    </div>
  `;

  // Cargar el JavaScript de tu compañero dinámicamente
  setTimeout(() => {
    loadCompanionScript(page);
  }, 100);

  return page;
}

// Función para cargar y adaptar el código de tu compañero
async function loadCompanionScript(page) {
  try {
    // Importar el servicio de platos de tu compañero
    const { crearPlato } = await import('../crear-plato/platosServices.js');
    
    // Obtener referencias a los elementos (igual que en el código de tu compañero)
    const btnNegocio = page.querySelector('#btn-negocio');
    const btnCreacionPlato = page.querySelector('#btn-creacion-plato');
    const btnModificacionPlato = page.querySelector('#btn-modificacion-plato');
    const btnEliminarPlato = page.querySelector('#btn-eliminar-plato');
    const btnGestionMesas = page.querySelector('#btn-gestion-mesas');
    const btnVolverMenu = page.querySelector('#btn-volver-menu');

    // Campos del formulario
    const nombrePlatoInput = page.querySelector('#nombre-plato');
    const descripcionPlatoInput = page.querySelector('#descripcion-plato');
    const precioPlatoInput = page.querySelector('#precio-plato');
    const categoriaPlatoSelect = page.querySelector('#categoria-plato');
    const imagenPlatoInput = page.querySelector('#imagen-plato');
    const btnGuardar = page.querySelector('#btn-guardar');

    // Obtener todas las secciones de contenido
    const secciones = page.querySelectorAll('.content_section');

    // Función para ocultar contenido (igual que tu compañero)
    function ocultarContenido() {
      secciones.forEach(seccion => seccion.style.display = 'none');    
    }

    // Agregar eventos a los botones (igual que tu compañero)
    btnNegocio.addEventListener('click', () => {
      ocultarContenido();
      page.querySelector('#tu-negocio').style.display = 'block';
    });

    btnCreacionPlato.addEventListener('click', () => {
      ocultarContenido();
      page.querySelector('#creacion-plato').style.display = 'block';
    });

    btnModificacionPlato.addEventListener('click', () => {
      ocultarContenido();
      page.querySelector('#modificar-plato').style.display = 'block';
    });

    btnEliminarPlato.addEventListener('click', () => {
      ocultarContenido();
      page.querySelector('#eliminar-plato').style.display = 'block';
    });

    btnGestionMesas.addEventListener('click', () => {
      ocultarContenido();
      page.querySelector('#gestion-mesas').style.display = 'block';
    });

    // Botón para volver al menú de administración
    btnVolverMenu.addEventListener('click', () => {
      router.navigate('/admin/menu');
    });

    // Evento del botón guardar (adaptado para nuestro router)
    btnGuardar.addEventListener('click', (e) => {
      e.preventDefault();
      validarCampos();
    });

    // Función de validación (igual que tu compañero)
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

      // Crear objeto con los datos del plato
      const nuevoPlato = {
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        categoria: categoria,
        imagen: archivo
      };

      // Llamar a la función crearPlato de tu compañero
      try {
        crearPlato(nuevoPlato)
        .then(responseData => {
          console.log('✅ Plato creado exitosamente:', responseData);
          alert('¡Plato creado exitosamente!');
          
          // Limpiar el formulario
          nombrePlatoInput.value = '';
          descripcionPlatoInput.value = '';
          precioPlatoInput.value = '';
          categoriaPlatoSelect.value = '';
          imagenPlatoInput.value = '';

          // Opcional: Redirigir a la lista de platos
          // router.navigate('/admin/menu');
          
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

    console.log('✅ Interfaz de administración cargada correctamente');

  } catch (error) {
    console.error('❌ Error al cargar la interfaz de administración:', error);
  }
}