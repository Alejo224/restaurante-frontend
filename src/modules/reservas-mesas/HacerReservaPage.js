import { router } from "../../router.js"
import { cargarMesas } from "./reserva.js"
import { ObtenerHorarios } from "./reserva.js";
import { crearReservaCliente } from "./reserva.js";

let mesaSeleccionadaId = null;

export function ReservaMesaPagina() {

    const reservaPage = document.createElement('div');
    reservaPage.classList.add('container');

    //Creamos el componente del html 
    reservaPage.innerHTML = `
        <div class="reserva-mesa">  
        <form id="form-reserva"">
            <fieldset>
                        <legend for="reservacion">Reservación de Mesa:</legend>
                        <div class="DatosContacto">
                            <label for="fecha">Fecha:</label>
                            <input id="fecha" type="date" required>
                        </div>
                        <div class="DatosContacto">
                            <label for="hora-select">Hora:</label>
                            <select id="hora-select" class="form-select form-select-sm" aria-label="Small select example" required> 
                                <option value="" disabled selected>Selecciona una hora</option>
                            </select>
                        </div>
                        <div class="DatosContacto">
                          <label for="nota">Nota:</label>
                          <textarea id="nota" placeholder="Alguna indicación especial"></textarea>
                        </div>

                        <div class="mesas-outer-wrapper">
                            <!-- Contenedor donde se cargan las mesas dinámicamente -->
                            <div class="mesas-container" id="mesas-container"></div>
                        </div>
                        
                        <div class="grupo-navegacion">
                            <i class="bi bi-arrow-left-short" id="icono-volver"></i>
                            <button type="submit" id="confirmar-reservacion-btn">Confirmar Reservación</button>
                        </div>

                    </fieldset>

        </form>
        </div>
        `;


    const fechaInput = reservaPage.querySelector('#fecha');
    const notaText = reservaPage.querySelector("#nota");
    const contenedorMesas = reservaPage.querySelector('#mesas-container');


    cargarMesas(contenedorMesas).then(() => {
        activarSeleccionMesas();
    });

    const selectHora = reservaPage.querySelector('#hora-select')
    ObtenerHorarios(selectHora);

    const formualrioReserva = reservaPage.querySelector('#form-reserva');


    function activarSeleccionMesas() {
        const mesas = contenedorMesas.querySelectorAll('.mesa');

        //Recoremos todad las mesas
        mesas.forEach(mesa => {
            mesa.addEventListener('click', () => {

                if (!mesa.classList.contains('disponible')) {
                    console.log('la mesa esta ocuapda y no se puede seleccionar');
                    return;
                }
                // quitamos la mesa anterior 
                mesas.forEach(m => m.classList.remove('seleccionada'));
                // Marcamos esta mesa selecionada 
                mesa.classList.add('seleccionada');

                //Guardamos el id de la mesa seleccionada 
                mesaSeleccionadaId = mesa.dataset.id;

                console.log('Mesa disponible seleccionada:', mesaSeleccionadaId);
            });
        });
    }


    formualrioReserva.addEventListener('submit', async (event) => {
        //Detenemos la accion por defecto del navegador de recargar la pagina 
        event.preventDefault();
        const fechaReserva = fechaInput.value;
        const horaDeReserva = selectHora.value;
        console.log("⏰ Hora seleccionada:", horaDeReserva);
        const nota_Text = notaText.value;

        if (mesaSeleccionadaId == null) {
            alert('Por favor seleccione una mesa.');
            return;
        }

        const reservaDatos = {
            fechaReserva: fechaReserva,
            horaReserva: horaDeReserva,
            mesaId: mesaSeleccionadaId,
            nota: nota_Text
        };
        const respuesta = await crearReservaCliente(reservaDatos);

        console.log("📦 Datos enviados al backend:", reservaDatos);
        console.log("📦 JSON enviado:", JSON.stringify(reservaDatos));

        console.log('Datos enviados a la API');

        if (respuesta) {
            alert("Reserva realizada exitosamente.");
            router.navigate('/dashboard');
        } else {
            alert("No se pudo crear la reserva.");
        }

    });

    reservaPage.querySelector('#icono-volver').addEventListener('click', () => {
        router.navigate('/dashboard');
    });

    //  Retornamos el contenedor para que el router lo monte en la vista
    return reservaPage;

}
