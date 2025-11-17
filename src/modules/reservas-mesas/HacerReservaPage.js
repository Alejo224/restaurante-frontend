import { router } from "../../router.js"
import { cargarMesas } from "./reserva.js"
import { ObtenerHorarios } from "./reserva.js";
import { crearReservaCliente } from "./reserva.js";
import { MesasOcupadas } from "./reservacionServices.js";

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
                         
                          <textarea class="form-control" placeholder="Alguna indicacíon especial" id="nota"></textarea>
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
    const selectHora = reservaPage.querySelector('#hora-select');
    const formualrioReserva = reservaPage.querySelector('#form-reserva');
    const horaSeleccionada = selectHora.value;

    // Actualizar mesas al cambiar fecha u hora
    fechaInput.addEventListener('change', actualizarMesa);
    selectHora.addEventListener('change', actualizarMesa);



    //cargar mesas iniciales 
    cargarMesas(contenedorMesas).then(() => {
        activarSeleccionMesas();
    });

    //cargar horarios 
    ObtenerHorarios(selectHora);

    // Selección de mesas
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


    // enviar reserva 
    formualrioReserva.addEventListener('submit', async (event) => {
        //Detenemos la accion por defecto del navegador de recargar la pagina 
        event.preventDefault();
        const fechaReserva = fechaInput.value;
        const horaDeReserva = selectHora.value;
        console.log(" Hora seleccionada:", horaDeReserva);
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
        try {
            const respuesta = await crearReservaCliente(reservaDatos);

            // Si el backend devuelve null o un objeto vacío, considerarlo error
            if (!respuesta || Object.keys(respuesta).length === 0) {
                alert("No se pudo crear la reserva.");
                return;
            }

            alert("Reserva realizada exitosamente.");
            router.navigate('/dashboard');

        } catch (error) {
            console.error("Error al crear la reserva:", error);
            alert("No se pudo crear la reserva.");
        }
        const respuesta = await crearReservaCliente(reservaDatos);

        console.log("📦 Datos enviados al backend:", reservaDatos);
        console.log("📦 JSON enviado:", JSON.stringify(reservaDatos));

        console.log('Datos enviados a la API');

      /*  if (respuesta) {
            alert("Reserva realizada exitosamente.");
            router.navigate('/dashboard');
        } else {
            alert("No se pudo crear la reserva.");
        }*/

    });


    //implementamos la funcion para cuando el usuarios escoga la fecha y la hora de una mesa ocupada
    async function actualizarMesa() {
        console.log("Actulizacion de mesas ocupadas...")
        const fecha = fechaInput.value;

        //verificamos que si se seleccione una fecha
        if (!fecha) {
            console.log("No hay fecha seleccionada, no se puede actualziar mesa .");
            return;
        }

        const hora = selectHora.value;

        const mesasOcupadas = await MesasOcupadas(fecha, hora);

        const mesasDOM = contenedorMesas.querySelectorAll('.mesa');

        const idOcupadas = mesasOcupadas.map(reserva => reserva.mesa.id);
        mesasDOM.forEach(mesa => {
            const idMesaDOM = mesa.dataset.id;
            if (idOcupadas.includes(Number(idMesaDOM))) {
                mesa.classList.remove('disponible');
                mesa.classList.add('ocupada');
                mesa.classList.remove('seleccionada');
            } else {
                mesa.classList.remove('ocupada');
                mesa.classList.add('disponible');

            }

        });

    }

    //volvemos al menu de opciones
    reservaPage.querySelector('#icono-volver').addEventListener('click', () => {
        router.navigate('/dashboard');
    });

    //  Retornamos el contenedor para que el router lo monte en la vista
    return reservaPage;

}
