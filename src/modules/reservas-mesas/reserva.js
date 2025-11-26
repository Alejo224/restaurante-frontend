
import { obtenerMesas } from "/src/modules/Mesa/mesaService.js";
import { obtenerHorarioDisponible } from "./reservacionServices";
import { crearReserva } from "./reservacionServices";





export async function cargarMesas(contenedor, fecha, hora) {


    if (!contenedor) {
        console.error('El contenedor de mesas no fue encontrado. ')
        return
    }

    contenedor.innerHTML = `<p>Cargando mesas...</p>`;
    try {
        const mesas = await obtenerMesas();

        contenedor.innerHTML = mesas
            .map(mesa => `
                    <div class="mesa ${mesa.estado ? 'disponible' : 'ocupada'}" 
                         data-id="${mesa.id}">
                        <span class="numero"> ${mesa.nombreMesa}</span>
<<<<<<< HEAD
                         <i class="material-symbols-outlined">dine_lamp</i>
=======
                        <i class="bi bi-shop"></i>
>>>>>>> main
                        <span class="capacidad">Capacidad: ${mesa.capacidad}</span>

                        <span class="estado ${mesa.estado ? 'verde' : 'rojo'}">
                            ${mesa.estado ? 'Disponible' : 'No disponible'}
                        </span>
                    </div>
                `)
            .join("");
    } catch (err) {
        contenedor.innerHTML = `<p style="color:red">Error cargando mesas</p>`;
        console.error(err);
    }
}


export async function ObtenerHorarios(selectElemento) {

    // Llamamos a la API
    const horarios = await obtenerHorarioDisponible();

    //limpiamos el selector antes de llamarlo 
    selectElemento.innerHTML = "";
    //Agrega la opción por defecto (Selecciona una hora)
    selectElemento.innerHTML = '<option value="" disabled selected> Seleciona una hora </option>';

    //Añademos las horas opcionales

    horarios.forEach(horario => {
        const opcion = document.createElement('option');//toca poner option ya que si pongo opcion como yo pensaba no va coger ya que los navegadores son muy estrictos 
        opcion.value = horario.hora;
        opcion.textContent = horario.hora;
        selectElemento.appendChild(opcion);
    });

}

export async function crearReservaCliente({ fechaReserva, horaReserva, mesaId, nota }) {
    const reservaData = {
        fechaReserva, horaReserva, mesaId, nota
    }

    if (!fechaReserva || !horaReserva || !mesaId) {
        alert("Todos los campos son obligatorios");
        return null;
    }
    try {
        const reservaCreada = await crearReserva(reservaData);
        return reservaCreada;

    } catch (error) {
        console.error("Error al crear la reserva:", error);
        throw error;
    }

}

