// src/modules/admin/crear-plato/platosServices.js

// metodo para crear plato y obtener la categoria desde la base de datos
export async function crearPlato(data) {
    const API_URL = "http://localhost:8080/api/platos";

    const categoriaIdNumerico = parseInt(data.categoria);
    const precioPlatoNumerico = parseFloat(data.precio);

    const platoRequerido = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        categoriaId: categoriaIdNumerico,
        precio: precioPlatoNumerico,
    };

    const platoJson = JSON.stringify(platoRequerido);

    try {
        const formData = new FormData();
        formData.append('plato', platoJson);
        formData.append('imagen', data.imagen);

        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('❌ Error del servidor:', errorData);
            throw new Error(`Error en la API: ${response.status} ${response.statusText}`);
        }

        console.log('📤 Enviando datos a la API (JSON y archivo)');
        const responseData = await response.json();
        return responseData;

    } catch (error) {
        console.error('❌ Error al crear el plato:', error);
        throw new Error('Error al crear el plato: ' + error.message);
    }
}

// Exportar también la función de obtener categorías si prefieres tener todo en un archivo
export { obtenerCategorias } from './categoriaService.js';