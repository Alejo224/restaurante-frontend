// src/modules/admin/components/MesasList.js
export function MesasList() {
  const listaMesas = document.getElementById("listaMesas");
  const crearMesaBtn = document.getElementById("crearMesaBtn");

  // Colores según estado
  function getClaseEstado(estado) {
    switch (estado.toUpperCase()) {
      case "DISPONIBLE": return "bg-success text-white";
      case "OCUPADA": return "bg-danger text-white";
      case "RESERVADA": return "bg-warning text-dark";
      case "FUERA_DE_SERVICIO": return "bg-secondary text-white";
      default: return "bg-light text-dark";
    }
  }

  // Cargar mesas desde el backend
  async function cargarMesas() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/mesas", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const mesas = await res.json();

      listaMesas.innerHTML = "";

      mesas.forEach(mesa => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
          <td>${mesa.nombreMesa}</td>
          <td>
            <span class="badge ${getClaseEstado(mesa.estado)}">${mesa.estado}</span>
          </td>
          <td>
            <select class="form-select form-select-sm">
              <option value="DISPONIBLE" ${mesa.estado === "DISPONIBLE" ? "selected" : ""}>Disponible</option>
              <option value="OCUPADA" ${mesa.estado === "OCUPADA" ? "selected" : ""}>Ocupada</option>
              <option value="RESERVADA" ${mesa.estado === "RESERVADA" ? "selected" : ""}>Reservada</option>
              <option value="FUERA_DE_SERVICIO" ${mesa.estado === "FUERA_DE_SERVICIO" ? "selected" : ""}>Fuera de servicio</option>
            </select>
          </td>
        `;

        // Cambiar estado
        const select = fila.querySelector("select");
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

            // Actualiza la etiqueta de estado
            fila.querySelector("span").textContent = nuevoEstado;
            fila.querySelector("span").className = `badge ${getClaseEstado(nuevoEstado)}`;

          } catch (err) {
            console.error(err);
            alert("No se pudo actualizar el estado");
          }
        });

        listaMesas.appendChild(fila);
      });

    } catch (err) {
      console.error(err);
      listaMesas.innerHTML = `
        <tr><td colspan="3" class="text-center text-danger">Error al cargar mesas ❌</td></tr>
      `;
    }
  }

  // Botón crear mesa
  crearMesaBtn.addEventListener("click", () => {
    alert("Aquí puedes abrir tu formulario para crear una nueva mesa");
  });

  // Inicializa
  cargarMesas();
}
