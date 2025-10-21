  export async function crearPlato(data) {
    const API_URL = "http://localhost:8080/api/platos";
  /* try{
        const formData = new FormData();
        formData.append('nombre', data.nombre);
        formData.append('descripcion', data.descripcion);
        formData.append('categoriaId', data.categoria);
        formData.append('precio', data.precio);
        formData.append('imagen', data.imagen);
         const response = await fetch(API_URL, {
            method: 'POST',
            body: formData // No pongas headers, el navegador los pone automáticamente
    });
        console.log('📤 Enviando datos a la API:', data);
        console.log('🔄 Respuesta de la API:', response);
        const responseData = await response.json();
        return responseData;
} catch (error) {
        console.error('❌ Error al crear el plato:', error);
        throw new Error('Error al crear el plato: ' + error.message);
    }
}*/
    const categoriaIdNUmerico = parseInt(data.categoria); // Asegurarse de que sea un número
    const PrecioPlatoNumerico = parseFloat(data.precio); // Asegurarse de que sea un número decimal

    const PlatoRequerido ={
        nombre: data.nombre,
        descripcion: data.descripcion,
        categoriaId: categoriaIdNUmerico,
        precio: PrecioPlatoNumerico,
    };
    //2. Convertir el obejeto JavaScript a JSON

    const platoJson = JSON.stringify(PlatoRequerido);

    try{
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