import { router } from "../../router.js"
import {cargarMesas} from "../reservas-mesas/reservaServices.js"

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
                        <label for="hora">Hora:</label>
                        <input id="hora" type="time" required>
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

    const contenedorMesas = reservaPage.querySelector('#mesas-container');
    cargarMesas(contenedorMesas);


    reservaPage.querySelector('#icono-volver').addEventListener('click', () => {
        router.navigate('/dashboard');
    });

    //  Retornamos el contenedor para que el router lo monte en la vista
    return reservaPage;

}
