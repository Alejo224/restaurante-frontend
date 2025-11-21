import { getCurrentUser } from "../auth/userService";

const API_BASE_URL = 'http://localhost:8080';

//Funcion para llamar la api 
export async function infoReservas() {

    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token 

    if (!token) {
        alert("error token invalido");
        return [];
    }

    const fetchOpciones = {
        method: 'GET', //Usamos el get como en el postman para obtener los datos
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/reserva/mis-reservas`, fetchOpciones)

        if (!response.ok) {
            // Se maneja  errores si la respuesta HTTP no es exitosa (ej: 401, 404, 500)
            throw new Error(`Error al obtener las reservaciones (${response.status}-${response.statusText})`);
        }
        const data = await response.json();
        //la data es la lista de objetos configuracion de reservas 
        return data;
    } catch (error) {

        console.error("Error en la llamda al APi de reservas", error);
        return []; //Devolvemos la lista vacia 
    }
}

export async function eliminarReserva(reservaId) {
    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token

    if (!token) {
        console.log("error token invalido");
        return [];
    }


    try {
        const response = await fetch(`${API_BASE_URL}/api/reserva/${reservaId}`, {
            method: 'DELETE', //Usamos el DELETE como en el postman para eliminar la reserva
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar la reserva (${response.status}-${response.statusText})`);
        }

        if(response.status === 204){
            return { message: 'Reserva eliminada con exito' };
        }
         // Solo intenta leer JSON si tiene contenido
        const text = await response.text();
        return text ? JSON.parse(text) : { success: true };

    } catch (error) {
        console.error("Error en la llamada al API para eliminar la reserva", error);
        return null; // Devolvemos null en caso de error
    }
}

export async function ActualizarReserva(ReservaId, contenidoActualizado) {

    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token

    if (!token) {
        console.log("error token invalido");
        return [];
    }
    try {
        const response = await fetch(`${API_BASE_URL}/api/reserva/${ReservaId}`, {

            method: 'PUT', //Usamos el PUT como en el postman para actualizar la reserva
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(contenidoActualizado)
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la reserva (${response.status}-${response.statusText})`);
            return await response.json();
        }

    } catch (error) {
        console.error("Error en la llamada al API para actualizar la reserva", error);
        return null; // Devolvemos null en caso de error
    }
}