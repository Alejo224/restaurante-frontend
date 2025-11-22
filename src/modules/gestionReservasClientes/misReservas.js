import { informacionReservas } from "./reservacion.js";

export function seccionMisReservas() {

    const misReservaspage = document.createElement('div');
    misReservaspage.classList.add('mis-reservas');
    misReservaspage.innerHTML = ` 
    
    <section>
        <h1>Mis reservas</h1>
        <h2>Gestiona tus reservas de mesa</h2>
        <div id= "contenedor-mis-reservas">
         <p>Cargando mis reservas...</p>
        </div>

      
    </section>
`;


   const contenedorMisReservas = misReservaspage.querySelector('#contenedor-mis-reservas');
   informacionReservas(contenedorMisReservas);

    return misReservaspage;

}