
const recogerRestaurante = document.getElementById('recoger-restaurante');
const entregaDomicilio = document.getElementById('entrega-domicilio');
const direccionEntrega = document.getElementById('direccion');
const telefonoContacto = document.getElementById('telefono');
const btnIconoSalir = document.getElementById("icono-salir");




btnIconoSalir.addEventListener('click', () => {
   
});


recogerRestaurante.addEventListener('change', suspenderBotones);
entregaDomicilio.addEventListener('change', suspenderBotones);


function suspenderBotones() {
    if (recogerRestaurante.checked) {

        // Deshabilitar las otras dos opciones
        entregaDomicilio.disabled = true;
        // Desactivar los campos de contacto
        direccionEntrega.disabled = true;
        telefonoContacto.disabled = true;
    }
    else if (entregaDomicilio.checked) {
        // Deshabilitar las otras dos opciones
        recogerRestaurante.disabled = true;
    }


    else {
        // Habilitar todas las opciones
        entregaDomicilio.disabled = false;
        recogerRestaurante.disabled = false;
        // Habilitar los campos de contacto
        direccionEntrega.disabled = false;
        telefonoContacto.disabled = false;
    }
}
