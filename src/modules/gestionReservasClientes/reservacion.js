import { infoReservas } from "../gestionReservasClientes/gestionReservaServices.js";
import { ActualizarReserva } from "../gestionReservasClientes/gestionReservaServices.js";
import { eliminarReserva } from "../gestionReservasClientes/gestionReservaServices.js";
import { router } from "../../router.js";

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
                <button class="modificar-reserva" data-id="${reserva}"> Modificar</button>
                <button class="eliminar-reserva" data-id="${reserva.id}"> Eliminar<i class="bi bi-trash"></i> </button>
            </div>
        </article>
        `).join("");


        // Para eliminar la reserva (con manejo de errores y feedback)
        const botonesEliminar = contenedor.querySelectorAll('.eliminar-reserva');
        botonesEliminar.forEach(boton => {
            boton.addEventListener('click', async (e) => {
                e.preventDefault();
                const reservaId = boton.dataset.id;
                if (!reservaId) {
                    console.error('ID de reserva no encontrado en el botón', boton);
                    return;
                }
                console.log("Eliminar reserva con ID:", reservaId);
                boton.disabled = true;
                try {
                    const resultado = await eliminarReserva(reservaId);
                    if (resultado === null) {
                        alert(`No se pudo eliminar la reserva #${reservaId}. Revisa la consola.`);
                    } else {
                        alert(`Reserva #${reservaId} eliminada.`);
                        // Recargar la lista de reservas después de eliminar
                        await informacionReservas(contenedor);
                    }
                } catch (err) {
                    console.error('Error al eliminar reserva:', err);
                    alert('Error al eliminar la reserva. Revisa la consola.');
                } finally {
                    boton.disabled = false;
                }
            });
        });

        // Para modificar la reserva
        const botonesModificar = contenedor.querySelectorAll('.modificar-reserva');
        botonesModificar.forEach((boton, index) => {
            boton.addEventListener('click', async (e) => {
                e.preventDefault();
                const formulario = router.navigate(`/reservar`);
                if (!formulario) {
                    alert("Error al cargar el formulario de reserva.");
                    return;
                }
                const reservaId = reservas[index].id;
                // Aquí normalmente se navegaría y se cargarían datos para editar
                // Si existe una función para prefills, llamarla. Por ahora solo aviso.
                alert(`Funcionalidad para modificar la reserva #${reservaId} aún no implementada.`);
            });
        });


    }
    catch (err) {
        contenedor.innerHTML = `<p style="color:red">Error cargando mesas</p>`;
        console.error(err);
    }
}

