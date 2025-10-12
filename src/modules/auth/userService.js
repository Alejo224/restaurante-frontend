// src/services/userService.js
export async function registerUser(data) {
  const API_URL = 'http://localhost:8080/api/usuarios/register';

  try {
    console.log('🌐 Enviando POST a:', API_URL);
    console.log('📦 Payload:', data);

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    console.log('📨 Status de respuesta:', response.status);
    console.log('📨 Content-Type:', response.headers.get('content-type'));

    if (!response.ok) {
      let errorMessage = 'Error desconocido en el registro';
      let errorFields = {};
      
      // Verificar el tipo de contenido
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');
      
      if (isJson) {
        // CASO 1: Respuesta en JSON (nueva estructura con errores de validación)
        try {
          const errorData = await response.json();
          console.error('📩 Error JSON de la API:', errorData);

          // Manejar estructura con errores por campo
          if (errorData?.errors && typeof errorData.errors === 'object') {
            errorFields = errorData.errors;
            // Crear mensaje general con todos los errores
            const errorMessages = Object.values(errorData.errors);
            errorMessage = errorMessages.join(', ');
          } 
          // Manejar mensaje simple en JSON
          else if (errorData?.message) {
            errorMessage = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMessage = errorData;
          }

        } catch (parseError) {
          console.warn('⚠️ Error parseando JSON:', parseError);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      } else {
        // CASO 2: Respuesta en texto plano (errores simples como "El email ya está registrado")
        try {
          const errorText = await response.text();
          console.error('📩 Error texto de la API:', errorText);
          errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
        } catch (textError) {
          console.warn('⚠️ Error leyendo texto:', textError);
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
      }

      // Crear error personalizado con toda la información
      const customError = new Error(errorMessage);
      if (Object.keys(errorFields).length > 0) {
        customError.fields = errorFields;
      }
      customError.isJsonError = isJson;
      
      throw customError;
    }

    const result = await response.json();
    console.log('Registro exitoso:', result);
    return result;
    
  } catch (error) {
    console.error('Error en registerUser:', error);
    throw error;
  }
}