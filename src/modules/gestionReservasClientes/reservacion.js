import { infoReservas } from "../gestionReservasClientes/gestionReservaServices.js";
<<<<<<< HEAD
import { cancelarReserva } from "../gestionReservasClientes/gestionReservaServices.js";
import { router } from "../../router.js";
=======
//import { eliminarReserva } from "../gestionReservasClientes/gestionReservaServices.js";
>>>>>>> main

export async function informacionReservas(contenedor) {

    if (!contenedor) {
        console.log('Error el contenedor no fue encontrado. ')
        return
    }

    contenedor.innerHTML = `<p>Cargando reservas...</p>`;

<<<<<<< HEAD
    // contenedor.querySelectorAll(".detalles-reservacion").innerHTML = `<p>cargando reservaciones....</p>`
    try {
        // Llamamos a la API para obtener las reservas del usuario actual
        const reservas = await infoReservas();
        const reservasActivas = reservas.filter(r => r.estado !== "CANCELADA");

        if(!reservasActivas || reservasActivas.length === 0){
            contenedor.innerHTML = `<p>No tienes reservas activas.</p>`;
            return;
        }
   
    //    if (!reservas || reservas.length === 0) {
      //      contenedor.innerHTML = `<p>No tienes reservas realizadas.</p>`;
      //      return;
      //  }


        contenedor.innerHTML = reservasActivas.map(reserva => `
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
                <button class="modificar-reserva" data-id="${reserva.id}"> Modificar</button>
                <button class="cancelar-reserva" data-id="${reserva.id}"> cancelar<i class="bi bi-trash"></i> </button>
            </div>
        </article>
        `).join("");


        // Para eliminar la reserva (con manejo de errores y feedback)
        const botonesCancelar = contenedor.querySelectorAll('.cancelar-reserva');
        botonesCancelar.forEach(boton => {
            boton.addEventListener('click', async (e) => {
                e.preventDefault();
                const reservaId = boton.dataset.id;
                if (!reservaId) {
                    console.error('ID de reserva no encontrado en el botón', boton);
                    return;
                }
                console.log("cancelar reserva con ID:", reservaId);
                boton.disabled = true;
                try {
                    const resultado = await cancelarReserva(reservaId);
                    if (resultado === null) {
                        alert(`No se pudo cancelar la reserva #${reservaId}. Revisa la consola.`);
                    } else {
                        alert(`Reserva #${reservaId} cancelda.`);
                        // Recargar la lista de reservas después de eliminar
                     
                        await informacionReservas(contenedor);
                       
                    }
                } catch (err) {
                    console.error('Error al cancelar la reserva:', err);
                    alert('Error al cancelar la reserva. Revisa la consola.');
                } finally {
                    boton.disabled = false;
                }
            });
        });


        // Para modificar la reserva: navegar a la ruta /reservar y pasar los datos
        const botonesModificar = contenedor.querySelectorAll('.modificar-reserva');
        botonesModificar.forEach(boton => {
            boton.addEventListener('click', async (e) => {
                e.preventDefault();

                const reservaId = boton.dataset.id;

                // Buscar la reserva en el arreglo ya cargado
                const reservaSeleccionada = reservas.find(r => r.id == reservaId);
                if (!reservaSeleccionada) {
                    console.error(`Reserva con ID ${reservaId} no encontrada.`);
                    return;
                }

                // Navegar a la página de reserva pasando modo 'editar' y la reserva
                await router.navigate('/reservar', { modo: 'editar', reservaData: reservaSeleccionada });
            });
        });


=======
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
            <p>Fecha: ${reserva.fechaReserva} </p>
            <p>Horario: ${reserva.horaReserva}</p>
            <p>Descripcion: ${reserva.nota}</p>
            <p>Mesa: ${reserva.mesaId}</p>
            <div class="grupo-botones">
                <button id="modificar-reserva"> Modificar</button>
                <div class = grupo-botones></div>
                <button id="eliminar-reserva"> Eliminar<i class="bi bi-trash"></i> </button>
                
            </div>
        </article>
        `). join("");


        // Agregar manejadores de eventos para los botones de eliminar reserva
        const botonesEliminar = contenedor.querySelectorAll('#eliminar-reserva');
        
>>>>>>> main

    }
    catch (err) {
        contenedor.innerHTML = `<p style="color:red">Error cargando mesas</p>`;
        console.error(err);
    }
}

