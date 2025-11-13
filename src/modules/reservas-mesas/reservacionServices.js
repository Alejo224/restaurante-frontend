import { getCurrentUser } from "../auth/userService";

const API_BASE_URL = 'http://localhost:8080';

//Funcion para llamar la api 
export async function obtenerHorarioDisponible(){

    const usuario = getCurrentUser();
    const token = usuario?.token;//Obtenemos el token 

    const fetchOpciones = {
        method: 'GET', //Usamos el get como en el postman para obtener los datos
        headers:{
            'Authorization':`Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    };

        try {
            const response = await fetch(`${API_BASE_URL}/api/horarios/disponibles`, fetchOpciones)

            if(!response.ok){
                // Se maneja  errores si la respuesta HTTP no es exitosa (ej: 401, 404, 500)
                throw new Error(`Error al obtener horario ${response.statusText}`);
            }
            const data = await response.json();

            //la data es la lista de objetos configuracion de horarios 
            return data;
        } catch (error) {

            console.error("Error en la llamda al APi de horarios", error);
            return[]; //Devolvemos la lista vacia 
        }
}