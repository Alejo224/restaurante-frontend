import { getCurrentUser } from "../auth/userService";

const API_BASE_URL = 'http://localhost:8080';

//Funcion para llamar la api 
export async function obtenerHorarioDisponible() {

    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token 

    const fetchOpciones = {
        method: 'GET', //Usamos el get como en el postman para obtener los datos
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/horarios/disponibles`, fetchOpciones)

        if (!response.ok) {
            // Se maneja  errores si la respuesta HTTP no es exitosa (ej: 401, 404, 500)
            throw new Error(`Error al obtener horario ${response.statusText}`);
        }
        const data = await response.json();

        //la data es la lista de objetos configuracion de horarios 
        return data;
    } catch (error) {

        console.error("Error en la llamda al APi de horarios", error);
        return []; //Devolvemos la lista vacia 
    }
}

export async function guardarDatos() {
    const usuario = getCurrentUser();

}

//si algo borrar esto
export async function crearReserva(reservaData) {
    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token 
   

    const fetchOpciones = {
        method: 'POST', //Usamos el POST como en el postman para Crear la reserva
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        //agregamos la propiedad "body"
        body: JSON.stringify(reservaData)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/reserva`, fetchOpciones)

        if (!response.ok) {
            // Se maneja  errores si la respuesta HTTP no es exitosa (ej: 401, 404, 500)
            throw new Error(`Error al crear la reserva ${response.statusText}`);
        }
        const data = await response.json();

        //la data es la lista de objetos configuracion de horarios 
        return data;
    } catch (error) {

        console.error("Error en la llamda al APi de horarios", error);
        return []; //Devolvemos la lista vacia 
    }

}

export async function MesasOcupadas(fecha, hora) {
    const usuario = getCurrentUser();
    const token = usuario?.token

    if(!token){
        console.error("No hay token disponible. No se puede consultar mesas ocupadas.   ")     
    }

    if (!fecha || !hora) {
        console.log("Fecha o hora vacía. No se puede consultar mesas ocupadas.");
        return [];
    }

    const fetchOpciones = {
        method: 'GET', //lo usamos para buscar como en postman
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }

    };

    try {
        const response = await fetch(`${API_BASE_URL}/api/reserva/mesas-ocupadas?fecha=${fecha}&hora=${hora}`, fetchOpciones)

        if (!response.ok) {
            //Se maneja errores si la respuesta htpp no es exitosa (ej: 401, 404, 500)
            throw new Error(`Error al obtener mesas ocupadas ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error en la llamda a la API  de mesas ocupadas", error);
        return [];
    }
}
