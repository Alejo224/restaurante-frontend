export async function crearPlato(data) {
    const API_URL = "http://localhost:8080/api/platos";

    const categoriaIdNUmerico = parseInt(data.categoria); // Asegurarse de que sea un número
    const PrecioPlatoNumerico = parseFloat(data.precio); // Asegurarse de que sea un número decimal

    const PlatoRequerido = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        categoriaId: categoriaIdNUmerico,
        precio: PrecioPlatoNumerico,
    };
    //2. Convertir el obejeto JavaScript a JSON

    const platoJson = JSON.stringify(PlatoRequerido);

    try {
        const formData = new FormData();
        //Cambio clave :agregamos la parte 'plato' (la cadena JSON)
        formData.append('plato', platoJson);
        formData.append('imagen', data.imagen);

        //Enviamos la solicitud con el formmato corregido
        const response = await fetch(API_URL, {
            method: 'POST',
            body: formData // No pongas headers, el navegador los pone automáticamente
        });

        if (!response.ok) {
            //Manejo de errores 
            const errorData = await response.text();
            console.error('❌ Error del servidor:', errorData);
            //lanzamos un error más claro si la respuesta no fue exitosa
            throw new Error('Error en la api:  ${response.status} ${response.statusText}');
        }
        console.log('📤 Enviando datos a la API(JSON y archivo)');
        console.log('🔄 Respuesta de la API:', response);
        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error('❌ Error al crear el plato:', error);
        throw new Error('Error al crear el plato: ' + error.message);
    }
}

//vamos a traer obtener los platos creados

export async function obtenerPlatosPorId(id) {
    //construye la url con el id del plato
    const API_URL = `http://localhost:8080/api/platos/${id}`;

    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error('plato con Id ${id} no encontrado. codigo de estado: ${response.status} ');
        }

        const plato = await response.json();
        return plato; //devolvemos el plato obtenido
    } catch (error) {
        console.error('❌ Error al obtener el plato con ID ${id}:', error);
        throw new Error('Error al obtener el plato: ' + error.message);
    }
}