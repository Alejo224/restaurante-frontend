const inputReservadoMesa = document.getElementById('reservado-mesa'); 
const iconoVolver = document.getElementById('icono-volver');
const tarjeta = document.getElementById('tarjeta');


inputReservadoMesa.addEventListener('change', () => {
    tarjeta.classList.toggle('girada', inputReservadoMesa.checked);
});

iconoVolver.addEventListener('click', () => {
    tarjeta.classList.remove('girada');
});
