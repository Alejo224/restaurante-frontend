import { router } from "../../router.js"
//import '../tipo-servicio/style.css'

export function ReservaMesaPagina() {

    const reservaPage = document.createElement('div');
    reservaPage.classList.add('container', 'py-5');

    const style = document.createElement('style');
    style.textContent = `
        * {
            padding: 0;
            margin: 0;
            box-sizing: border-box;
        }

        .reserva-container {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            border-radius: 12px;
            padding: 2rem;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        fieldset {
            border: 2px solid #0d6efd;
            border-radius: 10px;
            padding: 20px;
            margin-top: 20px;
            background-color: #f8f9fa;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        legend {
            font-weight: bold;
            padding: 0 10px;
        }

        .DatosContacto {
            margin-top: 14px;
        }

        .DatosContacto label {
            font-weight: 600;
            margin-bottom: 6px;
            display: block;
        }

        .DatosContacto input {
            width: 100%;
            margin-bottom: 10px;
            border-radius: 5px;
            border: 2px solid rgba(13, 110, 253, 0.5);
            padding: 8px;
        }

        .grupo-navegacion {
            display: flex;
            justify-content: space-between;
        }

        .grupo-navegacion i {
            color: #0d6efd;
            font-size: 35px;
            margin-right: 10px;
            align-self: center;
            cursor: pointer;
        }

        .grupo-navegacion i:hover {
            color: #084298;
        }

        button {
            background-color: #0d6efd;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-top: 10px;
        }

        button:hover {
            background-color: #084298;
        }

        .mesas-container {
            display: grid;
            grid-template-columns: repeat(5, 80px);
            gap: 10px;
            margin-top: 15px;
            margin-bottom: 15px;
        }

        .mesa {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            border: 1px solid #007bff;
            border-radius: 8px;
            padding: 10px;
            cursor: pointer;
        }

        .mesa i {
            font-size: 32px;
            color: #007bff;
        }
    `;


    reservaPage.innerHTML = `
         <div class="reserva-container">
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
                    </div>

                    <div class="grupo-navegacion">
                        <i class="bi bi-arrow-left-short" id="icono-volver"></i>
                        <button type="submit" id="confirmar-reservacion-btn">Confirmar Reservación</button>
                    </div>

                </fieldset>
            </form>
            </div>
    `;

    reservaPage.prepend(style);

    reservaPage.querySelector('#icono-volver').addEventListener('click', () => {
        router.navigate('/dashboard');
    });

    // ✅ Retornamos el contenedor para que el router lo monte en la vista
    return reservaPage;

}
