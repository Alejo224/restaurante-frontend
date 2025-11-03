// src/modules/admin/crear-plato/categoriaService.js

// Metodo para obtner las categorias de platos desde la API
export async function obtenerCategorias() {
    const API_URL = "http://localhost:8080/api/categoriasPlatos";
    
    try {
        console.log('🌐 Obteniendo categorías desde:', API_URL);
        
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const categorias = await response.json();
        console.log('✅ Categorías obtenidas:', categorias);
        return categorias;

    } catch (error) {
        console.error('❌ Error al obtener categorías:', error);
        throw new Error('No se pudieron cargar las categorías: ' + error.message);
    }
}