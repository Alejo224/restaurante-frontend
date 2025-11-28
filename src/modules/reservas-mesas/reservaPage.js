import { router } from "../../router.js"
import { cargarMesas } from "./reserva.js"
import { ObtenerHorarios } from "./reserva.js";
import { crearReservaCliente } from "./reserva.js";
import { MesasOcupadas } from "./reservacionServices.js";
import { ActualizarReserva } from "../gestionReservasClientes/gestionReservaServices.js";
import { servicioNotificaciones } from "../../shared/services/toastService.js";


export function ReservaMesaPagina(modo, reservaData = null) {

    // Mantener el id de la mesa en el scope del componente para evitar
    // que persista entre diferentes vistas/instancias de la página.
    let mesaSeleccionadaId = null;

    const reservaPage = document.createElement('div');
    reservaPage.classList.add('container');

    //Creamos el componente del html 
    reservaPage.innerHTML = `
        <div class="reserva-mesa">  
        <form id="form-reserva">
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
   

    if (modo === 'editar' && reservaData) {
        fechaInput.value = reservaData.fechaReserva;
        notaText.value = reservaData.nota;
    }

    // establecer fecha mínima (hoy) para evitar seleccionar días pasados
    fechaInput.min = getTodayIso();

    // Validar fecha/hora cuando cambian para dar feedback temprano
    fechaInput.addEventListener('input', () => {
        // limpiar selección de mesa al cambiar fecha
        mesaSeleccionadaId = null;
        actualizarMesa();
    });
    selectHora.addEventListener('change', () => {
        // cuando cambia la hora, comprobar si coincide con el pasado
        const fecha = fechaInput.value;
        const hora = selectHora.value;
        const check = validarFechaHora(fecha, hora);
        if (!check.valido) {
            toastService.warning(check.mensaje);
            // opcional: resetear la hora seleccionada
            selectHora.value = "";
        }
        actualizarMesa();
    });



    // Actualizar mesas al cambiar fecha u hora
    fechaInput.addEventListener('change', actualizarMesa);
    selectHora.addEventListener('change', actualizarMesa);



    //cargar mesas iniciales 
    cargarMesas(contenedorMesas).then(() => {
        activarSeleccionMesas();
        if (modo === 'editar' && reservaData) {
            const mesas = contenedorMesas.querySelectorAll('.mesa');
            mesas.forEach(mesa => {
                if (Number(mesa.dataset.id) === reservaData.mesa.id) {
                    mesa.classList.add('seleccionada');// Marcar la mesa como seleccionada
                    mesaSeleccionadaId = reservaData.mesa.id; // Guardar ID de la mesa seleccionada
                }
            });
            // Actualizar mesas ocupadas después de establecer la hora
            actualizarMesa();
        } else {
            // Modo creación: asegurarse que no queden mesas seleccionadas
            const mesas = contenedorMesas.querySelectorAll('.mesa');
            mesas.forEach(m => m.classList.remove('seleccionada'));
            mesaSeleccionadaId = null;
        }
    });

    //cargar horarios 
    ObtenerHorarios(selectHora);
    if (modo === 'editar' && reservaData) {
        setTimeout(() => {
            selectHora.value = reservaData.horaReserva;
        }, (50));
        // Actualizar mesas ocupadas después de establecer la hora
        actualizarMesa();
    }

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

        // validar fecha y hora antes de enviar
        const validacion = validarFechaHora(fechaReserva, horaDeReserva);
        if (!validacion.valido) {
            servicioNotificaciones.advertencia(validacion.mensaje);
            return;
        }

        if (mesaSeleccionadaId == null) {
            servicioNotificaciones.advertencia('Por favor seleccione una mesa.');
            return;
        }

        const reservaDatos = {
            fechaReserva: fechaReserva,
            horaReserva: horaDeReserva,
            mesaId: mesaSeleccionadaId,
            nota: nota_Text
        };
        try {

            let respuesta;

            if (modo === 'editar' && reservaData) {
                // Actualizar reserva existente
                respuesta = await ActualizarReserva(reservaData.id, reservaDatos);
            }
            else {
                // Crear nueva reserva
                respuesta = await crearReservaCliente(reservaDatos);
            }

            // Si el backend devuelve null o un objeto vacío, considerarlo error
            if (!respuesta || Object.keys(respuesta).length === 0) {
                servicioNotificaciones.error("No se pudo crear la reserva.");
                return;
            }

            // Guardar en localStorage una marca de la reserva actualizada (para sincronizar UI)
            if (modo === 'editar' && reservaData) {
                try {
                    const marker = {
                        fechaReserva: reservaDatos.fechaReserva,
                        horaReserva: reservaDatos.horaReserva,
                        mesaId: reservaDatos.mesaId,
                        updatedAt: Date.now()
                    };
                    localStorage.setItem('ultimaReservaActualizada', JSON.stringify(marker));
                    // also dispatch a custom event so other views can react immediately
                    window.dispatchEvent(new CustomEvent('reserva:actualizada', { detail: marker }));
                } catch (e) {
                    console.warn('No se pudo guardar marca de reserva actualizada', e);
                }
            }

            servicioNotificaciones.exito("Reserva realizada exitosamente.");
            router.navigate('/dashboard');

        } catch (error) {
            console.error("Error al crear la reserva:", error);
            //toastService.error("No se pudo crear la reserva.");
        }
        console.log("📦 Datos enviados al backend:", reservaDatos);
        console.log("📦 JSON enviado:", JSON.stringify(reservaDatos));

        console.log('Datos enviados a la API');

    });

    //implementamos la funcion para cuando el usuarios escoga la fecha y la hora de una mesa ocupada
    async function actualizarMesa() {
        console.log("Actulizacion de mesas ocupadas...")
        const fecha = fechaInput.value;

        //verificamos que si se seleccione una fecha
        if (!fecha) {
            console.log("Fecha u hora vacía. No consultar backend .");
            return;
        }

        const hora = selectHora.value;

        const mesasOcupadas = await MesasOcupadas(fecha, hora);

        const mesasDOM = contenedorMesas.querySelectorAll('.mesa');

        const idOcupadas = mesasOcupadas.map(reserva => reserva.mesa.id);

        // Aplicar marca local si existe una reserva actualizada recientemente
        try {
            const markerRaw = localStorage.getItem('ultimaReservaActualizada');
            if (markerRaw) {
                const marker = JSON.parse(markerRaw);
                const age = Date.now() - (marker.updatedAt || 0);
                // aplicar sólo si fecha y hora coinciden y la marca no es demasiado antigua (5 minutos)
                if (marker.fechaReserva === fecha && marker.horaReserva === hora && age < 1000 * 60 * 5) {
                    const mid = Number(marker.mesaId);
                    if (!idOcupadas.includes(mid)) {
                        idOcupadas.push(mid);
                    }
                }
            }
        } catch (e) {
            console.warn('No se pudo aplicar marca local de reserva actualizada', e);
        }

        if (modo === 'editar' && reservaData) {
            const idMesaOriginal = reservaData.mesa.id;
            const index = idOcupadas.indexOf(idMesaOriginal);
            if (index !== -1) {
                idOcupadas.splice(index, 1); // Eliminar el ID de la mesa original
            }
        }
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

    // Helper: obtiene fecha de hoy en formato YYYY-MM-DD
    function getTodayIso() {
        const now = new Date();
        const yyyy = now.getFullYear();
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const dd = String(now.getDate()).padStart(2, '0');
        return `${yyyy}-${mm}-${dd}`;
    }

    // Helper: valida que la fecha y hora sean futuras (no en el pasado)
    function validarFechaHora(fecha, hora) {
        if (!fecha) return { valido: false, mensaje: "Seleccione una fecha válida." };
        if (!hora) return { valido: false, mensaje: "Seleccione una hora válida." };

        // Construir fecha completa en formato ISO local
        // selectHora debe tener valores como "14:30"
        const isoString = `${fecha}T${hora}:00`;
        const reservaDate = new Date(isoString);
        const ahora = new Date();

        if (isNaN(reservaDate.getTime())) {
            return { valido: false, mensaje: "Fecha u hora no válida." };
        }

        if (reservaDate <= ahora) {
            return { valido: false, mensaje: "La fecha y hora seleccionadas ya pasaron. Elija una fecha/hora futuras." };
        }

        return { valido: true };
    }

}
