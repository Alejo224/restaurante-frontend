const inputReservadoMesa = document.getElementById('reservado-mesa');
const iconoVolver = document.getElementById('icono-volver');
const tarjeta = document.getElementById('tarjeta');
const recogerRestaurante = document.getElementById('recoger-restaurante');
const entregaDomicilio = document.getElementById('entrega-domicilio');
const reservadoMesa = document.getElementById('reservado-mesa');
const direccionEntrega = document.getElementById('direccion');
const telefonoContacto = document.getElementById('telefono');

inputReservadoMesa.addEventListener('change', () => {
    tarjeta.classList.toggle('girada', inputReservadoMesa.checked);
});

iconoVolver.addEventListener('click', () => {
    tarjeta.classList.remove('girada');
});



    

function suspenderBotones() {
    if (recogerRestaurante.checked) {

        entregaDomicilio.disabled = true;
        reservadoMesa.disabled = true;

        direccionEntrega.disabled = true;
        telefonoContacto.disabled = true;   
    }
    else if (entregaDomicilio.checked) {

        recogerRestaurante.disabled = true;
        reservadoMesa.disabled = true; 
    }


    else{
        entregaDomicilio.disabled = false;
        reservadoMesa.disabled = false;
        recogerRestaurante.disabled = false;
        direccionEntrega.disabled = false;
        telefonoContacto.disabled = false;  
    }
}
recogerRestaurante.addEventListener('change',suspenderBotones);
entregaDomicilio.addEventListener('change',suspenderBotones);
reservadoMesa.addEventListener('change',suspenderBotones);