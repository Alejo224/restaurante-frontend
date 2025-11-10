//
import { CarritoOffcanvas } from '../carrito/components/CarritoOffcanvas.js';


const recogerRestaurante = document.getElementById('recoger-restaurante');
const entregaDomicilio = document.getElementById('entrega-domicilio');
const direccionEntrega = document.getElementById('direccion');
const telefonoContacto = document.getElementById('telefono');
const btnIconoSalir = document.getElementById("icono-salir");
const btnConfirmar = document.getElementById('confirmar-btn');




btnIconoSalir.addEventListener('click', () => {
    window.history.back();
});


btnConfirmar.addEventListener('click', () => {

    console.log("Botón confirmar presionado");

    // Revisar valores antes de validar
    console.log("Valor Dirección:", direccionEntrega.value);
    console.log("Valor Teléfono:", telefonoContacto.value);
    console.log("Radio Domicilio:", entregaDomicilio.checked);
    console.log("Radio Recoger:", recogerRestaurante.checked);


    if (!verificarcampos()) {
        console.log("Validación fallida, no se abre el carrito");
        return;
    }
    console.log("Validación correcta, abriendo carrito");

    let offcanvas = document.getElementById("carritoOffcanvas");

    if (!offcanvas) {
        const generado = CarritoOffcanvas();
        document.body.appendChild(generado);
        console.log("Carrito creado en el DOM");
    }
    // Abrir el carrito
    const carrito = new bootstrap.Offcanvas("#carritoOffcanvas");
    carrito.show();


});

recogerRestaurante.addEventListener('change', suspenderBotones);
entregaDomicilio.addEventListener('change', suspenderBotones);


function suspenderBotones() {
    const campos = {
        //objeto con los campos del formulario
        domicilio: {
            radio: entregaDomicilio,
            campos: [direccionEntrega]
        },

        recoger: {
            radio: recogerRestaurante,
            campos: []
        }
    };

    //Funcion auxiliar para habilitar/deshabilitar campos 
    const toggleCampos = (elementos, deshabilitar) => {
        elementos.forEach(elemento => {
            elemento.disabled = deshabilitar;
        });
    };
    // Resetear todo a habilitado primero
    Object.values(campos).forEach(tipo => {
        tipo.radio.disabled = false;
        toggleCampos(tipo.campos, false);
    });

    // Aplicar lógica según selección
    if (campos.recoger.radio.checked) {
        campos.domicilio.radio.disabled = true;
        toggleCampos(campos.domicilio.campos, true);
    } else if (campos.domicilio.radio.checked) {
        campos.recoger.radio.disabled = true;
    }
    console.log("Campos actualizados según selección");
}
function verificarcampos() {
    const opcionesEntrega = {
        domicilio: {
            radio: entregaDomicilio,
            campos: [direccionEntrega, telefonoContacto]
        },
        recoger: {
            radio: recogerRestaurante,
            campos: [telefonoContacto]
        }
    };

    let mensajeDeError = "";
    let opcionSeleccionada = false;

    for (let opcion in opcionesEntrega) {
        let opcionActual = opcionesEntrega[opcion];

        if (opcionActual.radio.checked) {
            opcionSeleccionada = true;

            // Validar solo si hay campos requeridos
            for (let campo of opcionActual.campos) {

                console.log(`Validando campo: ${campo.id}, valor: "${campo.value}"`);

                if (!campo.value.trim()) {
                    mensajeDeError = "Por favor complete todos los campos obligatorios";
                    break;
                }
            }
        }
        if (mensajeDeError) break;
    }

    // Si no se seleccionó ninguna opción
    if (!opcionSeleccionada) {
        mostrarError("Por favor seleccione una opción de entrega");
        return false;

    }

    if (mensajeDeError) {
        console.log("Error de validación:", mensajeDeError);
        alert(mensajeDeError);
        return false; // evita abrir el carrito
    }
    console.log("Todos los campos validados correctamente");
    return true; // todo correcto

}
function mostrarError(mensaje) {
    const contenedor = document.createElement('div');
    contenedor.className = 'alert alert-danger alert-dismissible fade show position-fixed';
    contenedor.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
    contenedor.innerHTML = `
        <i class="bi bi-exclamation-triangle-fill me-2"></i>
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(contenedor);

    setTimeout(() => {
        if (contenedor.parentNode) contenedor.remove();
    }, 4000);
}

