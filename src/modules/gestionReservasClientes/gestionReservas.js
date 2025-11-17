import { obtenesInformacionReservacion } from "./gestionReservasServices";

export async function informacionReservas(contenedor,fecha, hora, idMesa, descripcion) {
    
    if(!contenedor){
        console.log('Error el contenedor no fue encontrado. ')
        return
    }

    contenedor.innerHTML = <p>cargando reservaciones....</p>
    try{
        const reservas = await obtenesInformacionReservacion();
        
    }
    catch(err){
        contenedor.innerHTML = `<p style="color:red">Error cargando mesas</p>`;
        console.error(err);
    }
}

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
                        <i class="bi bi-shop"></i>
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