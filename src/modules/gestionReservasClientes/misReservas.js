import { informacionReservas } from "./reservacion.js";

export function seccionMisReservas() {

    const misReservaspage = document.createElement('div');
    misReservaspage.classList.add('mis-reservas');
    misReservaspage.innerHTML = ` 
    
    <section class="gestion-mis-reservas">
        <div class="header-mis-reservas">
         <i class="bi bi-arrow-left-circle-fill"></i>
        <h1>Mis reservas</h1>
       </div>
        <span>Gestiona tus reservas de mesa</span>
        <div id= "contenedor-mis-reservas">
         <p>Cargando mis reservas...</p>
        </div>

      
    </section>
`;


    const contenedorMisReservas = misReservaspage.querySelector('#contenedor-mis-reservas');
    informacionReservas(contenedorMisReservas);

    return misReservaspage;

}