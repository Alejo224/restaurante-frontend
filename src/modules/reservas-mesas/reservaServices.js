
import { obtenerMesas } from "/src/modules/Mesa/mesaService.js";


export async function cargarMesas(contenedor) {
    

    if(!contenedor){
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
                        <span class="numero">Mesa ${mesa.nombreMesa}</span>
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


