// pago-service.js - VERSIÓN SIMPLIFICADA

// Estado de la aplicación
const appState = {
  currentOrder: null,
  isLoading: false,
};

// Función para obtener token
function getToken() {
  return localStorage.getItem("user_token");
}

// Función principal de inicialización
async function inicializarPagina() {
  console.log("🚀 Inicializando página de pago simplificada...");

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const pedidoId = urlParams.get("pedidoId") || urlParams.get("orderId");

    if (!pedidoId) {
      throw new Error("No se encontró el ID del pedido en la URL");
    }

    console.log("📦 Cargando pedido:", pedidoId);

    // Cargar datos del pedido
    await cargarDatosPedido(pedidoId);

    // Configurar event listeners
    configurarEventListeners();
  } catch (error) {
    console.error("❌ Error inicializando página:", error);
    mostrarError("Error al cargar la página: " + error.message);
  }
}

// Función para cargar datos del pedido
async function cargarDatosPedido(pedidoId) {
  console.log("🔄 Cargando datos del pedido...");
  mostrarLoading(true);

  try {
    const token = getToken();

    const response = await fetch(
      `http://localhost:8080/api/pedidos/${pedidoId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log("📡 Response status:", response.status);

    if (response.ok) {
      const pedido = await response.json();
      console.log("✅ Datos reales cargados");
      appState.currentOrder = pedido;
      actualizarUIconDatosPedido(pedido);
    } else {
      console.warn("⚠️ Response no ok, usando datos mock");
      await usarDatosMock(pedidoId);
    }
  } catch (error) {
    console.warn("⚠️ Error cargando datos reales:", error.message);
    await usarDatosMock(pedidoId);
  }

  mostrarLoading(false);
  mostrarContenidoPrincipal();
}

// Función para usar datos mock
async function usarDatosMock(pedidoId) {
  console.log("🔄 Usando datos mock...");

  const pedidoMock = {
    id: parseInt(pedidoId),
    subtotal: 3200.0,
    iva: 608.0,
    total: 3808.0,
    estadoPedidoEnum: "BORRADOR",
    tipoServicio: "RECOGER_PEDIDO",
    fechaPedido: new Date().toISOString(),
    telefonoContacto: "3247890948",
    detalles: [
      {
        cantidad: 1,
        platoNombre: "Pollo",
        precioUnitario: 3200.0,
        subtotal: 3200.0,
      },
    ],
    usarioEmai: "usuario@ejemplo.com",
  };

  appState.currentOrder = pedidoMock;
  actualizarUIconDatosPedido(pedidoMock);
}

// Función para actualizar la UI
function actualizarUIconDatosPedido(pedido) {
  console.log("🎨 Actualizando UI...");

  document.getElementById("order-id").textContent = pedido.id;
  document.getElementById("order-products").textContent = formatearProductos(
    pedido.detalles,
  );
  document.getElementById("order-subtotal").textContent = formatearMoneda(
    pedido.subtotal,
  );
  document.getElementById("order-tax").textContent = formatearMoneda(
    pedido.iva,
  );
  document.getElementById("order-total").textContent = formatearMoneda(
    pedido.total,
  );

  document.getElementById("button-text").textContent =
    `Pagar $ ${formatearMoneda(pedido.total)}`;

  // Prellenar email si está disponible
  const emailInput = document.getElementById("email");
  console.log(pedido.nombreUsuario);
  console.log(pedido.emailUsuario);

  if (pedido.emailUsuario && !emailInput.value) {
    emailInput.value = pedido.emailUsuario;
  }
}

// Función para configurar event listeners
function configurarEventListeners() {
  const submitButton = document.getElementById("submit-button");
  submitButton.addEventListener("click", manejarPago);

  document
    .getElementById("cancel-button")
    .addEventListener("click", function () {
      if (confirm("¿Estás seguro de que quieres cancelar el pago?")) {
        window.history.back();
      }
    });

  // Permitir enviar con Enter en el campo de email
  document.getElementById("email").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      manejarPago();
    }
  });
}

// Función simplificada para manejar el pago
async function manejarPago() {
  console.log("🔄 Iniciando proceso de pago simplificado...");

  if (!validarFormulario()) {
    return;
  }

  setLoadingState(true);

  try {
    const customerEmail = document.getElementById("email").value;
    console.log("📧 Email del cliente:", customerEmail);

    // Crear sesión de pago directamente
    await crearSesionPago(customerEmail);
  } catch (error) {
    console.error("❌ Error procesando pago:", error);
    mostrarErrorFormulario(error.message);
    setLoadingState(false);
  }
}

// Función para crear sesión de pago - VERSIÓN CORREGIDA
async function crearSesionPago(customerEmail) {
  try {
    const token = getToken();
    const pedido = appState.currentOrder;

    console.log("💰 Creando sesión para pedido:", pedido.id);

    const response = await fetch(
      "http://localhost:8080/api/pagos/crear-sesion-pedido-existente",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          pedidoId: pedido.id,
          customerEmail: customerEmail,
        }),
      },
    );

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const sessionData = await response.json();
    console.log("📨 Datos recibidos:", sessionData);

    // CORRECCIÓN: Tu backend intercambia los valores
    // sessionId contiene la URL, checkoutUrl contiene el sessionId real
    const sessionIdReal = sessionData.checkoutUrl; // Este es el sessionId real
    const checkoutUrlReal = sessionData.sessionId; // Esta es la URL real

    console.log("🔄 Valores corregidos:");
    console.log("  sessionId real:", sessionIdReal);
    console.log("  checkoutUrl real:", checkoutUrlReal);

    // Usar la URL de checkout directamente
    if (
      checkoutUrlReal &&
      checkoutUrlReal.startsWith("https://checkout.stripe.com")
    ) {
      console.log("🔗 Redirigiendo a checkoutUrl real");
      window.location.href = checkoutUrlReal;
    }
    // O construir la URL desde el sessionId real
    else if (sessionIdReal && sessionIdReal.startsWith("cs_")) {
      console.log("🔗 Construyendo URL desde sessionId real");
      const urlConstruida = `https://checkout.stripe.com/c/pay/${sessionIdReal}`;
      window.location.href = urlConstruida;
    } else {
      throw new Error("No se pudo determinar la URL de pago");
    }
  } catch (error) {
    console.error("❌ Error en crearSesionPago:", error);
    throw new Error("Error al procesar el pago: " + error.message);
  }
}
// Funciones de utilidad
function validarFormulario() {
  const email = document.getElementById("email");

  if (!email.value.trim() || !email.validity.valid) {
    mostrarErrorFormulario("Por favor ingrese un correo electrónico válido");
    email.focus();
    return false;
  }

  ocultarErrorFormulario();
  return true;
}

function setLoadingState(loading) {
  appState.isLoading = loading;
  const submitButton = document.getElementById("submit-button");
  const buttonText = document.getElementById("button-text");
  const buttonSpinner = document.getElementById("button-spinner");

  submitButton.disabled = loading;

  if (loading) {
    buttonText.textContent = "Procesando...";
    buttonSpinner.classList.remove("d-none");
  } else {
    buttonText.textContent = `Pagar $ ${formatearMoneda(appState.currentOrder.total)}`;
    buttonSpinner.classList.add("d-none");
  }
}

function mostrarErrorFormulario(mensaje) {
  const errorElement = document.getElementById("form-errors");
  errorElement.textContent = mensaje;
  errorElement.classList.remove("d-none");
}

function ocultarErrorFormulario() {
  const errorElement = document.getElementById("form-errors");
  errorElement.classList.add("d-none");
  errorElement.textContent = "";
}

function formatearMoneda(monto) {
  return new Intl.NumberFormat("es-CO", {
    minimumFractionDigits: 2,
  }).format(monto || 0);
}

function formatearProductos(detalles) {
  if (!detalles || !Array.isArray(detalles)) return "No especificado";
  return detalles
    .map((d) => `${d.cantidad || 1}x ${d.platoNombre || "Producto"}`)
    .join(", ");
}

function mostrarLoading(mostrar) {
  const loadingElement = document.getElementById("loading-state");
  if (loadingElement) {
    if (mostrar) {
      loadingElement.classList.remove("d-none");
    } else {
      loadingElement.classList.add("d-none");
    }
  }
}

function mostrarContenidoPrincipal() {
  document.getElementById("order-info-section").classList.remove("d-none");
  document.getElementById("payment-form-container").classList.remove("d-none");
}

function mostrarError(mensaje) {
  mostrarLoading(false);
  const errorElement = document.getElementById("error-state");
  const errorMessage = document.getElementById("error-message");

  errorMessage.textContent = mensaje;
  errorElement.classList.remove("d-none");
}

function volverAlHistorial() {
  window.location.href = "historial-pedidos.html";
}

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", inicializarPagina);

