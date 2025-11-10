// src/modules/admin/components/MesasList.js
export function MesasList() {
    const listaMesas = document.getElementById("listaMesas");
    const crearMesaBtn = document.getElementById("crearMesaBtn");
    // Agregamos el botón de Actualizar que definimos en el HTML
    const actualizarMesasBtn = document.getElementById("actualizarMesasBtn"); 

    // Función para obtener la capacidad y estado, si son booleanos o números
    function formatBoolean(value) {
        // En la imagen, el estado se ve como 'true' o 'False' (texto plano)
        return value ? "true" : "False";
    }

    // Omitimos getClaseEstado ya que la tarjeta es muy simple, pero la mantenemos por si el backend aún usa estados de texto
    function getClaseEstado(estado) {
        switch (estado.toUpperCase()) {
            case "DISPONIBLE": return "text-success"; // Color de texto ligero
            case "OCUPADA": return "text-danger";
            case "RESERVADA": return "text-warning";
            case "FUERA_DE_SERVICIO": return "text-secondary";
            default: return "text-dark";
        }
    }

    // --- Cargar mesas desde el backend (FUNCIÓN MODIFICADA)
    async function cargarMesas() {
        try {
            // ... (Lógica de fetch se mantiene igual)
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/mesas", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const mesas = await res.json();
            
            // Si el backend devuelve estados como strings ("DISPONIBLE", "OCUPADA", etc.), 
            // simulamos el true/false de la imagen con la lógica que ya tienes:
            const mesasConEstadoSimple = mesas.map(mesa => ({
                ...mesa,
                // Simulación del booleano para el texto "Estado"
                estadoSimple: mesa.estado === "DISPONIBLE" || mesa.estado === "RESERVADA" 
                    ? "true" 
                    : "False", // Ocupada o fuera de servicio = False
                
                // Determinamos el color de borde (azul brillante para "true", gris/claro para "false")
                cardColorClass: mesa.estado === "DISPONIBLE" || mesa.estado === "RESERVADA" 
                    ? "border-primary bg-light" // Color de borde/fondo similar a las "activas" en la imagen
                    : "border-light bg-light" // Color de borde/fondo para las "inactivas"
            }));

            listaMesas.innerHTML = "";
            listaMesas.className = "row g-4"; // Clases para la cuadrícula

            mesasConEstadoSimple.forEach(mesa => {
                const colDiv = document.createElement("div");
                // Ajustamos el tamaño para que se parezcan más a la imagen
                colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2"; 

                // --- Generamos el HTML de la tarjeta SIMPLE
                colDiv.innerHTML = `
                    <div class="p-3 border rounded-3 h-100 shadow-sm **${mesa.cardColorClass}**">
                        <h4 class="text-primary mb-1">${mesa.nombreMesa || `Mesa #${mesa.id}`}</h4>
                        <p class="mb-1">Capacidad: **${mesa.capacidad || 'N/A'}**</p>
                        <p class="mb-0">Estado: **${mesa.estadoSimple}**</p>
                    </div>
                `;

                listaMesas.appendChild(colDiv);
            });

        } catch (err) {
            console.error(err);
            listaMesas.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center" role="alert">
                        ❌ Error al cargar mesas. Por favor, verifica la conexión con el servidor.
                    </div>
                </div>
            `;
            listaMesas.className = "row g-4";
        }
    }
    // --- Fin de cargarMesas()

    // Eventos de botones (mantienen la misma lógica)
    /*if (crearMesaBtn) {
        crearMesaBtn.addEventListener("click", () => {
            alert("Aquí puedes abrir tu formulario para crear una nueva mesa");
        });
    }*/

    if (actualizarMesasBtn) {
        actualizarMesasBtn.addEventListener("click", cargarMesas);
    }

    // Carga inicial
    cargarMesas();
    
    // Si necesitas exponer cargarMesas para que el HTML la use directamente:
    // return { cargarMesas: cargarMesas }; 
}