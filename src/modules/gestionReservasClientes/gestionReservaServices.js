import { getCurrentUser } from "../auth/userService";
const API_BASE_URL = 'http://localhost:8080';

//Funcion para llamar la api 
export async function infoReservas() {

    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token 

    if(!token){
        alert("error token invalido");
        return[]; 
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