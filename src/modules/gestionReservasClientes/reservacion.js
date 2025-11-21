import { infoReservas } from "../gestionReservasClientes/gestionReservaServices.js";
//import { eliminarReserva } from "../gestionReservasClientes/gestionReservaServices.js";

export async function informacionReservas(contenedor) {

    if (!contenedor) {
        console.log('Error el contenedor no fue encontrado. ')
        return
    }

    contenedor.innerHTML = `<p>Cargando reservas...</p>`;

    // contenedor.querySelectorAll(".detalles-reservacion").innerHTML = `<p>cargando reservaciones....</p>`
    try {
        // Llamamos a la API para obtener las reservas del usuario actual
        const reservas = await infoReservas();

        if (!reservas || reservas.length === 0) {
            contenedor.innerHTML = `<p>No tienes reservas realizadas.</p>`;
            return;
        }


        contenedor.innerHTML = reservas.map(reserva => `
        <article class="detalles-reservacion">
            <h3>Reserva #${reserva.id}</h3>
            <div class="info-reserva">
             <i class="bi bi-info-circle"></i>
            <h2>Informacion de reservas</h2>
            </div>
            <div class="info-reserva">
            <i class="bi bi-calendar"></i>
            <p>Fecha: ${reserva.fechaReserva} </p>
            </div>
            <div class="info-reserva">
            <i class="material-symbols-outlined">alarm</i>
            <p>Horario: ${reserva.horaReserva}</p>
            </div>
            <div class="info-reserva">
            <i class="material-symbols-outlined">dine_lamp</i>
              <p> ${reserva.mesa.nombreMesa} (capacidad: ${reserva.mesa.capacidad})</p>
            </div>
            <div class="info-detalle">
            <i class="material-symbols-outlined">description</i>
            <p>Descripcion: ${reserva.nota}</p>
            </div>
            
            <div class="grupo-botones">
                <button id="modificar-reserva"> Modificar</button>
                <button id="eliminar-reserva"> Eliminar<i class="bi bi-trash"></i> </button>
            </div>
        </article>
        `).join("");


        // Agregar manejadores de eventos para los botones de eliminar reserva
        const botonesEliminar = contenedor.querySelectorAll('#eliminar-reserva');


    }
    catch (err) {
        contenedor.innerHTML = `<p style="color:red">Error cargando mesas</p>`;
        console.error(err);
    }
}

