
const recogerRestaurante = document.getElementById('recoger-restaurante');
const entregaDomicilio = document.getElementById('entrega-domicilio');
const direccionEntrega = document.getElementById('direccion');
const telefonoContacto = document.getElementById('telefono');
const btnIconoSalir = document.getElementById("icono-salir");




btnIconoSalir.addEventListener('click', () => {
   
});


recogerRestaurante.addEventListener('change', suspenderBotones);
entregaDomicilio.addEventListener('change', suspenderBotones);


/*function suspenderBotones() {
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
}*/
function suspenderBotones(){
    const campos ={
        //objeto con los campos del formulario
        domicilio : {
            radio : entregaDomicilio,
            campos:[direccionEntrega]
        },

        recoger:{
            radio: recogerRestaurante,
            campos:[]
        }
    };

    //Funcion auxiliar para habilitar/deshabilitar campos 
    const toggleCampos = (elementos, deshabilitar)=>{ 
        elementos.forEach(elemento => {
            elemento.disabled = deshabilitar;
        });
    };
     // Resetear todo a habilitado primero
    Object.values(campos).forEach(tipo => {
        tipo.radio.disabled = false;
        toggleCampos(tipo.campos, false);
    });

    // Aplicar lógica según selección
    if (campos.recoger.radio.checked) {
        campos.domicilio.radio.disabled = true;
        toggleCampos(campos.domicilio.campos, true);
    } else if (campos.domicilio.radio.checked) {
        campos.recoger.radio.disabled = true;
    }
}
