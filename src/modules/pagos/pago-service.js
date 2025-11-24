// pago-service.js - Versión como módulo

// Si necesitas importar getToken, hazlo así:
// import { getToken } from './ruta/a/userService.js';

// Por ahora, vamos a crear una versión independiente:
import { router } from '../../router.js';
// Configuración de Stripe
const stripe = Stripe('pk_test_51SSpMWBMl2eBm2VAEOOYRWrH3lC3D6XgvCHuNBwSHQI1D5nBx4WBWhrFjkZZjqYJjktv1Wv1aKMbbVnWLVBeRugQ00doTj89aW');
let elements;
let card;

// Estado de la aplicación
const appState = {
    currentOrder: null,
    isLoading: false,
    stripeInitialized: false
};

// Función para obtener token (versión temporal)
function getToken() {
    // Implementación temporal - reemplaza con tu lógica real
    return localStorage.getItem('user_token');
}

// Función principal de inicialización
async function inicializarPagina() {
    console.log('🚀 Inicializando página de pago...');
    
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const pedidoId = urlParams.get('pedidoId') || urlParams.get('orderId');
        
        if (!pedidoId) {
            throw new Error('No se encontró el ID del pedido en la URL');
        }

        console.log('📦 Cargando pedido:', pedidoId);
        
        // Cargar datos del pedido
        await cargarDatosPedido(pedidoId);
        
        // Inicializar Stripe después de cargar los datos
        await inicializarStripe();
        
        // Configurar event listeners
        configurarEventListeners();
        
    } catch (error) {
        console.error('❌ Error inicializando página:', error);
        mostrarError('Error al cargar la página: ' + error.message);
    }
}

// Función para cargar datos del pedido
async function cargarDatosPedido(pedidoId) {
    console.log('🔄 Cargando datos del pedido...');
    mostrarLoading(true);
    
    try {
        const token = getToken();
        console.log('✅ Token obtenido');
        
        const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('📡 Response status:', response.status);

        if (response.ok) {
            const pedido = await response.json();
            console.log('✅ Datos reales cargados');
            appState.currentOrder = pedido;
            actualizarUIconDatosPedido(pedido);
        } else {
            console.warn('⚠️ Response no ok, usando datos mock');
            await usarDatosMock(pedidoId);
        }
        
    } catch (error) {
        console.warn('⚠️ Error cargando datos reales:', error.message);
        await usarDatosMock(pedidoId);
    }
    
    mostrarLoading(false);
    mostrarContenidoPrincipal();
}

// Función para usar datos mock
async function usarDatosMock(pedidoId) {
    console.log('🔄 Usando datos mock...');
    
    const pedidoMock = {
        id: parseInt(pedidoId),
        subtotal: 3200.00,
        iva: 608.00,
        total: 3808.00,
        estadoPedidoEnum: "BORRADOR",
        tipoServicio: "RECOGER_PEDIDO",
        fechaPedido: new Date().toISOString(),
        telefonoContacto: "3247890948",
        detalles: [
            { 
                cantidad: 1, 
                platoNombre: "Pollo",
                precioUnitario: 3200.00,
                subtotal: 3200.00
            }
        ],
        emailUsuario: "usuario@ejemplo.com"
    };
    
    appState.currentOrder = pedidoMock;
    actualizarUIconDatosPedido(pedidoMock);
}

// Función para inicializar Stripe
async function inicializarStripe() {
    try {
        if (appState.stripeInitialized) return;

        console.log('💳 Inicializando Stripe...');
        
        elements = stripe.elements();
        
        const style = {
            base: {
                color: '#32325d',
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': { color: '#aab7c4' }
            },
            invalid: { color: '#fa755a', iconColor: '#fa755a' }
        };
        
        card = elements.create('card', { style, hidePostalCode: true });
        card.mount('#card-element');
        
        card.addEventListener('change', function(event) {
            const displayError = document.getElementById('card-errors');
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });
        
        appState.stripeInitialized = true;
        console.log('✅ Stripe inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error inicializando Stripe:', error);
        throw new Error('Error al inicializar el sistema de pago');
    }
}

// Función para actualizar la UI
function actualizarUIconDatosPedido(pedido) {
    console.log('🎨 Actualizando UI...');
    
    document.getElementById('order-id').textContent = pedido.id;
    document.getElementById('order-products').textContent = formatearProductos(pedido.detalles);
    document.getElementById('order-subtotal').textContent = formatearMoneda(pedido.subtotal);
    document.getElementById('order-tax').textContent = formatearMoneda(pedido.iva);
    document.getElementById('order-total').textContent = formatearMoneda(pedido.total);
    
    document.getElementById('button-text').textContent = `Pagar $ ${formatearMoneda(pedido.total)}`;
    
    const emailInput = document.getElementById('email');
    if (pedido.emailUsuario && !emailInput.value) {
        emailInput.value = pedido.emailUsuario;
    }
}

// Función para configurar event listeners
function configurarEventListeners() {
    const form = document.getElementById('payment-form');
    form.addEventListener('submit', manejarEnvioFormulario);
    
    document.getElementById('cancel-button').addEventListener('click', function() {
        if (confirm('¿Estás seguro de que quieres cancelar el pago?')) {
            volverAlHistorial();
        }
    });
}

// Función para manejar el envío del formulario
async function manejarEnvioFormulario(event) {
    event.preventDefault();
    
    if (!validarFormulario()) return;
    
    setLoadingState(true);
    
    try {
        const { paymentMethod, error } = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
            billing_details: {
                name: document.getElementById('cardholder-name').value,
                email: document.getElementById('email').value,
            },
        });

        if (error) throw new Error(error.message);

        console.log('✅ PaymentMethod creado:', paymentMethod.id);
        await crearSesionPago(paymentMethod.id);
        
    } catch (error) {
        console.error('❌ Error procesando pago:', error);
        mostrarErrorFormulario(error.message);
        setLoadingState(false);
    }
}

// Función para crear sesión de pago - VERSIÓN CORREGIDA
// Solución definitiva - manejar cualquier caso
// En la función crearSesionPago - versión final
async function crearSesionPago(paymentMethodId) {
    try {
        const token = getToken();
        const pedido = appState.currentOrder;
        const customerEmail = document.getElementById('email').value;
        
        console.log('💰 Creando sesión para pedido:', pedido.id);
        
        const response = await fetch('http://localhost:8080/api/pagos/crear-sesion-pedido-existente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                pedidoId: pedido.id,
                customerEmail: customerEmail
            })
        });

        if (!response.ok) throw new Error(`Error ${response.status}`);

        const sessionData = await response.json();
        console.log('📨 Respuesta del backend:', sessionData);
        
        // ESTRATEGIA ROBUSTA
        let success = false;
        
        // Intento 1: Usar sessionId con Stripe.js (si es un ID válido)
        if (sessionData.sessionId && sessionData.sessionId.startsWith('cs_')) {
            console.log('🎯 Intento 1: Usando sessionId con Stripe.js');
            try {
                const result = await stripe.redirectToCheckout({
                    sessionId: sessionData.sessionId
                });
                if (result.error) throw result.error;
                success = true;
                return; // Salir si funciona
            } catch (stripeError) {
                console.warn('❌ Intento 1 falló:', stripeError);
            }
        }
        
        // Intento 2: Redirección directa con checkoutUrl
        if (!success && sessionData.checkoutUrl && sessionData.checkoutUrl.startsWith('https://checkout.stripe.com')) {
            console.log('🎯 Intento 2: Redirección directa a checkoutUrl');
            window.location.href = sessionData.checkoutUrl;
            success = true;
            return;
        }
        
        // Intento 3: Si sessionId es realmente una URL
        if (!success && sessionData.sessionId && sessionData.sessionId.startsWith('https://')) {
            console.log('🎯 Intento 3: sessionId es una URL - redirigiendo');
            window.location.href = sessionData.sessionId;
            success = true;
            return;
        }
        
        // Intento 4: Si checkoutUrl es realmente un sessionId
        if (!success && sessionData.checkoutUrl && sessionData.checkoutUrl.startsWith('cs_')) {
            console.log('🎯 Intento 4: checkoutUrl es un sessionId - usando Stripe.js');
            try {
                const result = await stripe.redirectToCheckout({
                    sessionId: sessionData.checkoutUrl
                });
                if (result.error) throw result.error;
                success = true;
                return;
            } catch (stripeError) {
                console.warn('❌ Intento 4 falló:', stripeError);
            }
        }
        
        if (!success) {
            throw new Error('No se pudo iniciar el proceso de pago. Datos recibidos: ' + JSON.stringify(sessionData));
        }
        
    } catch (error) {
        console.error('❌ Error en crearSesionPago:', error);
        mostrarErrorFormulario('Error al procesar el pago: ' + error.message);
        setLoadingState(false);
    }
}

// Función para confirmar el pago
async function confirmarPago(sessionData) {
    try {
        const { error } = await stripe.confirmCardPayment(sessionData.clientSecret, {
            payment_method: sessionData.paymentMethodId
        });

        if (error) throw new Error(error.message);

        mostrarExito();
        
    } catch (error) {
        throw new Error('Error al confirmar el pago: ' + error.message);
    }
}

// Funciones de utilidad
function validarFormulario() {
    const cardholderName = document.getElementById('cardholder-name');
    const email = document.getElementById('email');
    
    if (!cardholderName.value.trim()) {
        mostrarErrorFormulario('El nombre del titular de la tarjeta es requerido');
        cardholderName.focus();
        return false;
    }
    
    if (!email.value.trim() || !email.validity.valid) {
        mostrarErrorFormulario('Por favor ingrese un correo electrónico válido');
        email.focus();
        return false;
    }
    
    ocultarErrorFormulario();
    return true;
}

function setLoadingState(loading) {
    appState.isLoading = loading;
    const submitButton = document.getElementById('submit-button');
    const buttonText = document.getElementById('button-text');
    const buttonSpinner = document.getElementById('button-spinner');
    
    submitButton.disabled = loading;
    
    if (loading) {
        buttonText.textContent = 'Procesando...';
        buttonSpinner.classList.remove('d-none');
    } else {
        buttonText.textContent = `Pagar $ ${formatearMoneda(appState.currentOrder.total)}`;
        buttonSpinner.classList.add('d-none');
    }
}

function mostrarErrorFormulario(mensaje) {
    const errorElement = document.getElementById('form-errors');
    errorElement.textContent = mensaje;
    errorElement.classList.remove('d-none');
}

function ocultarErrorFormulario() {
    const errorElement = document.getElementById('form-errors');
    errorElement.classList.add('d-none');
    errorElement.textContent = '';
}

function formatearMoneda(monto) {
    return new Intl.NumberFormat('es-CO', {
        minimumFractionDigits: 2
    }).format(monto || 0);
}

function formatearProductos(detalles) {
    if (!detalles || !Array.isArray(detalles)) return 'No especificado';
    return detalles.map(d => `${d.cantidad || 1}x ${d.platoNombre || 'Producto'}`).join(', ');
}

function mostrarLoading(mostrar) {
    const loadingElement = document.getElementById('loading-state');
    if (loadingElement) {
        if (mostrar) {
            loadingElement.classList.remove('d-none');
        } else {
            loadingElement.classList.add('d-none');
        }
    }
}

function mostrarContenidoPrincipal() {
    document.getElementById('order-info-section').classList.remove('d-none');
    document.getElementById('payment-form-container').classList.remove('d-none');
}

function mostrarError(mensaje) {
    mostrarLoading(false);
    const errorElement = document.getElementById('error-state');
    const errorMessage = document.getElementById('error-message');
    
    errorMessage.textContent = mensaje;
    errorElement.classList.remove('d-none');
}

function mostrarExito() {
    document.getElementById('main-content').innerHTML = `
        <div class="alert alert-success text-center" role="alert">
            <i class="bi bi-check-circle-fill me-2"></i>
            <h4>¡Pago Exitoso!</h4>
            <p>Tu pedido #${appState.currentOrder.id} ha sido procesado correctamente.</p>
            <button class="btn btn-primary mt-3" onclick="volverAlHistorial()">
                Volver al Historial
            </button>
        </div>
    `;
}

function volverAlHistorial() {
    router.navigate('/historial-pedidos');
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarPagina);