import { router } from "../../router.js"

export function ReservaMesaPagina() {

    const reservaPage = document.createElement('div');
    reservaPage.classList.add('container', 'py-5');

    reservaPage.innerHTML = `
    
            <form id="form-reserva">
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
                    <div class="DatosContacto">
                        <label for="numero-personas">Número de Personas:</label>
                        <input id="numero-personas" type="number" min="1" required>
                    </div>
                    <div class="mesas-container">
                        <div id=""></div>
                    </div>

                    <div class="grupo-navegacion">
                        <i class="bi bi-arrow-left-short" id="icono-volver"></i>
                        <button type="submit" id="confirmar-reservacion-btn">Confirmar Reservación</button>
                    </div>

                </fieldset>
            </form>
    `;
    reservaPage.querySelector('#icono-volver').addEventListener('click', () => {
        router.navigate('/dashboard');
    });

    // ✅ Retornamos el contenedor para que el router lo monte en la vista
    return reservaPage;

}
