// src/modules/admin/components/MesasList.js
export function MesasList() {
    const listaMesas = document.getElementById("listaMesas");
    const crearMesaBtn = document.getElementById("crearMesaBtn");

    // Colores y clases de Bootstrap según estado (MANTENEMOS ESTA FUNCIÓN)
    function getClaseEstado(estado) {
        switch (estado.toUpperCase()) {
            case "DISPONIBLE": return "bg-success text-white";
            case "OCUPADA": return "bg-danger text-white";
            case "RESERVADA": return "bg-warning text-dark";
            case "FUERA_DE_SERVICIO": return "bg-secondary text-white";
            default: return "bg-light text-dark";
        }
    }

    // Cargar mesas desde el backend (FUNCIÓN MODIFICADA)
    async function cargarMesas() {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch("http://localhost:8080/api/mesas", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const mesas = await res.json();

            listaMesas.innerHTML = "";
            listaMesas.className = "row g-4"; // Añadimos clases de Bootstrap para la cuadrícula

            mesas.forEach(mesa => {
                // Creamos el div que será la tarjeta de la mesa
                const colDiv = document.createElement("div");
                colDiv.className = "col-12 col-sm-6 col-md-4 col-lg-3"; // Define el tamaño de la tarjeta en la cuadrícula

                // Definimos el texto del botón según el estado
                let btnText = "Cambiar Estado";
                if (mesa.estado === "DISPONIBLE") {
                    btnText = "Ocupar Mesa";
                } else if (mesa.estado === "OCUPADA") {
                    btnText = "Liberar Mesa";
                }

                // Usamos el estado para darle un color de borde a la tarjeta (CUSTOM CSS NECESARIO)
                const cardBorderClass = mesa.estado === "DISPONIBLE" ? "border-success" : (mesa.estado === "OCUPADA" ? "border-danger" : "border-warning");

                // Generamos el HTML de la tarjeta con clases de Bootstrap (card)
                colDiv.innerHTML = `
                    <div class="card h-100 shadow-sm **${cardBorderClass}** border-2" style="border-left-width: 5px !important;">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start mb-3">
                                <h5 class="card-title mb-0">**${mesa.nombreMesa}**</h5>
                                <span class="badge ${getClaseEstado(mesa.estado)} fs-6 p-2">${mesa.estado}</span>
                            </div>
                            <p class="card-text text-muted">Capacidad: **${mesa.capacidad || 'N/A'}** personas</p>
                        </div>
                        <div class="card-footer bg-white border-0 pt-0">
                            <select class="form-select form-select-sm" data-mesa-id="${mesa.id}">
                                <option value="" disabled>Cambiar a...</option>
                                <option value="DISPONIBLE" ${mesa.estado === "DISPONIBLE" ? "selected" : ""}>Disponible</option>
                                <option value="OCUPADA" ${mesa.estado === "OCUPADA" ? "selected" : ""}>Ocupada</option>
                                <option value="RESERVADA" ${mesa.estado === "RESERVADA" ? "selected" : ""}>Reservada</option>
                                <option value="FUERA_DE_SERVICIO" ${mesa.estado === "FUERA_DE_SERVICIO" ? "selected" : ""}>Fuera de servicio</option>
                            </select>
                        </div>
                    </div>
                `;

                // Agregamos el event listener al nuevo select (el mismo código que ya tenías)
                const select = colDiv.querySelector("select");
                select.addEventListener("change", async () => {
                    try {
                        const nuevoEstado = select.value;
                        const respuesta = await fetch(`http://localhost:8080/api/mesas/${mesa.id}/estado`, {
                            method: "PUT",
                            headers: { 
                                "Content-Type": "application/json",
                                "Authorization": `Bearer ${token}`
                            },
                            body: JSON.stringify({ estado: nuevoEstado })
                        });

                        if (!respuesta.ok) throw new Error("Error al actualizar");

                        // 1. Encuentra la insignia de estado y la tarjeta
                        const badge = colDiv.querySelector(".badge");
                        const card = colDiv.querySelector(".card");

                        // 2. Actualiza el texto y las clases de la insignia
                        badge.textContent = nuevoEstado;
                        badge.className = `badge ${getClaseEstado(nuevoEstado)} fs-6 p-2`;
                        
                        // 3. Actualiza la clase de borde de la tarjeta
                        card.classList.remove("border-success", "border-danger", "border-warning");
                        const newCardBorderClass = nuevoEstado === "DISPONIBLE" ? "border-success" : (nuevoEstado === "OCUPADA" ? "border-danger" : "border-warning");
                        card.classList.add(newCardBorderClass);
                        
                    } catch (err) {
                        console.error(err);
                        alert("No se pudo actualizar el estado");
                    }
                });

                listaMesas.appendChild(colDiv);
            });

        } catch (err) {
            console.error(err);
            // Mensaje de error mejorado para el nuevo layout
            listaMesas.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger text-center" role="alert">
                        ❌ Error al cargar mesas. Por favor, verifica la conexión con el servidor.
                    </div>
                </div>
            `;
            listaMesas.className = "row g-4"; // Aseguramos que mantenga la clase de fila
        }
    }

    // ... (El resto de tu código de inicialización se mantiene igual)
    crearMesaBtn.addEventListener("click", () => {
        alert("Aquí puedes abrir tu formulario para crear una nueva mesa");
    });

    cargarMesas();
}
